"""
ExtractorAgent — extraer charter estructurado de texto de oferta comercial.
Compatible con agno 1.4.5.
"""
from __future__ import annotations

import json
import logging
import re
from typing import Any

from agno.agent.agent import Agent

from agents.llm_wrapper import _call_agent, str_to_json_tool
from services.llm_client import build_llm_model, MAX_TOKENS, TIMEOUT

logger = logging.getLogger("charter.extractor")

# ── Helpers ────────────────────────────────────────────────────────────────────
def _extract_amounts_from_text(text: str) -> set[str]:
    """Extrae todos los importes monetarios del texto fuente (€, $, etc.)."""
    patterns = [
        r'[€$£]\s*\d{1,3}(?:[.\s]?\d{3})*[,\.]\d{2}',     # €1.234,56 / € 1.234,56
        r'\d{1,3}(?:[.\s]?\d{3})*[,\.]\d{2}\s*[€$£]',      # 1.234,56 €
        r'[€$£]\s*\d{4,}(?:[.\s]?\d{3})*(?:[,\.]\d{2})?',  # €12345 (large totals, may have decimals)
        r'\d{1,3}(?:[.\s]?\d{3})*[,\.]\d{2}\s*(?:EUR|USD|GBP)',  # 74.356,00 EUR
        r'(?:EUR|USD|GBP)\s*\d{1,3}(?:[.\s]?\d{3})*[,\.]\d{2}',  # EUR 74.356,00
        r'\d{1,3}(?:[.\s]?\d{3})*\s*[€$£]',                  # 77.820 € (sin decimales)
        r'(?:EUR|USD|GBP)\s*\d{1,3}(?:[.\s]?\d{3})*',        # EUR 77820 (sin decimales)
    ]
    amounts = set()
    for pat in patterns:
        for m in re.finditer(pat, text, re.IGNORECASE):
            amounts.add(m.group().strip())
    return amounts


def _normalize_amount(amount: str) -> str:
    """Normaliza un importe para comparación: elimina espacios, normaliza punto/coma decimal."""
    a = amount.strip()
    # Quitar símbolo de moneda (antes o después)
    a = re.sub(r'^[€$£]|\s*[€$£]$', '', a, flags=re.IGNORECASE).strip()
    # Quitar código de moneda (EUR, USD, GBP) antes o después
    a = re.sub(r'^(?:EUR|USD|GBP)\s+|\s+(?:EUR|USD|GBP)$', '', a, flags=re.IGNORECASE).strip()
    # Normalizar separador de miles: . o espacio → nada
    a = re.sub(r'[\s.]+(?=\d{3})', '', a)
    # Normalizar decimal: coma → punto
    a = a.replace(',', '.')
    # Eliminar .00 al final (el LLM puede inventar decimales)
    a = re.sub(r'\.0+$', '', a)
    return a


def _amount_matches_source(extracted: str, source_amounts: set[str]) -> bool:
    """Verifica si el importe extraído aparece literalmente en el texto fuente."""
    if not extracted:
        return False
    norm_extracted = _normalize_amount(extracted)
    for src in source_amounts:
        if _normalize_amount(src) == norm_extracted:
            return True
    return False


def _sanitize_budget(charter: dict, offer_text: str) -> dict:
    """
    Post-extracción: valida total_budget contra el texto fuente.
    Si el importe no se encuentra literalmente en la oferta → null + warning.
    """
    budget = charter.get("total_budget")
    if not budget or budget == "null":
        return charter

    source_amounts = _extract_amounts_from_text(offer_text)
    if not _amount_matches_source(budget, source_amounts):
        logger.warning(
            f"[Extractor] total_budget '{budget}' NOT found in source text. "
            f"Found amounts: {sorted(source_amounts)[:10]}. Setting to null."
        )
        charter["total_budget"] = None
    else:
        logger.info(f"[Extractor] total_budget '{budget}' validated against source.")
    return charter


SYSTEM_PROMPT = (
    "Eres un agente de extracción de datos de proyecto. Tu única tarea es producir "
    "UN OBJETO JSON VÁLIDO con las siguientes claves:\n\n"
    "{\n"
    '  "project_name": "nombre del proyecto desde la oferta",\n'
    '  "offer_summary": "resumen de 2-3 frases del alcance de la oferta",\n'
    '  "start_date": "AAAA-MM-DD o estimado si no se indica",\n'
    '  "end_date": "AAAA-MM-DD o estimado si no se indica",\n'
    '  "total_budget": "presupuesto total explícito con moneda (ej. €74.356,00), o null si la oferta no declara un total",\n'
    '  "client": "nombre del cliente",\n'
    '  "manufacturer": "fabricante o proveedor mencionado",\n'
    '  "product_spec": "producto o componente bajo prueba según la oferta",\n'
    '  "technical_specs": ["spec1", "spec2", ...],\n'
    '  "objectives": ["obj1", "obj2", ...],\n'
    '  "tasks": ["tarea1", "tarea2", ...],\n'
    '  "milestones": ["m1 con fecha si existe", "m2...", ...],\n'
    '  "stakeholders": ["interesado1", "interesado2", ...],\n'
    '  "deliverables": ["entregable1", "entregable2", ...],\n'
    '  "success_criteria": ["criterio1", "criterio2", ...],\n'
    '  "constraints": ["restricción1", ...],\n'
    '  "assumptions": ["suposición1", ...],\n'
    '  "risks": ["riesgo1", ...],\n'
    '  "validation_tests": ["prueba1", ...]\n'
    "}\n\n"
    "REGLAS:\n"
    "1. Produce SOLO el JSON. Sin explicaciones, sin markdown.\n"
    "2. El JSON debe ser parseable con json.loads() en Python.\n"
    '3. total_budget: solo rellena si en el texto aparece explícitamente un '
    'presupuesto, importe o precio TOTAL (no un precio parcial de un item). '
    'Usa null si no hay un total declarado. NO inventes ni估算 un total.\n'
    "4. technical_specs: extrae parámetros numéricos reales.\n"
    "5. Si la oferta está en español, responde en español.\n"
)


def build_extractor_agent() -> Agent:
    return Agent(
        name="ExtractorAgent",
        model=build_llm_model(),
        instructions=SYSTEM_PROMPT,
        description="Extrae charter estructurado desde texto de oferta comercial",
    )


async def run_extractor(offer_text: str, timeout: float = TIMEOUT) -> dict[str, Any]:
    agent = build_extractor_agent()

    raw = await _call_agent(
        agent,
        f"Extrae los datos del siguiente documento de oferta comercial:\n\n{offer_text[:12000]}",
        timeout=timeout,
        max_tokens=MAX_TOKENS,
    )

    try:
        charter = json.loads(raw)
    except json.JSONDecodeError:
        json_str = await str_to_json_tool(raw)
        charter = json.loads(json_str)

    if not isinstance(charter, dict):
        raise ValueError(f"Expected dict, got {type(charter)}")

    # ── Sanitización post-extracción ─────────────────────────────────────────
    charter = _sanitize_budget(charter, offer_text)

    return charter
