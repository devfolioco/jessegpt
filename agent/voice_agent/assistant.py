from __future__ import annotations
import asyncio
import base64
from functools import partial

from livekit.agents import Agent, RunContext, function_tool, get_job_context, JobProcess
from livekit.plugins import silero
from openai import OpenAI

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
        self, context: RunContext, image_prompt: str, one_liner: str
    ) -> None:  # noqa: D401
        """End the conversation gracefully.

                Parameters
                ----------
                one_liner:
                    A punchy summary to send to the user before disconnecting.
                image_prompt:
                    A prompt to generate an image embodying the user's project idea. Please follow the following guidelines when generating the image prompt:

                    You are a creative AI specializing in translating abstract technological concepts into vivid visual descriptions for image generation.
        You possess context detailing a specific tech project idea. Your objective is to craft a highly detailed and exceptionally clear image prompt. This prompt should instruct an image generation AI to render a sprawling, fantastical cyberpunk scene that profoundly captures the innate vibe and core essence of the project idea you understand.

        Focus on these critical steps when formulating the image prompt:

        Distill the Vibe: Based on the project context, identify the fundamental feeling or atmosphere the tech idea evokes (e.g., awe, melancholy, connection, isolation, chaotic energy, streamlined transcendence). This vibe should permeate the entire scene description.
        Forge Visual Metaphors: Invent powerful, imaginative visual symbols or elements within the scene that represent the project's function, impact, or underlying philosophy. Think beyond literal representation (e.g., AI collaboration visualized as interwoven light constructs, data privacy as shimmering energy fields around structures, decentralized systems as floating islands interconnected by energy bridges).
        Weave Cyberpunk & Fantasy: Seamlessly blend iconic cyberpunk aesthetics (towering neon-lit megastructures, rain-slicked streets, holographic advertisements, advanced cybernetics, visible data flows) with distinctly fantastical elements (impossible architecture defying physics, bio-luminescent flora/fauna integrated with technology, arcane-looking symbols glowing on circuits, surreal atmospheric phenomena or sky-scapes, perhaps even cybernetically augmented mythical creatures).
        Paint with Detail: Describe the key elements of the scene – the environment, unique technological features, the mood, atmospheric conditions, the quality and sources of light (consider dramatic contrasts, volumetric rays, neon glow, bioluminescence, iridescent surfaces), and the dominant color palette – using rich, specific, and evocative language. Aim for clarity that leaves little ambiguity for the image generator.
        The resulting image prompt should be a compelling and descriptive narrative of the desired scene, enabling an image generation model to create a visually stunning and conceptually relevant artwork based on the tech idea.

        Crucially, ensure the final image prompt you generate contains absolutely no instructions for rendering specific text, words, or lettering within the image itself. Focus entirely on the visual composition, atmosphere, and elements. Be explicit in the prompt about not rendering any text.
        """

        logger.info("Ending conversation with one_liner: %s", one_liner)
        logger.info("Ending conversation with image_prompt: %s", image_prompt)

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

        logger.debug("Generating image")

        def _generate_image(prompt: str) -> bytes:
            """Blocking helper that generates an image and returns its raw bytes.

            This function is executed in a background thread via *run_in_executor* to
            avoid blocking the event loop with a synchronous HTTP request.
            """

            oai = OpenAI()
            result = oai.images.generate(
                model="gpt-image-1",
                prompt=prompt,
                output_format="png",
                quality="high",
                size="1024x1536",
            )
            image_base64 = result.data[0].b64_json
            return base64.b64decode(image_base64)

        loop = asyncio.get_running_loop()
        image_bytes: bytes = await loop.run_in_executor(
            None, partial(_generate_image, image_prompt)
        )

        # save image bytes to a file
        with open("image.png", "wb") as f:
            f.write(image_bytes)

        logger.debug("Image Generated - Streaming image")

        # Stream the image bytes in manageable chunks (recommended max 15KB each)
        writer = await room.local_participant.stream_bytes(
            name="end_conversation_image",
            topic="end_conversation_image",
            mime_type="image/png",
        )

        chunk_size = 15_000  # 15 KB per chunk, recommended max chunk size -> @ref https://docs.livekit.io/home/client/data/byte-streams/#streaming-bytes
        for idx in range(0, len(image_bytes), chunk_size):
            await writer.write(image_bytes[idx : idx + chunk_size])

        await writer.aclose()

        logger.debug("Streamed image, disconnecting from room")

        await context.session.aclose()
