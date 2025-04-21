from dotenv import load_dotenv

import logging
import time
import asyncio

from livekit.agents import (cli, JobProcess, JobContext, WorkerOptions, AutoSubscribe, metrics)
from livekit.agents import AgentSession, Agent
from livekit.plugins import (
    openai,
    elevenlabs,
    deepgram,
    silero,
)
from livekit.plugins.turn_detector.english import EnglishModel

from prompts import excited_system_prompt, excited_initial_prompt, critical_system_prompt, critical_initial_prompt

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
GOODBYE_DELAY = 3

logger = logging.getLogger("jessexbt")

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


class Assistant(Agent):
    def __init__(self, system_prompt: str) -> None:
        super().__init__(instructions=system_prompt)


async def entrypoint(ctx: JobContext):
    usage_collector = metrics.UsageCollector()

    # State variables
    last_interaction_time = time.time()
    still_there_prompt_sent = False
    is_agent_speaking = False
    is_user_speaking = False

    def reset_timeout():
        nonlocal still_there_prompt_sent, last_interaction_time
        still_there_prompt_sent = False
        last_interaction_time = time.time()

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: ${summary}")

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
            await session.generate_reply("The user has been inactive for a while. Ask them if they are still there.")

    async def monitor_interaction():
        while True:
            logger.info(f"is_agent_speaking: {is_agent_speaking}, is_user_speaking: {is_user_speaking}, still_there_prompt_sent: {still_there_prompt_sent}")
            if (is_agent_speaking or is_user_speaking) and not still_there_prompt_sent:
                reset_timeout()
            if await should_end_call():
                logger.info("Ending call due to inactivity.")
                await session.generate_reply("The user has been inactive for too long. Say goodbye and end the call.")
                await asyncio.sleep(GOODBYE_DELAY)
                await hangup()
                break
            await send_agent_prompt()
            await asyncio.sleep(1)  # Check every second

    logger.info(f"Connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    session = AgentSession(
        stt=deepgram.STT(model="nova-3", language="en-US"),
        llm=openai.LLM(model="gpt-4o"),
        tts=elevenlabs.TTS(
            model="eleven_multilingual_v2",
            voice_id="TX3LPaxmHKxFdv7VOQHJ",
        ),
        vad=ctx.proc.userdata["vad"],
        turn_detection=EnglishModel(),
    )

    mood = ctx.room.name.split('_')[0]
    print(f"MOOD: {mood}")

    system_prompt = mood_system_prompts[mood]
    initial_prompt = mood_initial_prompts[mood]

    agent = Assistant(system_prompt)

    # Event handlers
    @session.on("agent_started_speaking")
    def _on_agent_started_speaking():
        nonlocal is_agent_speaking
        is_agent_speaking = True
        logger.info("Agent started speaking")
        if not still_there_prompt_sent:
            reset_timeout()

    @session.on("agent_stopped_speaking")
    def _on_agent_stopped_speaking():
        nonlocal is_agent_speaking
        is_agent_speaking = False
        logger.info("Agent stopped speaking")
        if not still_there_prompt_sent:
            reset_timeout()

    @session.on("user_started_speaking")
    def _on_user_started_speaking():
        nonlocal is_user_speaking
        is_user_speaking = True
        logger.info("User started speaking")
        reset_timeout()

    @session.on("user_stopped_speaking")
    def _on_user_stopped_speaking():
        nonlocal is_user_speaking
        is_user_speaking = False
        logger.info("User stopped speaking")
        reset_timeout()

    await session.start(
        room=ctx.room,
        agent=agent
    )

    ctx.add_shutdown_callback(log_usage)
    asyncio.create_task(monitor_interaction())


    await session.generate_reply(
        instructions=initial_prompt
    )


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))