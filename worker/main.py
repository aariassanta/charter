"""
charter-worker — FastAPI worker (v1.2.0)
Endpoints:
  POST /dossier                 → genera dossier desde offer_text (backward compat)
  POST /documents               → genera dossier + charter + kickoff en paralelo
  GET  /dossier/{id}/markdown  → descarga dossier .md
  GET  /dossier/{id}/charter   → descarga charter .md
  GET  /dossier/{id}/kickoff   → descarga kickoff .md
  GET  /results/{job_id}       → recupera el JSON completo (memoria → disco)
  GET  /jobs                    → lista jobs activos + contadores
  DELETE /jobs/{job_id}         → cancela un job en ejecución
  GET  /health                  → liveness + estado del worker
Compatible con agno 1.4.5.
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import time
import uuid
from pathlib import Path

# ── dotenv auto-load ───────────────────────────────────────────────────────────
_ENV = Path(__file__).resolve().parent / ".env"
if _ENV.exists():
    from dotenv import load_dotenv
    load_dotenv(_ENV, override=True)

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("charter.main")

# ── FastAPI ───────────────────────────────────────────────────────────────────
from fastapi import FastAPI, HTTPException, UploadFile, File as FastAPIFile, Request
from pydantic import BaseModel, Field

# ── Modelo de request ──────────────────────────────────────────────────────────
class DossierRequest(BaseModel):
    offer_text: str = Field(..., min_length=100)
    extraction_id: str | None = Field(None)
    timeout_extractor: float = Field(360.0, ge=60.0, le=900.0)
    timeout_dossier: float = Field(360.0, ge=60.0, le=900.0)


# ── Inicialización ─────────────────────────────────────────────────────────────
app = FastAPI(title="charter-worker", version="1.2.0")

# Estado en memoria
_results: dict[str, dict] = {}                # job_id → JSON completo
_running_jobs: dict[str, asyncio.subprocess.Process] = {}  # job_id → proc activo
_job_meta: dict[str, dict] = {}               # job_id → {started_at, status, ...}

# Persistencia en disco (sobrevive a restart del worker)
_RESULTS_DIR = Path("/tmp/charter_results")
_RESULTS_DIR.mkdir(parents=True, exist_ok=True)

# ── Directorio del proyecto (para subprocess) ─────────────────────────────────
_PROJECT_DIR = Path(__file__).resolve().parent


# ── Persistencia en BD del charter-app ──────────────────────────────────────
# El worker escribe los resultados directamente en la BD SQLite del charter-app.
# Así el polling del frontend ve los resultados sin necesidad de HTTP adicional.
_CHARTER_APP_DB = Path(os.environ.get(
    "CHARTER_APP_DB",
    "/tmp/ingenieria-pmo/charter.db",   # ← mismo path que charter-app/lib/db.ts
))

def _write_stage(extraction_id: str, stage: str) -> None:
    """Actualiza solo el campo stage en la BD del charter-app (progress reporting)."""
    import sqlite3
    if not extraction_id:
        return
    try:
        conn = sqlite3.connect(str(_CHARTER_APP_DB), timeout=10)
        conn.execute("PRAGMA busy_timeout = 10000")
        conn.execute(
            "UPDATE extractions SET stage = ?, status = ?, updated_at = datetime('now') "
            "WHERE CAST(id AS TEXT) = ?",
            (stage, "processing", extraction_id),
        )
        conn.commit()
        conn.close()
    except Exception as e:
        logger.warning(f"[{extraction_id}] Failed to write stage: {e}")


def _write_job_id(extraction_id: str, job_id: str) -> None:
    """Escribe el job_id en la BD del charter-app para poder acceder a los documentos."""
    import sqlite3
    if not extraction_id or not job_id:
        return
    try:
        conn = sqlite3.connect(str(_CHARTER_APP_DB), timeout=10)
        conn.execute("PRAGMA busy_timeout = 10000")
        conn.execute(
            "UPDATE extractions SET job_id = ? WHERE CAST(id AS TEXT) = ?",
            (job_id, extraction_id),
        )
        conn.commit()
        conn.close()
        logger.info(f"[{extraction_id}] job_id={job_id} written to charter-app DB")
    except Exception as e:
        logger.warning(f"[{extraction_id}] Failed to write job_id: {e}")


def _write_extraction_result(extraction_id: str, extraction: dict, stage: str) -> None:
    """Escribe el resultado de la extracción en la BD del charter-app."""
    import sqlite3, json as _json

    if not _CHARTER_APP_DB.exists():
        logger.warning(f"[{extraction_id}] Charter-app DB not found at {_CHARTER_APP_DB}")
        return

    # Columnas que existen en la BD del charter-app (lib/db.ts)
    STR_COLS = (
        "offer_summary", "start_date", "end_date", "milestones", "tasks",
        "deliverables", "stakeholders", "total_budget", "risks", "assumptions",
        "constraints", "technical_specs", "wbs_output", "field_confidence",
        "pdf_metadata", "stage", "confidence_section",
        "improvement_tips", "improvement_reasoning", "improvement_generated_at",
        "error",
    )
    NUM_COLS = ("confidence_overall",)
    ALL_COLS = (*STR_COLS, *NUM_COLS)

    updates: list[str] = []
    args: list = []

    for col in STR_COLS:
        if col in extraction and col in ALL_COLS:
            updates.append(f"{col} = ?")
            val = extraction[col]
            args.append(_json.dumps(val) if isinstance(val, (dict, list)) else (val or None))
    for col in NUM_COLS:
        if col in extraction and col in ALL_COLS:
            updates.append(f"{col} = ?")
            args.append(extraction.get(col) or None)

    updates.append("status = ?")
    args.append("completed" if stage == "completed" else "failed")
    updates.append("updated_at = datetime('now')")
    args.append(extraction_id)

    if not updates:
        return

    try:
        conn = sqlite3.connect(str(_CHARTER_APP_DB), timeout=10)
        conn.execute("PRAGMA busy_timeout = 10000")
        conn.row_factory = sqlite3.Row
        cur = conn.execute(
            f"UPDATE extractions SET {', '.join(updates)} "
            f"WHERE CAST(id AS TEXT) = ?",
            args,
        )
        conn.commit()
        conn.close()
        logger.info(f"[{extraction_id}] Written to charter-app DB ({cur.rowcount} row(s) updated)")
    except Exception as e:
        logger.warning(f"[{extraction_id}] Failed to write to charter-app DB: {e}")


# ── Helpers de persistencia ────────────────────────────────────────────────────
def _persist_result(job_id: str, result: dict) -> None:
    """Guarda el resultado en disco para sobrevivir al restart del worker."""
    try:
        persistent = _RESULTS_DIR / f"{job_id}.json"
        persistent.write_text(
            json.dumps(result, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        logger.info(f"[{job_id}] Result persisted to {persistent}")
    except Exception as e:
        logger.warning(f"[{job_id}] Failed to persist result: {e}")


def _load_persistent_result(job_id: str) -> dict | None:
    """Carga un resultado desde disco si existe."""
    persistent = _RESULTS_DIR / f"{job_id}.json"
    if persistent.exists():
        try:
            return json.loads(persistent.read_text(encoding="utf-8"))
        except Exception as e:
            logger.warning(f"[{job_id}] Failed to load persistent result: {e}")
    return None


def _update_job_meta(job_id: str, **kwargs) -> None:
    """Actualiza metadatos del job (status, tiempos, contadores)."""
    if job_id not in _job_meta:
        _job_meta[job_id] = {"started_at": time.time()}
    _job_meta[job_id].update(kwargs)


# ── Pipeline runner: subprocess Python hijo ──────────────────────────────────────
async def _run_pipeline(
    offer_text: str,
    job_id: str,
    timeout_extractor: float,
    timeout_dossier: float,
    include_all: bool = False,
    extraction_id: str | None = None,
) -> dict:
    """
    Ejecuta DossierTeam.run() en un proceso Python hijo.
    extraction_id activa el reporting de progreso a la BD del charter-app.
    include_all=True → genera dossier + charter + kickoff en paralelo.
    include_all=False → genera solo dossier (backward compatible).
    """
    import tempfile, subprocess, sys

    offer_path = Path(tempfile.gettempdir()) / f"offer_{job_id}.txt"
    result_path = Path(tempfile.gettempdir()) / f"doss_result_{job_id}.json"
    stage_path = Path(tempfile.gettempdir()) / f"charter_stage_{job_id}.txt"
    offer_path.write_text(offer_text, encoding="utf-8")
    offer_path.chmod(0o600)

    timeouts_line = (
        f"timeout_extractor={timeout_extractor}, "
        f"timeout_dossier={timeout_dossier}, "
        f"timeout_charter={timeout_dossier}, "
        f"timeout_kickoff={timeout_dossier}"
    )

    # Helper que escribe la etapa actual en el archivo de polling
    stage_helper = (
        f"def _set_stage(s): open('{stage_path}','w').write(s)\n"
        "_set_stage('processing')\n"
    )

    if include_all:
        script = (
            "import sys\n"
            f"sys.path.insert(0, '{_PROJECT_DIR}')\n"
            f"from dotenv import load_dotenv\n"
            f"load_dotenv('{_PROJECT_DIR}/.env', override=True)\n"
            "import asyncio, json\n"
            f"{stage_helper}"
            "from agents.dossier_team import DossierTeam\n"
            "async def main():\n"
            f"    _set_stage('1/2 — Extrayendo charter')\n"
            f"    offer = open('{offer_path}').read()\n"
            f"    team = DossierTeam({timeouts_line})\n"
            f"    _set_stage('2/2 — Generando dossier, charter y kickoff')\n"
            "    result = await team.run(offer)\n"
            f"    with open('{result_path}', 'w') as f:\n"
            "        json.dump(result, f, ensure_ascii=False)\n"
            "asyncio.run(main())\n"
        )
    else:
        script = (
            "import sys\n"
            f"sys.path.insert(0, '{_PROJECT_DIR}')\n"
            f"from dotenv import load_dotenv\n"
            f"load_dotenv('{_PROJECT_DIR}/.env', override=True)\n"
            "import asyncio, json\n"
            f"{stage_helper}"
            "from agents.dossier_team import DossierTeam\n"
            "async def main():\n"
            f"    _set_stage('1/2 — Extrayendo charter')\n"
            f"    offer = open('{offer_path}').read()\n"
            f"    team = DossierTeam(timeout_extractor={timeout_extractor}, timeout_dossier={timeout_dossier})\n"
            f"    _set_stage('2/2 — Generando dossier')\n"
            "    result = await team.run(offer)\n"
            f"    with open('{result_path}', 'w') as f:\n"
            "        json.dump(result, f, ensure_ascii=False)\n"
            "asyncio.run(main())\n"
        )

    script_path = Path(tempfile.gettempdir()) / f"doss_script_{job_id}.py"
    script_path.write_text(script)
    script_path.chmod(0o700)

    proc = None
    last_stage = "processing"
    try:
        proc = await asyncio.create_subprocess_exec(
            sys.executable, str(script_path),
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.PIPE,
        )
        _running_jobs[job_id] = proc
        logger.info(f"[{job_id}] Subprocess started (PID {proc.pid})")

        # Polling del archivo de etapas mientras el subprocess corre
        async def poll_stage():
            nonlocal last_stage
            while True:
                await asyncio.sleep(5)
                try:
                    if stage_path.exists():
                        stage = stage_path.read_text(encoding="utf-8").strip()
                        if stage and stage != last_stage:
                            last_stage = stage
                            if extraction_id:
                                _write_stage(extraction_id, stage)
                            logger.info(f"[{job_id}] Stage: {stage}")
                except Exception:
                    pass
                # Terminar si el subprocess ya terminó
                if proc in _running_jobs.values():
                    try:
                        if proc.returncode is not None:
                            break
                    except Exception:
                        break

        poll_task = asyncio.create_task(poll_stage())

        try:
            _, stderr = await asyncio.wait_for(
                proc.communicate(),
                timeout=timeout_extractor + timeout_dossier * 3 + 30,
            )
        except asyncio.TimeoutError:
            try:
                proc.kill()
                await proc.wait()
            except ProcessLookupError:
                pass
            raise TimeoutError(
                f"Pipeline exceeded timeout "
                f"({timeout_extractor + timeout_dossier * 3 + 30}s)"
            )
        finally:
            poll_task.cancel()

        if proc.returncode != 0:
            err_msg = stderr.decode(errors="replace")[:500]
            logger.error(f"[{job_id}] Pipeline error: {err_msg}")
            raise RuntimeError(f"Pipeline exited with code {proc.returncode}: {err_msg}")

        if not result_path.exists():
            raise RuntimeError(f"[{job_id}] Pipeline did not produce result file: {result_path}")

        result = json.loads(result_path.read_text(encoding="utf-8"))
        _persist_result(job_id, result)
        return result

    finally:
        _running_jobs.pop(job_id, None)
        try:
            offer_path.unlink(missing_ok=True)
            script_path.unlink(missing_ok=True)
            result_path.unlink(missing_ok=True)
            stage_path.unlink(missing_ok=True)
        except Exception as e:
            logger.warning(f"[{job_id}] Cleanup error: {e}")


# ── Helpers ──────────────────────────────────────────────────────────────────
def _save_result(job_id: str, result: dict) -> None:
    _results[job_id] = result


# ── Endpoints ──────────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "worker": "charter-worker",
        "version": "1.2.0",
        "active_jobs": list(_running_jobs.keys()),
        "active_count": len(_running_jobs),
        "completed_in_memory": len(_results),
        "completed_on_disk": len(list(_RESULTS_DIR.glob("*.json"))),
    }


@app.post("/dossier")
async def create_dossier(req: DossierRequest):
    """
    Endpoint original — genera solo el dossier (backward compatible).
    Para generar los 3 documentos usar POST /documents.
    """
    job_id = str(uuid.uuid4())[:8]
    _update_job_meta(job_id, status="running", endpoint="/dossier", offer_chars=len(req.offer_text))
    logger.info(
        f"[POST /dossier] job={job_id}, "
        f"offer_len={len(req.offer_text)}b"
    )

    try:
        result = await _run_pipeline(
            req.offer_text,
            job_id,
            req.timeout_extractor,
            req.timeout_dossier,
            include_all=False,
            extraction_id=req.extraction_id,
        )
    except TimeoutError as e:
        _update_job_meta(job_id, status="timeout", error=str(e))
        logger.error(f"[POST /dossier] Timeout job={job_id}: {e}")
        if req.extraction_id:
            _write_extraction_result(req.extraction_id, {"error": str(e)}, "failed")
        raise HTTPException(status_code=504, detail=str(e))
    except Exception as e:
        _update_job_meta(job_id, status="error", error=str(e))
        logger.exception(f"[POST /dossier] Error job={job_id}: {e}")
        if req.extraction_id:
            _write_extraction_result(req.extraction_id, {"error": str(e)}, "failed")
        raise HTTPException(status_code=500, detail=str(e))

    _save_result(job_id, result)
    _update_job_meta(job_id, status="done", finished_at=time.time())
    logger.info(
        f"[POST /dossier] Done job={job_id}, "
        f"extractor={result['stats']['extractor_time_s']}s, "
        f"dossier={result['stats'].get('dossier_time_s','?')}s, "
        f"total={result['stats']['total_time_s']}s, "
        f"chars={len(result.get('dossier_md',''))}"
    )

    # Escribir resultado en la BD del charter-app si extraction_id fornecido
    if req.extraction_id:
        _write_extraction_result(req.extraction_id, result["extraction"], "completed")

    return {
        "extraction_id": job_id,
        "charter": result["extraction"],
        "dossier_md": result.get("dossier_md", ""),
        "stats": result["stats"],
    }


@app.post("/documents")
async def create_all_documents(req: DossierRequest):
    """
    Genera los 3 documentos en paralelo:
      - Dossier de Gestión de Proyecto (secciones 1, 3-14)
      - Acta de Constitución / Project Charter
      - Agenda de Reunión de Kick-off
    """
    job_id = str(uuid.uuid4())[:8]
    _update_job_meta(job_id, status="running", endpoint="/documents", offer_chars=len(req.offer_text))
    if req.extraction_id:
        _write_job_id(str(req.extraction_id), job_id)
    logger.info(
        f"[POST /documents] job={job_id}, "
        f"offer_len={len(req.offer_text)}b"
    )

    try:
        result = await _run_pipeline(
            req.offer_text,
            job_id,
            req.timeout_extractor,
            req.timeout_dossier,
            include_all=True,
            extraction_id=req.extraction_id,
        )
    except TimeoutError as e:
        _update_job_meta(job_id, status="timeout", error=str(e))
        logger.error(f"[POST /documents] Timeout job={job_id}: {e}")
        if req.extraction_id:
            _write_extraction_result(req.extraction_id, {"error": str(e)}, "failed")
        raise HTTPException(status_code=504, detail=str(e))
    except Exception as e:
        _update_job_meta(job_id, status="error", error=str(e))
        logger.exception(f"[POST /documents] Error job={job_id}: {e}")
        if req.extraction_id:
            _write_extraction_result(req.extraction_id, {"error": str(e)}, "failed")
        raise HTTPException(status_code=500, detail=str(e))

    _save_result(job_id, result)
    _update_job_meta(job_id, status="done", finished_at=time.time())
    logger.info(
        f"[POST /documents] Done job={job_id}, "
        f"extractor={result['stats']['extractor_time_s']}s, "
        f"dossier={len(result.get('dossier_md',''))}chars, "
        f"charter={len(result.get('charter_md',''))}chars, "
        f"kickoff={len(result.get('kickoff_md',''))}chars, "
        f"total={result['stats']['total_time_s']}s"
    )

    # Escribir resultado en la BD del charter-app si extraction_id fornecido
    if req.extraction_id:
        _write_extraction_result(req.extraction_id, result["extraction"], "completed")

    return {
        "extraction_id": job_id,
        "extraction": result["extraction"],
        "dossier_md": result.get("dossier_md", ""),
        "charter_md": result.get("charter_md", ""),
        "kickoff_md": result.get("kickoff_md", ""),
        "stats": result["stats"],
    }


# ── Recuperación de resultados ─────────────────────────────────────────────────
@app.get("/results/{job_id}")
async def get_result(job_id: str):
    """
    Recupera el JSON completo de un job. Prioriza memoria, fallback a disco.
    Esto permite que un cliente que se cayó durante el pipeline pueda
    recuperar el resultado después con solo el job_id.
    """
    if job_id in _results:
        return {"source": "memory", "job_id": job_id, "data": _results[job_id]}
    persistent = _load_persistent_result(job_id)
    if persistent is not None:
        # Cachear en memoria para próximas llamadas
        _results[job_id] = persistent
        return {"source": "disk", "job_id": job_id, "data": persistent}
    if job_id in _job_meta and _job_meta[job_id].get("status") in ("running", "timeout", "error"):
        return {"source": "meta", "job_id": job_id, "meta": _job_meta[job_id]}
    raise HTTPException(status_code=404, detail=f"job_id '{job_id}' not found")


@app.get("/jobs")
async def list_jobs():
    """Lista jobs activos y contadores de completados."""
    return {
        "active_jobs": list(_running_jobs.keys()),
        "active_count": len(_running_jobs),
        "completed_in_memory_count": len(_results),
        "completed_on_disk_count": len(list(_RESULTS_DIR.glob("*.json"))),
        "recent_jobs": [
            {"job_id": jid, **_job_meta.get(jid, {})}
            for jid in list(_job_meta.keys())[-20:]
        ],
    }


@app.post("/extractions")
async def extract_file_text(file: UploadFile = FastAPIFile(...)):
    """
    Recibe un PDF/DOCX, extrae el texto y lo devuelve.
    Usado por charter-app para obtener el offer_text antes de lanzar
    la extracción completa con POST /documents.
    """
    import tempfile

    if not file.filename:
        raise HTTPException(status_code=400, detail="Archivo requerido")

    suffix = Path(file.filename).suffix.lower()
    if suffix not in (".pdf", ".docx", ".doc"):
        raise HTTPException(status_code=400, detail="Solo PDF o DOCX")

    tmp_path = Path(tempfile.gettempdir()) / f"extract_{uuid.uuid4().hex}{suffix}"
    try:
        content = await file.read()
        tmp_path.write_bytes(content)
        tmp_path.chmod(0o600)

        from services.extract_text import extract_text
        text = extract_text(tmp_path)
        logger.info(f"[POST /extractions] Extracted {len(text)} chars from {file.filename}")
        return {"offer_text": text}
    finally:
        tmp_path.unlink(missing_ok=True)


@app.get("/extractions/{extraction_id}/documents")
async def get_extraction_documents(extraction_id: str):
    """
    Devuelve los 3 documentos (dossier, charter, kickoff) generados por el pipeline.
    Accede al resultado desde /tmp/charter_results/{job_id}.json
    Charter-app llama a este endpoint para pintar el contenido completo en el modal.
    """
    import sqlite3

    # 1. Obtener job_id desde la BD del charter-app
    job_id: str | None = None
    if _CHARTER_APP_DB.exists():
        try:
            conn = sqlite3.connect(str(_CHARTER_APP_DB), timeout=10)
            conn.row_factory = sqlite3.Row
            row = conn.execute(
                "SELECT job_id FROM extractions WHERE CAST(id AS TEXT) = ?",
                (extraction_id,),
            ).fetchone()
            if row:
                job_id = row["job_id"]
            conn.close()
        except Exception as e:
            logger.warning(f"[{extraction_id}] Failed to read job_id from charter-app DB: {e}")

    # 2. Si no tenemos job_id, buscar por offer_text en los resultados del worker
    if not job_id:
        logger.warning(f"[{extraction_id}] No job_id found in DB, searching in /tmp/charter_results/")
        raise HTTPException(status_code=404, detail="Documents not available yet (no job_id found)")

    # 3. Leer el resultado desde /tmp/charter_results/{job_id}.json
    result_path = Path(f"/tmp/charter_results/{job_id}.json")
    if not result_path.exists():
        raise HTTPException(status_code=404, detail=f"Result file not found for job {job_id}")

    import json as _json
    result = _json.loads(result_path.read_text(encoding="utf-8"))

    return {
        "extraction_id": extraction_id,
        "job_id": job_id,
        "extraction": result.get("extraction", {}),
        "dossier_md": result.get("dossier_md", ""),
        "charter_md": result.get("charter_md", ""),
        "kickoff_md": result.get("kickoff_md", ""),
        "stats": result.get("stats", {}),
    }


@app.delete("/jobs/{job_id}")
async def cancel_job(job_id: str):
    """Cancela un job en ejecución matando su subprocess Python."""
    proc = _running_jobs.get(job_id)
    if proc is None:
        if job_id in _job_meta:
            return {"status": "already_finished", "job_id": job_id, "meta": _job_meta[job_id]}
        raise HTTPException(status_code=404, detail=f"job_id '{job_id}' not running or unknown")
    try:
        proc.kill()
        await proc.wait()
        _update_job_meta(job_id, status="cancelled", finished_at=time.time())
        logger.warning(f"[{job_id}] Job cancelled by DELETE /jobs/{job_id}")
        return {"status": "cancelled", "job_id": job_id}
    except ProcessLookupError:
        return {"status": "already_finished", "job_id": job_id}


# ── Descarga de documentos individuales (FileResponse) ──────────────────────────
def _safe_project_name(extraction_id: str) -> str:
    """Genera un nombre de proyecto seguro a partir del charter."""
    if extraction_id in _results:
        project_name = _results[extraction_id]["extraction"].get("project_name", "proyecto")
    else:
        persistent = _load_persistent_result(extraction_id)
        if persistent:
            project_name = persistent["extraction"].get("project_name", "proyecto")
        else:
            project_name = "proyecto"
    return "".join(c if c.isalnum() else "_" for c in project_name)[:40]


def _get_result_md(extraction_id: str, key: str) -> str:
    if extraction_id in _results:
        return _results[extraction_id].get(key, "")
    persistent = _load_persistent_result(extraction_id)
    if persistent is None:
        raise HTTPException(status_code=404, detail="extraction_id not found")
    return persistent.get(key, "")


@app.get("/dossier/{extraction_id}/markdown")
async def get_dossier_markdown(extraction_id: str):
    md = _get_result_md(extraction_id, "dossier_md")
    if not md:
        raise HTTPException(status_code=404, detail="dossier not available for this extraction_id")
    safe_name = _safe_project_name(extraction_id)
    path = Path(f"/tmp/{safe_name}_dossier_{extraction_id}.md")
    path.write_text(md, encoding="utf-8")
    return FileResponse(
        path,
        media_type="text/markdown; charset=utf-8",
        filename=f"DOSSIER_{safe_name}_{extraction_id}.md",
    )


@app.get("/dossier/{extraction_id}/charter")
async def get_charter_markdown(extraction_id: str):
    md = _get_result_md(extraction_id, "charter_md")
    if not md:
        raise HTTPException(
            status_code=404,
            detail="charter not available — did you call POST /documents?",
        )
    safe_name = _safe_project_name(extraction_id)
    path = Path(f"/tmp/{safe_name}_charter_{extraction_id}.md")
    path.write_text(md, encoding="utf-8")
    return FileResponse(
        path,
        media_type="text/markdown; charset=utf-8",
        filename=f"CHARTER_{safe_name}_{extraction_id}.md",
    )


@app.get("/dossier/{extraction_id}/kickoff")
async def get_kickoff_markdown(extraction_id: str):
    md = _get_result_md(extraction_id, "kickoff_md")
    if not md:
        raise HTTPException(
            status_code=404,
            detail="kickoff not available — did you call POST /documents?",
        )
    safe_name = _safe_project_name(extraction_id)
    path = Path(f"/tmp/{safe_name}_kickoff_{extraction_id}.md")
    path.write_text(md, encoding="utf-8")
    return FileResponse(
        path,
        media_type="text/markdown; charset=utf-8",
        filename=f"KICKOFF_{safe_name}_{extraction_id}.md",
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "8001"))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        workers=1,
        log_level="info",
    )
