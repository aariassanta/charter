# charter-web — Frontend Next.js (en desarrollo)

## Estado

Este directorio está reservado para el **charter-app**: la interfaz web Next.js que permite
a los usuarios cargar ofertas de proyecto, monitorizar la generación de documentos y descargar
los resultados.

```
charter-web/      ← futuro: Next.js 15 + TypeScript + Tailwind + Shadcn
```

## Objetivo

- Upload de texto de oferta (textarea o PDF)
- Envío al worker via HTTP (`POST /documents`)
- Polling de estado via SQLite (misma DB que el worker escribe)
- Visualización de documentos generados (Markdown renderizado)
- Exportar Gantt como imagen

## Dependencias con charter-worker

El web app consume la API REST del worker:

| Endpoint | Uso |
|---|---|
| `POST /documents` | Generar los 3 documentos |
| `GET /results/{job_id}` | Obtener resultado completo |
| `GET /health` | Estado del worker |
| `GET /dossier/{id}/markdown` | Descargar dossier |
| `GET /dossier/{id}/charter` | Descargar charter |
| `GET /dossier/{id}/kickoff` | Descargar kickoff |

## Base de datos compartida

El worker escribe directamente en `charter.db` (SQLite) para que el frontend pueda hacer
polling sin necesidad de una capa HTTP adicional entre ellos:

```
CHARTER_APP_DB=/tmp/ingenieria-pmo/charter.db
```

El schema de `extractions` incluye:
- `id`, `stage`, `status`, `job_id`
- `offer_summary`, `start_date`, `end_date`, `total_budget`
- `milestones`, `tasks`, `deliverables`, `risks`
- `confidence_overall`, `confidence_section`, `field_confidence`
- `improvement_tips`, `improvement_reasoning`, `improvement_generated_at`
