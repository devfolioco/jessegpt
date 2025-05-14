from voice_agent.prompts.prompts import (
    excited_system_prompt,
    critical_system_prompt,
    excited_initial_prompt,
    critical_initial_prompt,
    excited_greetings,
    critical_greetings,
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

mood_initial_greetings = {"excited": excited_greetings, "critical": critical_greetings}

# ---- Timing configuration ----
TIMEOUT_SECONDS = 30
TIMEOUT_WARNING_TIME = 10
SPEAK_DELAY = 3
MAX_CALL_DURATION = 200
CALL_DURATION_WARNING_TIME = 100
