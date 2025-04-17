from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import (
    openai,
    elevenlabs,
    deepgram,
    noise_cancellation,
    silero,
)
from livekit.plugins.turn_detector.multilingual import MultilingualModel

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


class Assistant(Agent):
    def __init__(self, system_prompt: str) -> None:
        super().__init__(instructions=system_prompt)


async def entrypoint(ctx: agents.JobContext):
    await ctx.connect()

    session = AgentSession(
        stt=deepgram.STT(model="nova-3", language="multi"),
        llm=openai.LLM(model="gpt-4o"),
        tts=elevenlabs.TTS(
            model="eleven_multilingual_v2",
            voice_id="TX3LPaxmHKxFdv7VOQHJ",
        ),
        vad=silero.VAD.load(),
        turn_detection=MultilingualModel(),
    )

    mood = ctx.room.name.split('_')[0]
    print(f"MOOD: {mood}")

    system_prompt = mood_system_prompts[mood]
    initial_prompt = mood_initial_prompts[mood]

    await session.start(
        room=ctx.room,
        agent=Assistant(system_prompt),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    await session.generate_reply(
        instructions=initial_prompt
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))