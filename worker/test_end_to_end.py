#!/usr/bin/env python3
"""
test_end_to_end.py — Test end-to-end del charter-worker v1.2.0

Uso:
    python3 test_end_to_end.py [--offer PATH] [--worker URL] [--output-dir DIR]
                                [--timeout SECONDS] [--poll-interval SECONDS]

Por defecto:
    --offer         /tmp/offer_text.txt
    --worker        http://localhost:8001
    --output-dir    ~/Desktop
    --timeout       1200  (20 min)
    --poll-interval 30    (30s)

El script:
  1. Lee el texto de la oferta
  2. Llama a POST /documents
  3. Si el cliente HTTP muere por timeout, recupera el resultado con GET /results/{job_id}
  4. Guarda los 3 documentos en --output-dir
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

import requests


def sanitize(name: str) -> str:
    return "".join(c if c.isalnum() else "_" for c in name)[:40]


def main() -> int:
    parser = argparse.ArgumentParser(description="Test end-to-end del charter-worker")
    parser.add_argument("--offer", default="/tmp/offer_text.txt", help="Path al TXT de la oferta")
    parser.add_argument("--worker", default="http://localhost:8001", help="URL base del worker")
    parser.add_argument("--output-dir", default=str(Path.home() / "Desktop"), help="Directorio de salida")
    parser.add_argument("--timeout", type=int, default=1200, help="Timeout total (segundos)")
    parser.add_argument("--poll-interval", type=int, default=30, help="Intervalo de polling (segundos)")
    parser.add_argument("--no-recovery", action="store_true", help="No intentar recuperar el job si el HTTP call falla")
    args = parser.parse_args()

    offer_path = Path(args.offer)
    if not offer_path.exists():
        print(f"ERROR: oferta no encontrada: {offer_path}", file=sys.stderr)
        return 2

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    offer_text = offer_path.read_text(encoding="utf-8")
    print(f"[1/5] Oferta leída: {len(offer_text)} chars desde {offer_path}")

    # Health check
    try:
        h = requests.get(f"{args.worker}/health", timeout=10)
        h.raise_for_status()
        print(f"[2/5] Health OK: {h.json()}")
    except Exception as e:
        print(f"ERROR: worker no responde en {args.worker}: {e}", file=sys.stderr)
        return 3

    # POST /documents
    print(f"[3/5] POST {args.worker}/documents (timeout={args.timeout}s)...", flush=True)
    start = time.time()
    data: dict | None = None
    job_id: str | None = None
    http_status: int | None = None

    try:
        r = requests.post(
            f"{args.worker}/documents",
            json={"offer_text": offer_text},
            timeout=args.timeout,
        )
        elapsed = time.time() - start
        http_status = r.status_code
        if r.status_code == 200:
            payload = r.json()
            job_id = payload.get("extraction_id")
            data = payload
            print(f"[3/5] HTTP {http_status} | job={job_id} | {elapsed:.1f}s")
        else:
            print(f"[3/5] HTTP {http_status}: {r.text[:200]}", file=sys.stderr)
            # Intentar extraer job_id del log si está disponible
            job_id = None
    except requests.exceptions.ReadTimeout:
        elapsed = time.time() - start
        print(f"[3/5] TIMEOUT a los {elapsed:.0f}s. Intentando recuperar resultado...", flush=True)
    except Exception as e:
        elapsed = time.time() - start
        print(f"[3/5] ERROR HTTP a los {elapsed:.0f}s: {e}", file=sys.stderr)
        if args.no_recovery:
            return 4

    # Modo recovery: si el POST falló por timeout, intentar recuperar el job más reciente
    if data is None and not args.no_recovery:
        try:
            jobs = requests.get(f"{args.worker}/jobs", timeout=10).json()
            active = jobs.get("active_jobs", [])
            if active:
                job_id = active[0]
                print(f"[3/5] Job activo detectado: {job_id}")
        except Exception as e:
            print(f"[3/5] No se pudo obtener lista de jobs: {e}", file=sys.stderr)

        if job_id:
            print(f"[4/5] Polling GET /results/{job_id} cada {args.poll_interval}s (timeout={args.timeout}s)...", flush=True)
            poll_deadline = time.time() + args.timeout
            while time.time() < poll_deadline:
                time.sleep(args.poll_interval)
                try:
                    r = requests.get(f"{args.worker}/results/{job_id}", timeout=15)
                    if r.status_code == 200:
                        payload = r.json()
                        if "data" in payload:
                            data = payload["data"]
                            print(f"[4/5] Resultado recuperado desde {payload.get('source','?')}: {len(str(data))} bytes")
                            break
                        else:
                            # Status info only (job aún corriendo o error)
                            print(f"[4/5] {job_id} status: {payload.get('meta', payload)}", flush=True)
                    else:
                        print(f"[4/5] HTTP {r.status_code}", flush=True)
                except Exception as e:
                    print(f"[4/5] Poll error: {e}", flush=True)
            else:
                print(f"[4/5] Polling agotó el timeout sin recuperar el resultado", file=sys.stderr)

    if data is None:
        print("ERROR: no se obtuvo resultado del pipeline.", file=sys.stderr)
        return 5

    # Guardar los 3 documentos
    extraction = data.get("extraction", {})
    project_name = extraction.get("project_name") or "BANCO_ENSayos"
    safe = sanitize(project_name).upper()
    print(f"[5/5] Guardando documentos para '{project_name}' en {output_dir}/")

    docs = [
        ("dossier_md", f"DOSSIER_{safe}.md"),
        ("charter_md", f"CHARTER_{safe}.md"),
        ("kickoff_md", f"KICKOFF_{safe}.md"),
    ]
    written = []
    for src_key, filename in docs:
        text = data.get(src_key, "")
        if not text:
            print(f"  - {filename}: SKIP (vacío)", file=sys.stderr)
            continue
        target = output_dir / filename
        target.write_text(text, encoding="utf-8")
        written.append((filename, len(text), target.stat().st_size))
        print(f"  - {filename}: {len(text)} chars → {target} ({target.stat().st_size} bytes)")

    # Resumen final
    print()
    print("=" * 70)
    print(f"✓ job_id: {job_id}")
    if http_status:
        print(f"✓ HTTP status: {http_status}")
    stats = data.get("stats", {})
    if stats:
        print(f"✓ Pipeline: extractor={stats.get('extractor_time_s','?')}s, "
              f"total={stats.get('total_time_s','?')}s")
    print(f"✓ Documentos: {len(written)}/3 guardados en {output_dir}/")
    print("=" * 70)
    return 0


if __name__ == "__main__":
    sys.exit(main())
