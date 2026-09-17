# 🏭 Charter — Suite PMO para Onboarding de Proyectos Industriales

> **Transforma una oferta de proyecto industrial en documentación profesional de gestión:**
> Dossier de Proyecto, Acta de Constitución (Project Charter) y Agenda de Kick-off,
> generando una EDT completa, cronograma Gantt y matrix RACI.
> Metodología: **Predictiva — PMBOK 8ª Edición**.

---

## ¿Qué es Charter?

**Charter** es una suite PMO de onboarding que, a partir de una oferta comercial de un proyecto industrial (banco de ensayos, instalación, retrofit, etc.), genera automáticamente:

| Documento | Descripción |
|---|---|
| 📋 **Project Charter** | Acta de constitución formal del proyecto con sponsor, objetivos, alcance, restricciones y criterios de éxito |
| 📁 **Dossier de Gestión** | Dossier completo con EDT, cronograma, presupuesto, hitos de pago, matriz de riesgos, matrix RACI y especificaciones técnicas |
| 🚀 **Agenda de Kick-off** | Orden del día estructurada para la reunión de inicio con el cliente |
| 📊 **Gantt visual** | Diagrama de Gantt interactivo exportable (HTML/SVG) |
| 🗂️ **EDT completa** | Estructura de Desglose del Trabajo en formato tabular jerárquico |

Los documentos se generan mediante **agentes LLM especializados** (agno) orquestados por un pipeline asíncrono. El presupuesto, plazos, hitos y riesgos se extraen **directamente del texto de la oferta** sin invenciones ni estimaciones ficticias.

---

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      CHARTER SUITE                           │
│                                                              │
│   ┌─────────────────┐         ┌──────────────────────────┐  │
│   │   charter-app    │         │      charter-worker      │  │
│   │  (Next.js Web)   │───HTTP──│   (FastAPI + agno)       │  │
│   │   puerto 3000    │         │   puerto 8765            │  │
│   └─────────────────┘         └──────────────────────────┘  │
│           │                              │                   │
│           ▼                              ▼                   │
│   SQLite: charter.db          Agentes LLM                      │
│   (resultados + polling)     ┌─────────────────────────┐      │
│                             │ ExtractorAgent          │      │
│                             │  → extrae charter dict   │      │
│                             └──────────┬──────────────┘      │
│                                        │                     │
│                              ┌─────────┼─────────┐           │
│                              ▼         ▼         ▼           │
│                       ┌──────────┐┌─────────┐┌───────────┐   │
│                       │ Dossier  ││ Charter ││  Kickoff  │   │
│                       │  Agent   ││  Agent  ││   Agent   │   │
│                       │ secciones││ charter ││  agenda   │   │
│                       │  1-14    ││ formal  ││ kick-off  │   │
│                       └──────────┘└─────────┘└───────────┘   │
│                              3 docs en paralelo              │
└─────────────────────────────────────────────────────────────┘
```

**Stack tecnológico:**
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS + Shadcn UI
- **Backend:** FastAPI 0.115 + Uvicorn + Pydantic 2
- **Agentes IA:** agno 1.4.5 (Agent SDK)
- **Modelos LLM:** configurable (MiniMax, OpenAI, Anthropic, etc.)
- **Base de datos:** SQLite (charter-app) + persistencia en disco (worker)
- **Visualización:** HTML/SVG editorial con diagram-design

---

## Pipeline de generación

```
Oferta comercial (texto PDF/email)
        │
        ▼
┌───────────────────┐
│ ExtractorAgent    │  ← extrae campos estructurados del texto
│  (agno agent)     │    sin inventar datos no presentes
└────────┬──────────┘
         │ charter dict
         │  • project_name
         │  • total_budget (validado vs fuente)
         │  • start_date / end_date
         │  • milestones
         │  • tasks
         │  • risks
         │  • stakeholders
         │  • deliverables
         ▼
  ┌──────┴───────┬──────────┐
  ▼              ▼          ▼
 DossierAgent  Charter    Kickoff
  Agent        Agent      Agent
  │            │          │
  ▼            ▼          ▼
Dossier MD  Charter MD  Kickoff MD
 (14 secs)  (paralelo)  (paralelo)
  │
  ▼
EDT tabular
Cronograma
Riesgos
RACI
```

---

## Primeros pasos

### 1. Configurar el worker

```bash
cd charter-worker

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu API key de MiniMax

# Ejecutar el worker
CHARTER_APP_DB=~/pmo-ingenieria/charter.db \
MINIMAX_API_KEY=tu_api_key \
MINIMAX_BASE_URL=https://api.minimax.io/v1 \
MINIMAX_MODEL=MiniMax-M2.7 \
MINIMAX_BUDGET_LIMIT=50 \
python3 -m uvicorn main:app --port 8765
```

### 2. Configurar la web

```bash
cd charter-app
npm install
npm run dev
# Requiere: CHARTER_WORKER_URL=http://localhost:8765 en .env.local
```

### 3. Generar documentos desde CLI

```bash
# Crear un archivo con el texto de la oferta
echo "Nuestra empresa ofrece el suministro..." > /tmp/oferta.txt

