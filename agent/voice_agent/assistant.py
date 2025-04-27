from __future__ import annotations

from livekit.agents import Agent, RunContext, function_tool, get_job_context, JobProcess
from livekit.plugins import silero

from voice_agent.logger import get_logger

logger = get_logger()


# ---------------------------------------------------------------------------
# Pre-warm helpers -----------------------------------------------------------
# ---------------------------------------------------------------------------


def prewarm(proc: JobProcess) -> None:
    """Load heavy models once per worker process.

    The VAD model from *silero* is small but non-trivial to load. Doing it in the
    process bootstrap means follow-up calls can reuse the already loaded model
    via ``proc.userdata``.
    """
    proc.userdata["vad"] = silero.VAD.load()


# ---------------------------------------------------------------------------
# Core Agent ----------------------------------------------------------------
# ---------------------------------------------------------------------------


class Assistant(Agent):
    """Conversation agent that also exposes a *end_conversation* tool."""

    def __init__(self, system_prompt: str) -> None:  # noqa: D401
        """Create a new Assistant with *system_prompt* as its instructions."""
        super().__init__(instructions=system_prompt)

    # ------------------------------------------------------------------
    # Tooling -----------------------------------------------------------
    # ------------------------------------------------------------------

    @function_tool()
    async def end_conversation(self, context: RunContext, one_liner: str) -> None:  # noqa: D401
        """End the conversation gracefully.

        Parameters
        ----------
        one_liner:
            A punchy summary to send to the user before disconnecting.
        """

        logger.info("Ending conversation with one-liner: %s", one_liner)

        room = get_job_context().room
        await room.local_participant.send_text(one_liner, topic="end_conversation")
        await room.disconnect()
