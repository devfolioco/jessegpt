from datetime import datetime
import json
from dotenv import load_dotenv

import logging
import time
import asyncio

from livekit.agents import (Agent, AgentSession, cli, JobProcess, JobContext, RunContext, WorkerOptions, AutoSubscribe, tokenize, function_tool, get_job_context)
from livekit.agents.tts import StreamAdapter

from livekit.plugins import (
    openai,
    smallest,
    elevenlabs,
    deepgram,
    silero
)
from livekit.plugins.elevenlabs import VoiceSettings
from livekit.plugins.turn_detector.english import EnglishModel

from prompts import (
    excited_system_prompt, excited_initial_prompt,
    critical_system_prompt, critical_initial_prompt,
)

load_dotenv()

mood_system_prompts = {
    "excited": excited_system_prompt,
    "critical": critical_system_prompt,
}

mood_initial_prompts = {
    "excited": excited_initial_prompt,
    "critical": critical_initial_prompt,
}

TIMEOUT_SECONDS = 30
PROMPT_WARNING_TIME = 10
SPEAK_DELAY = 3
MAX_CALL_DURATION = 120  # 2 minutes in seconds
CALL_DURATION_WARNING_TIME = 60  # 1 minute in seconds

logger = logging.getLogger("jessexbt")

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


class Assistant(Agent):
    def __init__(self, system_prompt: str) -> None:
        super().__init__(instructions=system_prompt)

    @function_tool()
    async def end_conversation(
        self,
        context: RunContext,
        one_liner: str,
    ) -> None:
        """End the conversation.
        
        Args:
            one_liner: A one-line summary of the conversation. Be witty and concise.
        """
        logger.info(f"Ending conversation with one-liner: {one_liner}")
        
        room = get_job_context().room
        
        await room.local_participant.send_text(one_liner, topic="end_conversation")
        await room.disconnect()


