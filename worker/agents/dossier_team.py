"""
DossierTeam — pipeline: ExtractorAgent → (DossierAgent + CharterAgent + KickoffAgent).
Compatible con agno 1.4.5.
"""
from __future__ import annotations

import asyncio
import logging
import time
from typing import Any

from agents.extractor_agent import run_extractor
from agents.dossier_agent import run_dossier_agent
from agents.charter_agent import run_charter_agent
from agents.kickoff_agent import run_kickoff_agent
from services.llm_client import TIMEOUT

logger = logging.getLogger("charter.team")


class DossierTeam:
    """
    Pipeline de 4 pasos:
      1. ExtractorAgent  → charter dict
      2. DossierAgent   → dossier Markdown (secciones 1, 3-14)
      3. CharterAgent    → Project Charter standalone
      4. KickoffAgent   → Kick-off Agenda standalone

    Los pasos 2, 3, 4 corren en paralelo una vez disponible el charter.
    """

    def __init__(
        self,
        timeout_extractor: float = TIMEOUT,
        timeout_dossier: float = TIMEOUT,
        timeout_charter: float = TIMEOUT,
        timeout_kickoff: float = TIMEOUT,
    ):
        self.timeout_extractor = timeout_extractor
        self.timeout_dossier = timeout_dossier
        self.timeout_charter = timeout_charter
        self.timeout_kickoff = timeout_kickoff

    async def run(self, offer_text: str) -> dict[str, Any]:
        t0 = time.perf_counter()

        # ── Step 1: Extraer charter ─────────────────────────────────────────
        logger.info("[DossierTeam] Step 1 — Extrayendo charter…")
        t1 = time.perf_counter()
        charter = await run_extractor(offer_text, timeout=self.timeout_extractor)
        extractor_s = time.perf_counter() - t1
        logger.info(
            f"[DossierTeam] Step 1 OK — {len(charter)} keys, "
            f"budget={charter.get('total_budget','?')}, t={extractor_s:.1f}s"
        )

        # ── Steps 2-4 en paralelo ───────────────────────────────────────────
        logger.info("[DossierTeam] Steps 2-4 — Generando 3 documentos en paralelo…")
        t2 = time.perf_counter()

        dossier_task = run_dossier_agent(charter, offer_text, timeout=self.timeout_dossier)
        charter_task = run_charter_agent(charter, offer_text, timeout=self.timeout_charter)
        kickoff_task = run_kickoff_agent(charter, offer_text, timeout=self.timeout_kickoff)

        dossier_md, charter_md, kickoff_md = await asyncio.gather(
            dossier_task, charter_task, kickoff_task
        )

        t3 = time.perf_counter()
        gen_s = t3 - t2
        total_s = t3 - t0

        logger.info(
            f"[DossierTeam] Steps 2-4 OK — "
            f"dossier={len(dossier_md)}chars, "
            f"charter={len(charter_md)}chars, "
            f"kickoff={len(kickoff_md)}chars, "
            f"t={gen_s:.1f}s, total={total_s:.1f}s"
        )

        return {
            "extraction": charter,
            "dossier_md": dossier_md,
            "charter_md": charter_md,
            "kickoff_md": kickoff_md,
            "stats": {
                "extractor_time_s": round(extractor_s, 1),
                "dossier_time_s": round(len(dossier_md) / 100),  # approx
                "charter_time_s": round(len(charter_md) / 100),
                "kickoff_time_s": round(len(kickoff_md) / 100),
                "generation_time_s": round(gen_s, 1),
                "total_time_s": round(total_s, 1),
            },
        }
