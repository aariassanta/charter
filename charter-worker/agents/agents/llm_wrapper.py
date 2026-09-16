"""
Wrappers de Agno para DossierTeam.
Compatible con agno 1.4.5.
"""
from __future__ import annotations

import asyncio
import json
import logging
import re
from typing import Any

from agno.agent.agent import Agent

from services.llm_client import build_llm_model, TIMEOUT, MAX_TOKENS

logger = logging.getLogger("charter.llm")


# ── Tool: str → JSON ──────────────────────────────────────────────────────────
async def str_to_json_tool(message: str) -> str:
    """Extrae y valida JSON de la respuesta de un agent."""
    try:
        return json.dumps(json.loads(message), ensure_ascii=False, indent=2)
    except Exception:
        pass

    for pat in [r"```json\s*(\{.*?\})\s*```", r"```\s*(\{.*?\})\s*```"]:
        m = re.search(pat, message, re.DOTALL)
        if m:
            try:
                return json.dumps(json.loads(m.group(1)), ensure_ascii=False, indent=2)
            except Exception:
                pass

    matches = re.findall(r"\{[^{}]*\}", message)
    best = ""
    for m in matches:
        try:
            json.loads(m)
            if len(m) > len(best):
                best = m
        except Exception:
            pass
    if best:
        return json.dumps(json.loads(best), ensure_ascii=False, indent=2)

    return json.dumps({"raw": message[:4000]}, ensure_ascii=False, indent=2)


# ── Llamada a agente ─────────────────────────────────────────────────────────
async def _call_agent(
    agent: Agent,
    message: str,
    timeout: float = TIMEOUT,
    max_tokens: int = MAX_TOKENS,
) -> str:
    """
    Corre agent.run() en thread pool con asyncio.to_thread.
    El timeout se maneja por el caller (cliente HTTP o caller).
    """
    def _run() -> Any:
        return agent.run(message)

    # asyncio.to_thread → thread pool, returns awaitable
    # No usamos wait_for aquí para evitar interference con thread cancellation
    response = await asyncio.to_thread(_run)

    text: str = response.content if hasattr(response, "content") else str(response)

    # Strip think blocks
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    text = re.sub(r"```think\n.*?\n```", "", text, flags=re.DOTALL).strip()
    text = re.sub(r"```markdown\n", "", text, flags=re.DOTALL).strip()
    text = re.sub(r"```markdown$", "", text, flags=re.DOTALL).strip()
    text = re.sub(r"```\n?$", "", text, flags=re.DOTALL).strip()

    return text


def clean_think_blocks(text: str) -> str:
    """Elimina bloques <think> y ```think/...``` del texto."""
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    text = re.sub(r"```think\n.*?\n```", "", text, flags=re.DOTALL).strip()
    text = re.sub(r"```markdown\n", "", text, flags=re.DOTALL).strip()
    text = re.sub(r"```markdown$", "", text, flags=re.DOTALL).strip()
    text = re.sub(r"```\n?$", "", text, flags=re.DOTALL).strip()
    return text
