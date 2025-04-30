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
    async def end_conversation(
        self, context: RunContext, one_liner: str, summary: str
    ) -> None:  # noqa: D401
        """End the conversation gracefully.

        Parameters
        ----------
        one_liner:
            A punchy summary to send to the user before disconnecting.
        summary:
            A concise yet detailed summary of the user's project idea.
        """

        logger.info("Ending conversation with one_liner: %s", one_liner)
        logger.info("Ending conversation with summary: %s", summary)

        job_context = get_job_context()
        room = job_context.room

        # Stop listening to the user while we wrap up the conversation
        context.session.input.set_audio_enabled(False)
        context.session.clear_user_turn()

        # Cancel the monitor interaction task if it exists
        monitor_task = job_context.proc.userdata.get("monitor_task")
        if monitor_task is not None and not monitor_task.done():
            monitor_task.cancel()

        await room.local_participant.send_text(
            one_liner, topic="end_conversation_one_liner"
        )

        await room.local_participant.send_text(
            summary, topic="end_conversation_summary"
        )

        # logger.debug("Generating image")

        # def _generate_image(prompt: str) -> bytes:
        #     """Blocking helper that generates an image and returns its raw bytes.

        #     This function is executed in a background thread via *run_in_executor* to
        #     avoid blocking the event loop with a synchronous HTTP request.
        #     """

        #     oai = OpenAI()
        #     result = oai.images.generate(
        #         model="gpt-image-1",
        #         prompt=prompt,
        #         output_format="png",
        #         quality="high",
        #         size="1024x1536",
        #     )
        #     image_base64 = result.data[0].b64_json
        #     return base64.b64decode(image_base64)

        # loop = asyncio.get_running_loop()
        # image_bytes: bytes = await loop.run_in_executor(
        #     None, partial(_generate_image, image_prompt)
        # )

        # # save image bytes to a file
        # with open("image.png", "wb") as f:
        #     f.write(image_bytes)

        # logger.debug("Image Generated - Streaming image")

        # # Stream the image bytes in manageable chunks (recommended max 15KB each)
        # writer = await room.local_participant.stream_bytes(
        #     name="end_conversation_image",
        #     topic="end_conversation_image",
        #     mime_type="image/png",
        # )

        # chunk_size = 15_000  # 15 KB per chunk, recommended max chunk size -> @ref https://docs.livekit.io/home/client/data/byte-streams/#streaming-bytes
        # for idx in range(0, len(image_bytes), chunk_size):
        #     await writer.write(image_bytes[idx : idx + chunk_size])

        # await writer.aclose()

        # logger.debug("Streamed image, disconnecting from room")

        await context.session.aclose()
