from voice_agent.prompts.prompts import (
    excited_system_prompt,
    critical_system_prompt,
    excited_initial_prompt,
    critical_initial_prompt,
)

# Mapping from the room mood prefix to the correct prompts
mood_system_prompts = {
    "excited": excited_system_prompt,
    "critical": critical_system_prompt,
}

mood_initial_prompts = {
    "excited": excited_initial_prompt,
    "critical": critical_initial_prompt,
}

# ---- Timing configuration ----
TIMEOUT_SECONDS = 30
PROMPT_WARNING_TIME = 15
SPEAK_DELAY = 3
MAX_CALL_DURATION = 360
CALL_DURATION_WARNING_TIME = 300
