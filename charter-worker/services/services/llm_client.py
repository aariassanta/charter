"""
MiniMax LLM client — agno 1.4.5 compatible.
"""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any

# ── dotenv auto-load (resolver problema de env en workers uvicorn/macOS) ──
_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
if _ENV_PATH.exists():
    from dotenv import load_dotenv
    load_dotenv(_ENV_PATH, override=True)

# ── Configuración ────────────────────────────────────────────────────────────
MINIMAX_API_KEY: str = os.environ.get("MINIMAX_API_KEY", "")
MINIMAX_BASE_URL: str = os.environ.get("MINIMAX_BASE_URL", "https://api.minimax.io/v1")
MINIMAX_MODEL: str = os.environ.get("MINIMAX_MODEL", "MiniMax-M2.7")
OPENROUTER_API_KEY: str = os.environ.get("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL: str = os.environ.get("OPENROUTER_MODEL", "")
TIMEOUT: float = float(os.environ.get("LLM_TIMEOUT", "360"))
MAX_TOKENS: int = int(os.environ.get("LLM_MAX_TOKENS", "40000"))
TEMPERATURE: float = 0.2


def build_llm_model() -> Any:
    """
    Construye un modelo OpenAILike configurado para MiniMax (o OpenRouter).
    Compatible con agno 1.4.5.
    """
    from agno.models.openai.like import OpenAILike

    if MINIMAX_API_KEY:
        return OpenAILike(
            id=MINIMAX_MODEL,
            name=MINIMAX_MODEL,
            api_key=MINIMAX_API_KEY,
            base_url=MINIMAX_BASE_URL,
            max_tokens=MAX_TOKENS,
            timeout=TIMEOUT,
        )

    if OPENROUTER_API_KEY and OPENROUTER_MODEL:
        return OpenAILike(
            id=OPENROUTER_MODEL,
            name=OPENROUTER_MODEL,
            api_key=OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1",
            max_tokens=MAX_TOKENS,
            timeout=TIMEOUT,
        )

    raise RuntimeError(
        "No hay proveedor LLM configurado. "
        "Define MINIMAX_API_KEY o OPENROUTER_API_KEY en .env"
    )
