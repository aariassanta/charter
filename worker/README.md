# charter-worker — FastAPI Worker + Agno Agents

> Worker asíncrono que transforma ofertas de proyecto industrial en documentación
> profesional de gestión: Project Charter, Dossier y Agenda de Kick-off.

## Inicio rápido

```bash
cd worker

pip install -r requirements.txt
cp .env.example .env
# → editar .env con MINIMAX_API_KEY

uvicorn main:app --host 0.0.0.0 --port 7860 --reload
```

Verificar:
```bash
curl http://localhost:7860/health
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/documents` | Genera dossier + charter + kick-off (3 en paralelo) |
| `POST` | `/dossier` | Genera solo el dossier (legacy) |
| `GET` | `/results/{job_id}` | Obtiene resultado completo |
| `GET` | `/jobs` | Lista jobs activos |
| `DELETE` | `/jobs/{job_id}` | Cancela un job |
| `GET` | `/health` | Estado del worker |

## Pipeline de agentes

```
Offer Text
    │
    ▼
ExtractorAgent          ← extrae campos estructurados (agno)
    │
    ▼
┌────┴──────┬──────────┐
▼           ▼          ▼
Dossier    Charter   Kickoff
Agent      Agent     Agent
│           │         │
└───────────┴─────────┘
              │
              ▼
         3 documentos Markdown
```

Los agentes 2, 3 y 4 corren en **paralelo** una vez disponible el charter extraído.

## Configuración (.env)

```bash
MINIMAX_API_KEY=tu-api-key
MINIMAX_BASE_URL=https://api.minimax.chat
LLM_MODEL=MiniMax/MiniMax-Text-01
LLM_TIMEOUT=120
LLM_MAX_TOKENS=8192
CHARTER_APP_DB=/tmp/ingenieria-pmo/charter.db
```

## Testing

```bash
pytest test_imports.py test_end_to_end.py -v
```

## Estructura

```
worker/
├── main.py                  ← FastAPI app
├── agents/
│   ├── llm_wrapper.py      ← wrapper agno (retry + timeout + json fix)
│   ├── extractor_agent.py  ← extracción de charter desde oferta
│   ├── dossier_agent.py    ← dossier de gestión
│   ├── charter_agent.py    ← project charter formal
│   ├── kickoff_agent.py    ← agenda kick-off
│   └── dossier_team.py     ← pipeline orchestrator
└── services/
    ├── llm_client.py        ← build_llm_model()
    └── extract_text.py      ← utilidades de texto
```
