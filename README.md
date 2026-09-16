# Test Bench Embragues — PMO Charter

> Proyecto de ingeniería industrial: banco de pruebas para embragues mecánicos.

## 📁 Estructura del proyecto

```
.
├── README.md                              ← Este archivo
├── TEST_BENCH_EMBRAGUES_DOSSIER_v1.md    ← Dossier PMO completo
├── TEST_BENCH_EMBRAGUES_EDT.md           ← EDT / WBS del proyecto
├── TEST_BENCH_EMBRAGUES_GANTT.html       ← Diagrama de Gantt interactivo
└── charter-worker/                       ← Worker FastAPI (API + agentes AI)
    ├── main.py                           ← FastAPI app
    ├── agents/                           ← Agentes (agno)
    │   ├── charter_agent.py
    │   ├── dossier_agent.py
    │   ├── dossier_team.py
    │   ├── extractor_agent.py
    │   ├── kickoff_agent.py
    │   └── llm_wrapper.py
    ├── services/                         ← Servicios (LLM, extracción)
    ├── requirements.txt
    ├── .env.example
    └── .gitignore
```

## 🎯 Datos clave

| Campo | Valor |
|---|---|
| **Cliente** | AARIAS SANTA S.L. — División Industrial |
| **Ubicación** | Nave 7, Pol. Ind. Los Molinos, Getafe (Madrid) |
| **Presupuesto** | ~55.500 € + 10% contingencia |
| **Plazo** | 28 semanas (Sep 2026 – Feb 2027) |
| **Estado** | Pre-ejecución |

## 🚀 Ejecutar el charter-worker

```bash
cd charter-worker
cp .env.example .env        # editar .env con tu API key
pip install -r requirements.txt
uvicorn main:app --reload   # API en http://localhost:8000
```

**Endpoints:**

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/documents` | Genera dossier + charter + kickoff en paralelo |
| `POST` | `/dossier` | Genera dossier (compatibilidad) |
| `GET` | `/dossier/{id}/markdown` | Descarga dossier `.md` |
| `GET` | `/dossier/{id}/charter` | Descarga charter `.md` |
| `GET` | `/dossier/{id}/kickoff` | Descarga kickoff `.md` |
| `GET` | `/results/{job_id}` | Recupera JSON completo |
| `GET` | `/docs` | Documentación Swagger UI |

## 📊 EDT — Estructura de Descomposición del Trabajo

1. Gestión del proyecto
2. Diseño de ingeniería
3. Sistema hidráulico
4. Sistema de adquisición de datos
5. Montaje e integración
6. Pruebas y validación
7. Entrega y documentación

## 📈 Gantt

Abre `TEST_BENCH_EMBRAGUES_GANTT.html` directamente en el navegador para ver la planificación interactiva Sem. 1–28.

---

Generado con [MiniMax Code](https://maxcode.minimax.io) · Agente PMO Charter
