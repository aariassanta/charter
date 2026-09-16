"""
KickoffAgent — genera la Agenda de Reunión de Kick-off standalone.
Compatible con agno 1.4.5.
"""
from __future__ import annotations

import json
from typing import Any

from agno.agent.agent import Agent

from agents.llm_wrapper import _call_agent
from services.llm_client import build_llm_model, MAX_TOKENS, TIMEOUT

SYSTEM_PROMPT = (
    "Eres el agente redactor de la AGENDA DE REUNIÓN DE KICK-OFF DE PROYECTO.\n\n"
    "Tu respuesta ÚNICAMENTE el documento Markdown. Sin explicaciones.\n\n"
    "FORMATO: Markdown profesional, formal. Tablas completas.\n"
    "IDIOMA: ESPAÑOL. Nada de blockquotes.\n\n"

    "ESTRUCTURA:\n\n"

    "# AGENDA — REUNIÓN DE KICK-OFF\n\n"
    "## Datos de la Reunión\n"
    "Tabla: Proyecto, Fecha, Hora, Duración estimada, Lugar, Organiza, Dirige.\n\n"

    "## Orden del Día\n"
    "Tabla: #, Tema, Duración (min), Objetivo, Responsable, Material previo.\n"
    "Mínimo 12 temascubriendo: bienvenida, presentaciones, charter, alcance, "
    "cronograma, riesgos, calidd, comunicaciones, próximos pasos.\n\n"

    "## Compromisos Pre-Kick-off\n"
    "Lista de acciones que deben completarse antes de la reunión.\n\n"

    "## Logística\n"
    "4.1 Asistentes confirmados (tabla: Nombre, Cargo, Empresa, Rol en reunión).\n"
    "4.2 Recursos necesarios (sala, videollamada, proyector, documentos).\n"
    "4.3 Restauración del local si aplica.\n\n"

    "## Reglamento de la Sesión\n"
    "- Puntualidad obligatoria.\n"
    "- Silencios durante las presentaciones.\n"
    "- Tome de notas por parte del PM.\n"
    "- Todas las decisiones quedan registradas en el acta.\n\n"

    "## Acta de Constitución — Revisión y Firma\n"
    "Descripción del proceso de revisión del acta de constitución. "
    "Tabla de firmas: Parte, Nombre, Cargo, Fecha, Firma.\n\n"

    "## Compromisos Post-Kick-off\n"
    "Tabla: Acción, Responsable, Fecha límite, Prioridad, Estado.\n\n"

    "## Calendario de Seguimiento\n"
    "Tabla: Reunión, Frecuencia, Canal, Día/hora habitual.\n\n"

    "REGLAS:\n"
    "- Usa los DATOS REALES del charter JSON (fechas, nombres, presupuesto).\n"
    "- Cuando un dato no esté disponible: [PENDIENTE].\n"
    "- NO inventes nombres de personas.\n"
    "- Sé extremadamente detallado en la agenda — es el documento que guiará la reunión.\n"
    "- Cada punto de la agenda debe tener objetivo claro y responsable asignado.\n"
)


async def run_kickoff_agent(
    charter: dict[str, Any],
    offer_snippet: str,
    timeout: float = TIMEOUT,
) -> str:
    agent = Agent(
        name="KickoffAgent",
        model=build_llm_model(),
        instructions=SYSTEM_PROMPT,
        description="Genera Kick-off Meeting Agenda standalone",
    )

    charter_json = json.dumps(charter, ensure_ascii=False, indent=2)

    prompt = (
        "CHARTER DEL PROYECTO (JSON):\n\n"
        f"{charter_json}\n\n"
        "---\n\n"
        "Fragmento de la oferta original:\n\n"
        f"{offer_snippet[:2000]}\n\n"
        "---\n\n"
        "Genera la AGENDA DE KICK-OFF completa en Markdown, "
        "usando exclusivamente la información del charter JSON y la oferta."
    )

    return await _call_agent(agent, prompt, timeout=timeout, max_tokens=8000)
