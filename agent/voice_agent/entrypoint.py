from __future__ import annotations

import asyncio
import json
import os
import time
from datetime import datetime
from typing import Optional

import boto3

from livekit.agents import (
    AgentSession,
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    cli,
)
from livekit.plugins import deepgram, elevenlabs, openai
from livekit.plugins.elevenlabs import VoiceSettings
from livekit.plugins.turn_detector.english import EnglishModel

from voice_agent.assistant import Assistant, prewarm
from voice_agent.constants import (
    CALL_DURATION_WARNING_TIME,
    MAX_CALL_DURATION,
    PROMPT_WARNING_TIME,
    SPEAK_DELAY,
    TIMEOUT_SECONDS,
    mood_initial_prompts,
    mood_system_prompts,
)
from voice_agent.logger import get_logger

logger = get_logger()


async def entrypoint(ctx: JobContext):  # noqa: C901 – keep high complexity for now
    """Entrypoint for LiveKit worker processes.

    This function closely mirrors the original implementation in *main.py* but is
    organised for readability. The LiveKit lifecycle (connect → create session →
    event-loop) remains unchanged so behaviour stays identical.
    """

    # ---------------------------------------------------------------------
    # Connect to the room and derive mood from room name prefix
    # ---------------------------------------------------------------------
    logger.info("Connecting to room %s", ctx.room.name)
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    try:
        mood = ctx.room.name.split("_")[0]
    except ValueError:
        logger.warning("Room name does not contain a mood prefix – using default mood")
        mood = "excited"  # sensible default
    logger.debug("Conversation mood resolved to '%s'", mood)

    system_prompt = mood_system_prompts[mood]
    initial_prompt = mood_initial_prompts[mood]

    # ------------------------------------------------------------------
    # Create the Agent session with STT/LLM/TTS building blocks
    # ------------------------------------------------------------------
    session = AgentSession(
        stt=deepgram.STT(model="nova-3", language="en-US"),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=elevenlabs.TTS(
            model="eleven_multilingual_v2",
            voice_id="goljFZPfRhM9ZkyHrOmQ",
            voice_settings=VoiceSettings(
                speed=0.86,
                stability=0.3,
                similarity_boost=0.7,
                style=0.10,
                use_speaker_boost=True,
            ),
        ),
        vad=ctx.proc.userdata["vad"],
        turn_detection=EnglishModel(),
    )

    # Agent that will power the conversation
    agent = Assistant(system_prompt)

    # ------------------------------------------------------------------
    # Local state tracking – kept as simple primitives to avoid overhead
    # ------------------------------------------------------------------
    last_interaction_time: Optional[float] = time.time()
    still_there_prompt_sent = False
    is_agent_speaking = False
    is_user_speaking = False
    call_start_time = time.time()
    duration_warning_sent = False

    # Convenience -----------------------------------------------------------------

    def reset_timeout() -> None:
        nonlocal still_there_prompt_sent, last_interaction_time
        still_there_prompt_sent = False
        last_interaction_time = time.time()

    async def hangup() -> None:
        logger.info("Idle too long, hanging up")
        try:
            await ctx.room.disconnect()
        except Exception as exc:  # pragma: no cover – best-effort clean-up
            logger.warning("Error while ending call: %s", exc)

    # ------------------------------------------------------------------
    # Transcript handling ------------------------------------------------
    # ------------------------------------------------------------------

    async def upload_transcript() -> None:
        """Serialize *session* history and upload to S3 bucket (if configured)."""

        if len(session.history.items) == 0:
            logger.debug("Skipping transcript upload for empty transcript")
            return

        bucket = os.environ.get("S3_BUCKET_NAME")
        if not bucket:
            logger.debug("S3_BUCKET_NAME not configured – skipping transcript upload")
            return

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        key = f"transcripts/{ctx.room.name}_{timestamp}.json"
        logger.info("Uploading transcript to s3://%s/%s", bucket, key)

        payload = json.dumps(session.history.to_dict(), indent=2)
        s3 = boto3.client("s3")
        try:
            s3.put_object(
                Bucket=bucket,
                Key=key,
                Body=payload,
                ContentType="application/json",
            )
        except Exception as exc:  # pragma: no cover – network errors
            logger.error("Failed to upload transcript: %s", exc)

    ctx.add_shutdown_callback(upload_transcript)

    # ------------------------------------------------------------------
    # Helper coroutines --------------------------------------------------
    # ------------------------------------------------------------------

    async def should_end_call() -> bool:
        """Return ``True`` when the idle-timeout is passed."""
        nonlocal still_there_prompt_sent
        idle_time = int(time.time() - (last_interaction_time or time.time()))

        if idle_time >= PROMPT_WARNING_TIME:
            logger.debug(
                "Idle time: %d (Prompt sent: %s, Agent speaking: %s, User speaking: %s)",
                idle_time,
                still_there_prompt_sent,
                is_agent_speaking,
                is_user_speaking,
            )
        if is_agent_speaking or is_user_speaking:
            return False
        return idle_time > TIMEOUT_SECONDS

    async def send_idle_prompt() -> None:
        nonlocal still_there_prompt_sent
        if is_agent_speaking or is_user_speaking:
            return

        if (
            time.time() - (last_interaction_time or time.time()) >= PROMPT_WARNING_TIME
            and not still_there_prompt_sent
        ):
            logger.info("Sending idle prompt to user")
            still_there_prompt_sent = True
            await session.generate_reply(
                instructions=(
                    "The user has been inactive for a while. EXPLICITLY ask them if they "
                    "are still there and if they'd like to continue the conversation."
                ),
                allow_interruptions=True,
            )

    async def monitor_interaction() -> None:
        nonlocal duration_warning_sent
        while True:
            logger.info(
                "is_agent_speaking=%s | is_user_speaking=%s | still_there_prompt_sent=%s",
                is_agent_speaking,
                is_user_speaking,
                still_there_prompt_sent,
            )

            # Reset idle timer when either party is talking
            if (is_agent_speaking or is_user_speaking) and not still_there_prompt_sent:
                reset_timeout()

            # ---- Call duration monitoring ----------------------------------
            elapsed = int(time.time() - call_start_time)

            if elapsed >= CALL_DURATION_WARNING_TIME and not duration_warning_sent:
                logger.info("Sending call duration warning")
                session.interrupt()
                session.clear_user_turn()
                await session.say(
                    "You have about one minute left in this conversation. "
                    "Please wrap up any important points you'd like to discuss!"
                )
                await asyncio.sleep(SPEAK_DELAY)
                duration_warning_sent = True

            if elapsed >= MAX_CALL_DURATION:
                logger.info("Max call duration reached – wrapping up")
                session.interrupt()
                session.clear_user_turn()
                await session.say(
                    "Aha! This was fun, but I'm afraid that's all that we have for "
                    "today. I can't wait to see your idea come to life during "
                    "Onchain Summer! Stay based, and never stop building!!"
                )
                await asyncio.sleep(SPEAK_DELAY * 2)
                await session.generate_reply(
                    instructions=(
                        "The conversation has concluded. Please call the `end_conversation` "
                        "function to end the call..."
                    ),
                    allow_interruptions=False,
                )
                await asyncio.sleep(SPEAK_DELAY)
                break

            # ---- Idle timeout ---------------------------------------------
            if await should_end_call():
                logger.info("Ending call due to inactivity")
                await session.generate_reply(
                    instructions=(
                        "The user has been inactive for too long. EXPLICITLY say goodbye "
                        "and call the `end_conversation` function to end the call..."
                    ),
                    allow_interruptions=False,
                )
                await asyncio.sleep(SPEAK_DELAY)
                await hangup()
                break

            await send_idle_prompt()
            await asyncio.sleep(1)

    # ------------------------------------------------------------------
    # Register event handlers -------------------------------------------
    # ------------------------------------------------------------------

    @session.on("agent_state_changed")
    def _on_agent_state_changed(ev):
        nonlocal is_agent_speaking
        logger.info("Agent state changed from %s to %s", ev.old_state, ev.new_state)
        is_agent_speaking = ev.new_state == "speaking"
        if not is_agent_speaking:
            logger.info("Agent stopped speaking")
        reset_timeout()

    @session.on("user_state_changed")
    def _on_user_state_changed(ev):
        nonlocal is_user_speaking
        logger.info("User state changed from %s to %s", ev.old_state, ev.new_state)
        is_user_speaking = ev.new_state == "speaking"
        reset_timeout()

    # ------------------------------------------------------------------
    # Kick off the conversation -----------------------------------------
    # ------------------------------------------------------------------

    await session.start(room=ctx.room, agent=agent)

    await session.generate_reply(instructions=initial_prompt, allow_interruptions=False)
    await asyncio.sleep(SPEAK_DELAY)

    # Start monitoring loop (fire-and-forget)
    asyncio.create_task(monitor_interaction())

    # Example starter message via data-channel
    await ctx.room.local_participant.send_text(
        "Hello, this is just a test", topic="hello"
    )


# ----------------------------------------------------------------------
# Convenience bootstrap (so `python -m voice_agent` just works) ---------
# ----------------------------------------------------------------------


def run_from_cli() -> None:
    """Spawn a LiveKit worker using :pyfunc:`entrypoint`."""
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
