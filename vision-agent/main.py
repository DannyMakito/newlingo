import os
from pathlib import Path
from dotenv import dotenv_values
from vision_agents.core import Agent, Runner, AgentLauncher, User
from vision_agents.plugins.getstream import Edge

# --- CHANGED: Swapped OpenAI for Gemini ---
from vision_agents.plugins.gemini import Realtime

VISION_AGENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = VISION_AGENT_DIR.parent

AI_TEACHER_USER_ID = "ai_teacher"


def load_env_file(path: Path, override: bool = False) -> None:
    for key, value in dotenv_values(path).items():
        if not value:
            continue

        if override or key not in os.environ:
            os.environ[key] = value


# Load shared app secrets first, then allow non-empty vision-agent/.env values to override them.
load_env_file(PROJECT_ROOT / ".env")
load_env_file(VISION_AGENT_DIR / ".env", override=True)

if not os.getenv("STREAM_API_KEY") and os.getenv("EXPO_PUBLIC_STREAM_API_KEY"):
    os.environ["STREAM_API_KEY"] = os.environ["EXPO_PUBLIC_STREAM_API_KEY"]

if not os.getenv("STREAM_API_KEY") and os.getenv("GETSTREAM_API_KEY"):
    os.environ["STREAM_API_KEY"] = os.environ["GETSTREAM_API_KEY"]

if not os.getenv("STREAM_API_SECRET") and os.getenv("GETSTREAM_API_SECRET"):
    os.environ["STREAM_API_SECRET"] = os.environ["GETSTREAM_API_SECRET"]


def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(
            f"Missing {name}. Add it to the repo root .env or vision-agent/.env."
        )
    return value


def get_custom_data(request: dict | None) -> dict:
    if not request:
        return {}

    custom = request.get("custom")
    if isinstance(custom, dict):
        return custom

    call = request.get("call")
    if isinstance(call, dict):
        custom = call.get("custom")
        if isinstance(custom, dict):
            return custom

    return {}


def build_instructions(custom: dict) -> str:
    language_name = custom.get("languageName") or custom.get("languageId") or "the target language"
    lesson_title = custom.get("lessonTitle") or "this lesson"
    lesson_description = custom.get("lessonDescription") or ""
    goals = custom.get("goals") or []
    vocabulary = custom.get("vocabulary") or []
    phrases = custom.get("phrases") or []
    ai_prompt = custom.get("aiTeacherPrompt") or ""

    goals_text = ", ".join(goals) if goals else "the lesson goals"

    instructions = (
        f"You are a friendly, encouraging AI language teacher for {language_name}. "
        f"You must strictly speak in English by default, but your goal is to help the user learn {language_name}. "
        f"You are teaching the lesson \"{lesson_title}\". "
    )

    if lesson_description:
        instructions += f"Lesson summary: {lesson_description}. "

    instructions += (
        f"Stay strictly within this lesson's goals: {goals_text}. "
        f"Do not teach unrelated topics or switch to other languages. "
        f"When appropriate, introduce words in {language_name} slowly with English translations. "
        f"Use short natural sentences with gentle encouragement. "
        f"Keep responses concise and highly interactive since this is a real-time voice call."
    )

    if vocabulary:
        vocab_lines = []
        for item in vocabulary:
            line = f'- "{item.get("word")}" means "{item.get("translation")}"'
            pronunciation = item.get("pronunciation")
            if pronunciation:
                line += f" (pronounced: {pronunciation})"
            vocab_lines.append(line)
        instructions += "\n\nVocabulary for this lesson:\n" + "\n".join(vocab_lines)

    if phrases:
        phrase_lines = []
        for item in phrases:
            line = f'- "{item.get("phrase")}" means "{item.get("translation")}"'
            pronunciation = item.get("pronunciation")
            if pronunciation:
                line += f" (pronounced: {pronunciation})"
            phrase_lines.append(line)
        instructions += "\n\nPhrases for this lesson:\n" + "\n".join(phrase_lines)

    if ai_prompt:
        instructions += f"\n\nLesson-specific guidance:\n{ai_prompt}"

    return instructions


async def create_agent(request: dict | None = None, **kwargs) -> Agent:
    """
    Configure and return the Agent instance.
    The agent acts as an AI language teacher, conversing strictly in English by default,
    while teaching the user their chosen language.
    """
    custom = get_custom_data(request)
    instructions = build_instructions(custom)

    require_env("STREAM_API_KEY")
    require_env("STREAM_API_SECRET")
    
    # --- CHANGED: Require Gemini API Key instead of OpenAI ---
    require_env("GEMINI_API_KEY")

    return Agent(
        edge=Edge(headless=True),
        llm=Realtime(),
        agent_user=User(id=AI_TEACHER_USER_ID, name="AI Teacher"),
        instructions=instructions,
    )


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs):
    """
    Lifecycle method: what happens when the agent joins a call.
    Uses the agent's context manager to stay alive until the call finishes.
    """
    call = await agent.create_call(call_type, call_id)

    async with agent.join(call):
        if call_type == "audio_room":
            go_live_result = call.go_live()
            if hasattr(go_live_result, "__await__"):
                await go_live_result

        await agent.finish()


if __name__ == "__main__":
    Runner(AgentLauncher(create_agent=create_agent, join_call=join_call)).cli()