async def entrypoint(ctx: JobContext):
    # State variables
    last_interaction_time = None
    still_there_prompt_sent = False
    is_agent_speaking = False
    is_user_speaking = False
    call_start_time = time.time()
    duration_warning_sent = False

    logger.info(f"Connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    mood = ctx.room.name.split('_')[0]
    print(f"MOOD: {mood}")

    system_prompt = mood_system_prompts[mood]
    initial_prompt = mood_initial_prompts[mood]

    smallest_tts = StreamAdapter(
        tts=smallest.TTS(model="lightning-large", voice="zorin"),
        sentence_tokenizer=tokenize.basic.SentenceTokenizer(),
    )

    session = AgentSession(
        stt=deepgram.STT(model="nova-3", language="en-US"),
        llm=openai.LLM(model="gpt-4.1-mini-2025-04-14"),
        tts=elevenlabs.TTS(model="eleven_multilingual_v2", voice_id="goljFZPfRhM9ZkyHrOmQ",
                           voice_settings=VoiceSettings(
                               speed=0.86,
                               stability=0.3,
                               similarity_boost=0.7,
                               style=0.10,
                               use_speaker_boost=True
                            )),
        vad=ctx.proc.userdata["vad"],
        turn_detection=EnglishModel(),
    )

    agent = Assistant(system_prompt)

    def reset_timeout():
        nonlocal still_there_prompt_sent, last_interaction_time
        still_there_prompt_sent = False
        last_interaction_time = time.time()

    async def shutdown_handler():
        current_date = datetime.now().strftime("%Y%m%d_%H%M%S")

        filename = f"./transcripts/transcript_{ctx.room.name}_{current_date}.json"
        
        with open(filename, 'w') as f:
            json.dump(session.history.to_dict(), f, indent=2)
            
        print(f"Transcript for {ctx.room.name} saved to {filename}")

    async def hangup():
        logger.info("Idle too long, hanging up")
        try:
            await ctx.room.disconnect()
        except Exception as e:
            logger.warning(f"Error while ending call: {e}")

    async def should_end_call():
        nonlocal still_there_prompt_sent
        idle_time = int(time.time() - last_interaction_time)
        if idle_time >= PROMPT_WARNING_TIME:
            logger.debug(f"Idle time: {idle_time} (Prompt sent: {still_there_prompt_sent}, Agent speaking: {is_agent_speaking}, User speaking: {is_user_speaking})")
        if is_agent_speaking or is_user_speaking:
            return False
        return idle_time > TIMEOUT_SECONDS

    async def send_agent_prompt():
        nonlocal still_there_prompt_sent
        if is_agent_speaking or is_user_speaking:
            return
        if time.time() - last_interaction_time >= PROMPT_WARNING_TIME and not still_there_prompt_sent:
            logger.info("Sending idle too long prompt")
            still_there_prompt_sent = True
            await session.generate_reply(instructions="The user has been inactive for a while. EXPLICITLY ask them if they are still there and if they'd like to continue the conversation.", allow_interruptions=True)

    async def monitor_interaction():
        nonlocal duration_warning_sent
        while True:
            logger.info(f"is_agent_speaking: {is_agent_speaking}, is_user_speaking: {is_user_speaking}, still_there_prompt_sent: {still_there_prompt_sent}")
            if (is_agent_speaking or is_user_speaking) and not still_there_prompt_sent:
                reset_timeout()
            # --- Call Duration Monitoring ---
            elapsed_call_time = int(time.time() - call_start_time)
            if elapsed_call_time >= CALL_DURATION_WARNING_TIME and not duration_warning_sent:
                logger.info("Sending call duration warning prompt")
                duration_warning_sent = True
                await session.generate_reply(instructions="You have about one minute left in this conversation. Please wrap up any important points you'd like to discuss!", allow_interruptions=True)
            if elapsed_call_time >= MAX_CALL_DURATION:
                logger.info("Ending call due to max duration.")
                await session.generate_reply(instructions="The maximum call duration has been reached. EXPLICITLY say goodbye and call the `end_conversation` function to end the call... And DO NTO forget to say goodbye to the user", allow_interruptions=False)
                await asyncio.sleep(SPEAK_DELAY)
                # await hangup() <-- uncomment this if we want the call to abruptly end when the max duration is reached
                break
            # --- End Call if Idle ---
            if await should_end_call():
                logger.info("Ending call due to inactivity.")
                await session.generate_reply(instructions="The user has been inactive for too long. EXPLICITLY Say goodbye and call the `end_conversation` function to the end the call... And DO NTO forget to say goodbye to the user", allow_interruptions=False)
                await asyncio.sleep(SPEAK_DELAY)
                await hangup()
                break
            await send_agent_prompt()
            await asyncio.sleep(1)  # Check every second

    # Event handlers
    @session.on("agent_state_changed")
    def _on_agent_state_changed(ev):
        logger.info(f"Agent state changed from {ev.old_state} to {ev.new_state}")
        nonlocal is_agent_speaking
        if ev.new_state == "speaking":
            is_agent_speaking = True
            logger.info("Agent started speaking")
        else:
            is_agent_speaking = False
            logger.info("Agent stopped speaking")
        if not still_there_prompt_sent:
            reset_timeout()

    @session.on("user_state_changed")
    def _on_user_state_changed(ev):
        logger.info(f"User state changed from {ev.old_state} to {ev.new_state}")
        nonlocal is_user_speaking
        if ev.new_state == "speaking":
            is_user_speaking = True
            logger.info("User started speaking")
        else:
            is_user_speaking = False
            logger.info("User stopped speaking")

        reset_timeout()

    await session.start(
        room=ctx.room,
        agent=agent
    )

    ctx.add_shutdown_callback(shutdown_handler)

    await session.generate_reply(
        instructions=initial_prompt, allow_interruptions=False
    )

    await asyncio.sleep(SPEAK_DELAY)

    asyncio.create_task(monitor_interaction())


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))