# Llamar al endpoint /documents (genera los 3 documentos)
curl -X POST http://localhost:8765/documents \
  -H "Content-Type: application/json" \
  -d '{"offer_text": "..."}' | jq
```

---

## API Reference

### `POST /documents`

Genera los 3 documentos (dossier + charter + kickoff) en paralelo.

**Request:**
```json
{
  "offer_text": "Texto completo de la oferta comercial...",
  "extraction_id": "uuid-opcional",
  "timeout_extractor": 360.0,
  "timeout_dossier": 360.0
}
```

**Response:**
```json
{
  "extraction_id": "abc12345",
  "charter": {
    "project_name": "Banco de Ensayos de Embragues",
    "total_budget": "€74.356,00",
    "start_date": "2026-09-01",
    "end_date": "2027-02-28",
    "milestones": [...],
    "tasks": [...],
    "risks": [...]
  },
  "dossier_md": "# DOSSIER DE GESTIÓN DE PROYECTO\n\n...",
  "charter_md": "# ACTA DE CONSTITUCIÓN\n\n...",
  "kickoff_md": "# AGENDA DE REUNIÓN DE KICK-OFF\n\n...",
  "stats": {
    "extractor_time_s": 12.3,
    "total_time_s": 45.7
  }
}
```

### `POST /dossier` *(legacy)*

Genera solo el dossier (compatibilidad hacia atrás).

### `GET /health`

Estado del worker, jobs activos y contadores.

---

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `MINIMAX_API_KEY` | API key de MiniMax | — |
| `MINIMAX_BASE_URL` | Base URL del API | `https://api.minimax.chat` |
| `LLM_MODEL` | Modelo a usar | `MiniMax/MiniMax-Text-01` |
| `LLM_TIMEOUT` | Timeout por request (s) | `120` |
| `LLM_MAX_TOKENS` | Tokens máximos de salida | `8192` |
| `CHARTER_APP_DB` | Ruta a SQLite del charter-app | `~/pmo-ingenieria/charter.db` |

---

## Estructura del repositorio

```
charter/
├── README.md                  ← este archivo
├── PMBOK.md                   ← mapeo de prácticas vs PMBOK 8ª
├── .gitignore
├── .env.example
│
├── charter-app/               ← Next.js frontend
│   ├── src/
│   │   ├── app/               ← App Router (offer/, results/)
│   │   ├── components/        ← Componentes React
│   │   ├── lib/               ← DB client, API client
│   │   └── types/             ← TypeScript types
│   └── package.json
│
├── charter-worker/            ← FastAPI + agno
│   ├── main.py                ← FastAPI app + endpoints
│   ├── requirements.txt
│   ├── .env.example
│   ├── .gitignore
│   ├── agents/
│   │   ├── llm_wrapper.py     ← Wrapper agno con retry + timeout
│   │   ├── extractor_agent.py ← Extrae charter dict de la oferta
│   │   ├── dossier_agent.py   ← Genera dossier de gestión
│   │   ├── charter_agent.py   ← Genera Project Charter formal
│   │   ├── kickoff_agent.py   ← Genera agenda de kick-off
│   │   └── dossier_team.py    ← Pipeline orchestrator
│   └── services/
│       ├── llm_client.py       ← build_llm_model()
│       └── extract_text.py     ← Utilidades de extracción
│
└── docs/
    ├── PMBOK.md               ← Alineación con PMBOK 8ª
    ├── DOSSIER_ejemplo.md     ← Ejemplo generado
    ├── EDT_ejemplo.md         ← EDT del ejemplo
    └── GANTT_ejemplo.html     ← Gantt visual del ejemplo
```

---

## Alineación con PMBOK 8ª Edición

Charter implementa prácticas de la **8ª Edición del PMBOK** (Project Management Institute, 2025):

| Práctica Charter | Dominio PMBOK 8 | Descripción |
|---|---|---|
| **ExtractorAgent** | Desarrollo del negocio | Análisis de caso de negocio y propuesta de valor |
| **DossierAgent** | Planificación | EDT, cronograma, presupuesto, riesgos, recursos |
| **CharterAgent** | Iniciación | Acta de constitución formal con sponsor y criterios de éxito |
| **KickoffAgent** | Ejecución | Reunión de inicio y compromiso del equipo |
| **Validación vs fuente** | Calidad | El presupuesto y hitos se validan contra el texto de la oferta |
| **Riesgos del proyecto** | Gestión de riesgos | Matriz de riesgos con probabilidad e impacto |
| **Stakeholders** | Partes interesadas | Identificación de sponsor, equipo, cliente y terceros |
| **Hitos de pago** | Gestión de adquisiciones | Condiciones de pago vinculadas a hitos de aceptación |

Ver [PMBOK.md](PMBOK.md) para el mapeo detallado.

---

## Développement

```bash
# Worker
cd charter-worker
pip install -r requirements.txt
pytest test_imports.py test_end_to_end.py -v

# Web
cd ../charter-app
npm install
npm run dev
```

---

## Licence

MIT — Alfredo Arias Santa, 2026.
