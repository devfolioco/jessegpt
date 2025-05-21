from __future__ import annotations
import os
import random
import requests

from livekit.agents import Agent, function_tool, get_job_context, JobProcess, RunContext
from livekit.plugins import silero

from voice_agent.constants import mood_insufficient_info_end_messages
from voice_agent.logger import get_logger

logger = get_logger()

# ------------------------------------------------------------------
# Transcript upload ------------------------------------------------
# ------------------------------------------------------------------


def save_conversation(
    room_id: str, transcript: dict, has_enough_information: bool, is_inappropriate: bool
) -> None:
    """Save conversation to the database."""

    # Save to file as backup
    # with open("transcript.json", "w") as f:
    #     json.dump(session.history.to_dict(), f, indent=2)

    datalayer_base_url = os.environ.get("DATALAYER_BASE_URL")
    datalayer_api_key = os.environ.get("DATALAYER_API_KEY")

    if not datalayer_base_url or not datalayer_api_key:
        logger.info(
            "Skipping Devfolio Datalayer API call - required environment variables not defined"
        )
        return

    try:
        response = requests.post(
            f"{datalayer_base_url}miscellaneous/jessegpt/conversations/{room_id}",
            json={
                "messages": transcript,
                "has_enough_information": has_enough_information,
                "is_inappropriate": is_inappropriate,
            },
            headers={"x_api_key": datalayer_api_key},
        )
        response.raise_for_status()
        logger.info("Successfully saved conversation to database")
    except Exception as e:
        logger.error(f"Failed to save conversation to database: {e}")


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
        self,
        context: RunContext,
        has_enough_information: bool,
        is_inappropriate: bool,
        end_message: str,
        super_short_summary: str,
        summary: str,
    ) -> None:  # noqa: D401
        """End the conversation gracefully.

        Parameters
        ----------
        has_enough_information:
            A boolean indicating whether the AI has gathered a reasonable understanding of the user's project idea or main topic of conversation.
            Lean towards True if the user has shared some specifics about their project, even if not every detail is covered.
            If the conversation was very short, or the user did not meaningfully engage or share any project details, set this to False.
            If False, `super_short_summary` and `summary` can be empty, and their content will not be used or sent.
        is_inappropriate:
            A boolean indicating whether the conversation was ended due to
            inappropriate content or behavior. If True, `super_short_summary`
            and `summary` will not be sent, regardless of `has_enough_information`.
        end_message:
            A message to be sent to the user to end the conversation. Respond briefly with your closing remarks, and urge the user to tokenize their idea on Zora. Do make sure to mention Zora.
            This is only applicable and used if `has_enough_information` is True and `is_inappropriate` is False.
            If `has_enough_information` is False or `is_inappropriate` is True, this parameter may be an empty string.
        super_short_summary:
            Craft a highly concise (1-3 words MAX) and impactful phrase that encapsulates the user's project idea. This phrase will complete the sentence "Base is for __" on a shareable image.
            Think creatively:
            *   Aim for a noun or a very short noun phrase.
            *   Make it catchy, memorable, and inspiring if possible.
            *   It should feel like a bold declaration or a core identity for the project.
            *   Examples of good fits: "Global Unity", "Indie Creators", "Transparent Finance", "Healing the Planet", "Decentralized Art".
            *   Ensure it makes perfect sense when read as "Base is for [Your Phrase]".
            *   STRICTLY ADHERE to the 1-3 word limit.
            This is only applicable and used if `has_enough_information` is True and `is_inappropriate` is False.
            If `has_enough_information` is False or `is_inappropriate` is True, this parameter may be an empty string.
        summary:
            A concise yet detailed summary of the user's project idea.
            This is only applicable and used if `has_enough_information` is True and `is_inappropriate` is False.
            If `has_enough_information` is False or `is_inappropriate` is True, this parameter may be an empty string.
        """

        logger.debug(
            f"Ending conversation with has_enough_information: {has_enough_information}, is_inappropriate: {is_inappropriate}, end_message: {end_message}, super_short_summary: {super_short_summary}, summary: {summary}"
        )

        job_context = get_job_context()
        room = job_context.room

        # Stop listening to the user and cancel monitor task as we are ending the conversation
        context.session.input.set_audio_enabled(False)
        context.session.clear_user_turn()

        monitor_task = context.session.userdata.monitor_task
        if monitor_task is not None and not monitor_task.done():
            monitor_task.cancel()

        if not has_enough_information:
            await context.session.say(
                random.choice(
                    mood_insufficient_info_end_messages[context.session.userdata.mood]
                ),
                allow_interruptions=False,
            )

        if has_enough_information and not is_inappropriate:
            await context.session.say(end_message, allow_interruptions=False)

            logger.info(
                "Ending conversation with super_short_summary: %s", super_short_summary
            )
            logger.info("Ending conversation with summary: %s", summary)

            await room.local_participant.send_text(
                super_short_summary, topic="end_conversation_one_liner"
            )

            await room.local_participant.send_text(
                summary, topic="end_conversation_summary"
            )
        else:
            logger.info(
                "Ending conversation: has_enough_information is %s, is_inappropriate is %s. No summary or one-liner sent.",
                has_enough_information,
                is_inappropriate,
            )

        # Send is_inappropriate status
        await room.local_participant.send_text(
            str(is_inappropriate).lower(), topic="is_inappropriate"
        )

        # Send has_enough_information status first
        await room.local_participant.send_text(
            str(has_enough_information).lower(), topic="has_enough_information"
        )

        save_conversation(
            context.session.userdata.room_id,
            context.session.history.to_dict(),
            has_enough_information,
            is_inappropriate,
        )

        await context.session.aclose()


# Unused image generation code — For reference only.
def _generate_image():
    pass
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
