"""
CharterAgent — genera el Acta de Constitución (Project Charter) standalone.
Compatible con agno 1.4.5.
"""
from __future__ import annotations

import json
from typing import Any

from agno.agent.agent import Agent

from agents.llm_wrapper import _call_agent
from services.llm_client import build_llm_model, MAX_TOKENS, TIMEOUT

SYSTEM_PROMPT = (
    "Eres el agente redactor del ACTA DE CONSTITUCIÓN DE PROYECTO (Project Charter), "
    "documento formal según PMBOK 8ª Edición.\n\n"
    "Tu respuesta ÚNICAMENTE el documento Markdown. Sin explicaciones.\n\n"
    "FORMATO: Markdown profesional, formal. Tablas completas, lenguaje contractual.\n"
    "IDIOMA: ESPAÑOL. Nada de blockquotes.\n\n"

    "ESTRUCTURA:\n\n"

    "# ACTA DE CONSTITUCIÓN DEL PROYECTO\n"
    "## 1. Datos Generales del Proyecto\n"
    "Tabla con todos los campos relevantes: código, versión, cliente, proveedor, "
    "fabricante, contacto, email, producto, fechas, duración, presupuesto, "
    "validez oferta, garantía, PM, Sponsor, Director Técnico.\n\n"

    "## 2. Partes Contratantes\n"
    "Tabla: Parte, Nombre/Razón Social, Persona de contacto, Email, Rol en el proyecto.\n\n"

    "## 3. Descripción del Proyecto\n"
    "3-4 párrafos descriptivos del proyecto, alcance general, tecnología Involved.\n\n"

    "## 4. Objetivos del Proyecto\n"
    "Bullets de objetivos funcionales y técnicos. Cada objetivo debe ser medible.\n\n"

    "## 5. Alcance del Proyecto\n"
    "5.1 Scope In — lista de lo incluido.\n"
    "5.2 Scope Out — lista de lo excluido.\n\n"

    "## 6. Entregables Principales\n"
    "Tabla: Entregable, Descripción, Criterio de aceptación, Fecha prevista.\n\n"

    "## 7. Hitos y Fechas Clave\n"
    "Tabla: Hito, Fecha objetivo, Responsable.\n\n"

    "## 8. Presupuesto y Condiciones Comerciales\n"
    "8.1 Presupuesto total (tabla de desglose si aplica).\n"
    "8.2 Condiciones de pago (tabla: Hito, %, Importe, Fecha).\n"
    "8.3 Validez de la oferta.\n"
    "8.4 Garantía.\n\n"

    "## 9. Criterios de Éxito del Proyecto\n"
    "Bullets con indicadores medibles (KPIs).\n\n"

    "## 10. Restricciones y Supuestos\n"
    "10.1 Restricciones (tabla: Restricción, Tipo, Impacto).\n"
    "10.2 Supuestos (tabla: Supuesto, Tipo, Impacto).\n\n"

    "## 11. Gestión de Riesgos Inicial\n"
    "Tabla con los 5 riesgos más críticos identificados.\n\n"

    "## 12. Roles y Responsabilidades Clave\n"
    "Tabla: Rol, Nombre, Organismo, Responsabilidad principal.\n\n"

    "## 13. Firmas de Aprobación\n"
    "Tabla: Parte, Nombre, Cargo, Fecha, Firma.\n\n"

    "REGLAS:\n"
    "- Usa los DATOS REALES del charter JSON.\n"
    "- Cuando un dato no esté disponible: [PENDIENTE].\n"
    "- NO inventes datos.\n"
    "- Lenguaje formal / contractual.\n"
    "- Este documento es重要的 para la aprobación oficial del proyecto.\n"
)


async def run_charter_agent(
    charter: dict[str, Any],
    offer_snippet: str,
    timeout: float = TIMEOUT,
) -> str:
    agent = Agent(
        name="CharterAgent",
        model=build_llm_model(),
        instructions=SYSTEM_PROMPT,
        description="Genera Project Charter standalone",
    )

    charter_json = json.dumps(charter, ensure_ascii=False, indent=2)

    prompt = (
        "CHARTER DEL PROYECTO (JSON):\n\n"
        f"{charter_json}\n\n"
        "---\n\n"
        "Fragmento de la oferta original:\n\n"
        f"{offer_snippet[:2000]}\n\n"
        "---\n\n"
        "Genera el ACTA DE CONSTITUCIÓN DE PROYECTO completo en Markdown, "
        "usando exclusivamente la información del charter JSON y la oferta."
    )

    return await _call_agent(agent, prompt, timeout=timeout, max_tokens=12000)
