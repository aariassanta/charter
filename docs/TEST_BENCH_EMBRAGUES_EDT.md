# PROYECTO: TEST BENCH EMBRAGUES
## Estructura de Desglose del Trabajo (EDT) — EDT y Paquetes de Trabajo
### Documento de Proyecto · PROVEEDOR TÉCNICO, S.L. / CLIENTE INDUSTRIAL, S.A.

| Campo | Valor |
|---|---|
| **Referencia** | O-2024-001-ANON v0.3 |
| **Cliente** | CLIENTE INDUSTRIAL, S.A. |
| **Proveedor** | PROVEEDOR TÉCNICO, S.L. |
| **Inicio** | 1 de septiembre de 2026 |
| **Cierre estimado** | 28 de febrero de 2027 |
| **Duración** | 6 meses (24 semanas) |
| **Presupuesto** | 74.356,00 € + IVA |

---

## 1. Alcance del Proyecto

Desarrollo de la ingeniería, fabricación y puesta en marcha de un banco de ensayos para componente mecánico de sistema rotativo industrial, con motor eléctrico de 4 cuadrantes funcionando como generador para aplicar el par necesario a la parte impulsada del componente bajo prueba, basado en un bus de corriente continua común que permite la regeneración de energía.

**Objetivos:**
- Validar el comportamiento dinámico del componente bajo distintas condiciones de carga
- Caracterizar el rendimiento en régimen permanente y transitorio
- Reducir el consumo energético mediante regeneración al bus DC común
- Cumplir los requisitos funcionales y de seguridad definidos por el cliente

**Criterio de aceptación:** El banco de ensayos cumple los objetivos cuando se hayan ejecutado con éxito las pruebas FAT (Factory Acceptance Test) y SAT (Site Acceptance Test), conforme al protocolo firmado por ambas partes.

---

## 2. Especificación Técnica del Suministro

| Componente | Descripción |
|---|---|
| Armario de potencia | Dimensiones aprox. 2000 × 1800 × 500 mm. Variadores de frecuencia con control PID |
| Armario de control | Dimensiones aprox. 800 × 1800 × 500 mm. PLC con tarjetas ProfiNET |
| Motor eléctrico | Motor de 4 cuadrantes, potencia nominal 75 kW, con encoder integrado |
| Sensores del cliente | 4 sensores de temperatura, 2 de velocidad, 2 de aceleración, 1 de par |
| Bus DC común | Sistema de bus DC compartido entre los variadores para regeneración de energía |
| Puesta en marcha | Commissioning, calibración, pruebas SAT y formación al equipo del cliente |

> **Nota:** La figura de disposición general (layout de planta) queda fuera del alcance de esta oferta, siendo responsabilidad del cliente.

---

## 3. Condiciones Económicas y Hitos de Pago

| Hito | % | Importe (€) | Fecha objetivo |
|---|---|---|---|
| Aceptación de la oferta | 30% | 22.306,80 | 1 sep 2026 |
| Aceptación de la ingeniería | 20% | 14.871,20 | ~15 oct 2026 |
| Entrega del material en planta del cliente | 10% | 7.435,60 | ~30 nov 2026 |
| Aceptación en fábrica — FAT | 30% | 22.306,80 | ~15 ene 2027 |
| Aceptación final — SAT | 10% | 7.435,60 | ~28 feb 2027 |
| **TOTAL** | **100%** | **74.356,00** | |

---

## 4. Enfoque de Gestión — Focus Areas (PMBOK 8ª Edición)

> **Fuente primaria:** *PMBOK® Guide — Eighth Edition* (PMI, 2025), Secciones 4.5, 4.4, 4.3, 4.2, 3.1–3.8 y Anexo X5.
> El documento completo del PMBOK 8ª Ed. está disponible en `/Users/Alfredo/Downloads/PMBOK® Guide 8th Edition.pdf`.

### 4.1 Marco de referencia: ¿Qué son las Focus Areas?

Según el **PMBOK Guide — 8ª Edición (PMI, 2025, p. 69–73)**, las **Project Management Focus Areas** son las cinco áreas fundamentales de gestión que estructuran cualquier proyecto, independientemente del enfoque de desarrollo utilizado (predictivo, adaptativo o híbrido):

> *"These project management actions are grouped into five Project Management Focus Areas: Initiating, Planning, Executing, Monitoring and Controlling, and Closing."*

A diferencia de las fases del proyecto (*project phases*), las Focus Areas **no son secuenciales estrictas** y **no son fases del proyecto**. La cita textual del estándar lo aclara:

> *"The Project Management Focus Areas should not be confused with project phases, although some naming conventions may be the same or a project phase may largely consist of activities that are part of a Focus Area."* (PMBOK 8ª Ed., p. 69)

Esto significa que:
- **Las 5 EDT del proyecto** (Requerimientos, Fabricación, Instalación, Puesta en marcha, Cierre) son **fases técnicas** del ciclo de vida.
- **Las 5 Focus Areas** son **lentes de gestión** que se aplican **transversalmente** a todas las fases y se solapan dinámicamente.

Enfoque de desarrollo: según PMBOK 8ª Ed. (p. 59–68), este proyecto emplea un enfoque **predominantemente predictivo con componentes híbridos** — comparable al patrón *Level 2 Hybrid* del PMI Disciplined Agile (DA®):

> *"A largely predictive approach with an adaptive component. A small adaptive element within a primarily predictive project is used."* (PMBOK 8ª Ed., p. 70, Fig. 4-10)

### 4.1.1 Delivery Cadence — Frecuencia de Entrega del Proyecto

El PMBOK 8ª Ed. (p. 69) define la *delivery cadence* como la forma en que el proyecto genera valor a lo largo de su ciclo de vida. Este proyecto corresponde a un modelo de **múltiples entregas secuenciales** (*multiple deliveries*):

> *"Some projects have multiple deliveries. A project may have multiple components or elaborations delivered at different times throughout the project."* (PMBOK 8ª Ed., p. 69)

En nuestro caso:

| Entrega | EDT asociada | Momento (semana) | Entregable concreto |
|---|---|---|---|
| #1 | EDT-1 (ingeniería) | Sem 1–6 | Planos de ingeniería, Hojas de datos, Protocols FAT/SAT |
| #2 | EDT-2 (fabricación) | Sem 5–13 | Armarios de potencia y control, Motor 75 kW instalado |
| #3 | EDT-3 (instalación) | Sem 13–18 | Sensores instalados, Bus DC operativo |
| #4 | EDT-4 (commissioning) | Sem 18–21 | Banco operativos, Pruebas FAT completadas |
| #5 | EDT-5 (cierre) | Sem 21–24 | SAT, Documentación as-built, Formación |

### 4.1.2 Tailoring — Adaptación al Contexto del Proyecto

El PMBOK 8ª Ed. (p. 103–112) introduce el concepto de **tailoring**: la adaptación deliberada del enfoque de gestión, gobernanza y procesos al contexto específico del proyecto. Para TEST BENCH EMBRAGUES, las decisiones de tailoring son:

| Factor de contexto | Decisión de tailoring | Justificación |
|---|---|---|
| **Industria/entorno** | Predictivo con gestión formal de cambios | Sector industrial; contrato con hitos fijos; normativa IEC 60204-1, IEC 61800-2 |
| **Cultura organizacional** | Roles claros con RACI formal; reuniones quincenales estructuradas | Empresa mediana con jerarquía definida |
| **Complejidad del proyecto** | EDT de 5 fases; RBS con 19 riesgos; M&C transversal | Proyecto técnico de alcance medio-alto |
| **Incertidumbre técnica** | Componentes híbridos parciales (adaptativos) para ingeniería de detalle | El layout de planta y los sensores dependen del cliente |
| **Participación del cliente** | Stakeholder engagement formal; approval gates antes de cada EDT | CLIENTE INDUSTRIAL como approbador en cada hito de pago |
| **Seguridad/regulatorio** | Enfoque predictivo en seguridad (ISO 13849-1) | Aplicación de par con motor de 75 kW → PLr según ISO 13849-1 |

---

### 4.2 Las cinco Focus Areas — Definiciones textuales del PMBOK 8ª Ed. y aplicación al proyecto

Las definiciones siguientes son citas directas del estándar (PMBOK 8ª Ed., pp. 70–73), traducidas y contextualizadas para este proyecto:

#### FA-1 — Initiating *(Iniciación)*

> *"The Initiating Focus Area consists of those processes, practices, or actions performed to define a new project or new phase of an existing project. This area often includes formal authorization to start the project or phase. The purpose of the Initiating Focus Area is to align the stakeholders' expectations and the project's purpose, inform stakeholders of the scope and objectives, align key stakeholders, and discuss how their participation in the project and its associated phases can help to ensure their expectations are met."* — PMBOK 8ª Ed., p. 70

**En TEST BENCH EMBRAGUES:** Charter del proyecto, Reunión de Kick-off, Acta de inicio, Identificación de stakeholders, Asignación de roles (RACI). EDT-0 implícita (Sem 1).

#### FA-2 — Planning *(Planificación)*

> *"The Planning Focus Area consists of those processes, practices, or actions that establish the intended scope of the effort, define and refine the objectives, and develop the course of action required to attain those objectives. [...] The key benefit of this Focus Area is to define the course of action for successfully completing the project or phase."* — PMBOK 8ª Ed., pp. 70–71

**En TEST BENCH EMBRAGUES:** EDT, cronograma (Gantt), matriz RACI, RBS, Plan de Gestión de Cambios, Plan de Gestión de Riesgos. EDT-1 (Sem 1–6), con elaboración progresiva durante toda la ingeniería.

#### FA-3 — Executing *(Ejecución)*

> *"The Executing Focus Area consists of those processes, practices, or actions performed to complete the work in a manner consistent with the currently agreed-upon course of action. [...] The key benefit of this Focus Area is to drive focused execution to achieve the value proposition represented by the integrated baseline."* — PMBOK 8ª Ed., p. 72

**En TEST BENCH EMBRAGUES:** EDT-2 (fabricación de armarios y taller), EDT-3 (instalación mecánica y eléctrica), EDT-4 (commissioning, FAT). Sem 5–21.

#### FA-4 — Monitoring & Controlling *(Seguimiento y Control)*

> *"The Monitoring and Controlling Focus Area consists of those actions required to track, measure, review, and regulate the progress and performance of the project; identify any areas in which changes to the plan are required; and initiate the corresponding changes. [...] The Monitoring and Controlling Focus Area is performed in parallel with the other Focus Areas. It is not a separate, stand-alone area."* — PMBOK 8ª Ed., pp. 72–73

**En TEST BENCH EMBRAGUES:** Reuniones quincenales de seguimiento, control de riesgos (RBS), gestión de cambios (Solicitudes de Cambio / Órdenes de Cambio), informe quincenal de avance, control de hitos de pago. **Transversal a todo el proyecto (Sem 1–24)** — NO es una fase posterior a la ejecución.

#### FA-5 — Closing *(Cierre)*

> *"The Closing Focus Area consists of the actions performed to formally complete or close a project, phase, contract, or in some cases, to terminate a project before completion. [...] The key benefit of this Focus Area is that phases, projects, and contracts are closed out appropriately, transitioning to operations in a manner that helps meet or exceed the project's target business objectives."* — PMBOK 8ª Ed., pp. 71–72

**En TEST BENCH EMBRAGUES:** EDT-5 (pruebas SAT, documentación as-built, formación, acta de cierre, transferencia a operaciones).

---

### 4.3 Mapa de interacción — Focus Areas × Fases EDT del proyecto

El PMBOK 8ª Ed. (p. 73, Fig. 4-13) ilustra cómo las Focus Areas se solapan en un enfoque predictivo. Aplicado a TEST BENCH EMBRAGUES:

```
FOCUS AREAS (PMBOK 8ª Ed.)          Semanas del proyecto (1–24)
                                   1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
                                   ├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
FA-1 Initiating                    ████
FA-2 Planning                      ████████████████████████████████████████████████████████
FA-3 Executing                     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
   EDT-2 Fabricación                ░░░░░░░░░░░░░████████████████████
   EDT-3 Instalación                                         ░░░░░░░░░░███████████████████
   EDT-4 Commissioning                                                       ░░░░░░░░░░███████████████████
FA-4 Monitoring & Controlling    ████████████████████████████████████████████████████████████████████████████████████████
FA-5 Closing                                                                   ░░░░░░░░░░░░░░░░░░░░░░░░░███████████
```

**Leyenda:**
- `████` = esfuerzo principal de la Focus Area
- `░░░░` = actividad secundaria, de transición o preparatoria

**Figura PMBOK 8ª Ed. de referencia:** La Figura 4-13 del estándar (p. 73) muestra exactamente este patrón para un enfoque predictivo: *Initiating* concentrado al inicio, *Planning* con esfuerzo decreciente tras la fase inicial, *Executing* en las fases intermedias, *Monitoring & Controlling* transversal durante todo el proyecto, y *Closing* al final.

> **Nota clave PMBOK 8ª Ed.:** *"The Monitoring and Controlling Focus Area is performed in parallel with the other Focus Areas. It is not a separate, stand-alone area."* (p. 73) — En TEST BENCH EMBRAGUES se materializa en reuniones quincenales de seguimiento desde la Sem 1.

---

### 4.4 Conexión entre Focus Areas, Performance Domains y EDT

El PMBOK 8ª Ed. (pp. 7–9 y 113–114) define los **7 Project Performance Domains** como *"a group of related processes that are critical for the effective delivery of project value"*, y la Tabla 2-1 del estándar mapea los **40 procesos** (ITTOs) a cada combinación de Focus Area × Performance Domain.

#### 4.4.1 Los 7 Performance Domains en TEST BENCH EMBRAGUES

| # | Performance Domain (PMBOK 8ª Ed.) | Procesos clave (40 del PMBOK 8ª Ed.) | Aplicación al proyecto | FA dominante |
|---|---|---|---|---|
| 1 | **Governance** | *Initiate Project/Phase, Integrate and Align Project Plans, Assess and Implement Changes, Close Project or Phase* | Autorización Charter, gobernanza del proyecto, reuniones de seguimiento, approval gates | Initiating + M&C |
| 2 | **Stakeholders** | *Identify Stakeholders, Plan Stakeholder Engagement, Manage Stakeholder Engagement, Monitor Stakeholder Engagement, Plan Communications, Manage Communications, Monitor Communications* | CLIENTE INDUSTRIAL (approbador), equipo PROVEEDOR, aprobación en hitos | Todas (transversal) |
| 3 | **Scope** | *Plan Scope Management, Elicit and Analyze Requirements, Define Scope, Develop Scope Structure, Monitor and Control Scope, Validate Scope* | EDT, paquetes de trabajo, especificaciones técnicas, alcance in/out | Planning + M&C |
| 4 | **Schedule** | *Plan Schedule Management, Develop Schedule, Monitor and Control Schedule* | Cronograma, Gantt, ruta crítica, fechas de hitos, dependencias EDT | Planning + M&C |
| 5 | **Finance** | *Plan Financial Management, Estimate Costs, Develop Budget, Monitor and Control Finances* | Hitos de pago (5 hitos), presupuesto 74.356 €, control de cambios | Planning + M&C |
| 6 | **Resources** | *Plan Resource Management, Estimate Resources, Acquire Resources, Lead the Team, Monitor and Control Resourcing* | Ing. Eléctrica, Ing. Control, Ing. Mecánica, Taller, PM, Compras | Executing |
| 7 | **Risk** | *Plan Risk Management, Identify Risks, Perform Risk Analysis, Plan Risk Responses, Implement Risk Responses, Monitor Risks* | RBS, 19 riesgos, R-3.1 y R-3.2 críticos, plan de mitigación | Planning + M&C |

> **Referencia PMBOK 8ª Ed.:** *"The project management performance domains work together as a cohesive whole. In this way, they operate as an integrated system, with each performance domain being interdependent with the others to enable successful delivery of the project and its intended outcomes."* (p. 8)

#### 4.4.2 Interdependencias entre Performance Domains relevantes para el proyecto

El PMBOK 8ª Ed. (p. 9) destaca las conexiones entre Performance Domains. Las más relevantes para TEST BENCH EMBRAGUES:

```
  Governance
  ◄───────► Stakeholders    ← Las decisiones de gobernanza dependen de la aprobación del cliente
  ◄───────► Scope          ← El Charter autoriza el alcance técnico
  ◄───────► Risk           ← Los approval gates verifican el estado de riesgos críticos

  Scope
  ◄───────► Schedule       ← La EDT determina la secuencia y duración de paquetes
  ◄───────► Finance        ← El alcance define el presupuesto de cada hito de pago
  ◄───────► Risk           ← Cambios de alcance (SC/OC) activan análisis de riesgos (R-3.1, R-3.2)

  Finance
  ◄───────► Schedule       ← Los hitos de pago (5 eventos) anclan fechas críticas del Gantt
  ◄───────► Resources      ← El presupuesto determina la disponibilidad de horas de taller

  Resources
  ◄───────► Risk           ← La disponibilidad de Ing. Eléctrica e Ing. Control es un riesgo
                              (R-1.1, R-1.2)
  ◄───────► Stakeholders   ← La comunicación con CLIENTE INDUSTRIAL depende de recursos asignados

  Risk
  ◄───────► Schedule       ← R-3.1 (layout) y R-3.2 (sensores) pueden impactar fechas de hitos
  ◄───────► Scope          ← R-3.1 y R-3.2 pueden ampliar o modificar el alcance técnico
```

#### 4.4.3 Check Results — Métricas de éxito por Performance Domain

El PMBOK 8ª Ed. (p. 9) establece que cada Performance Domain incluye *"Check Results"* — criterios para evaluar el éxito. Para TEST BENCH EMBRAGUES:

| Performance Domain | Criterio de éxito (Check Results) |
|---|---|
| **Governance** | Aprobación del Charter → Kick-off ejecutado → Approval gates de cada EDT cumplidos |
| **Stakeholders** | CLIENTE INDUSTRIAL firma cada approval gate; satisfacción del equipo ≥ 80% en surveys |
| **Scope** | EDT-1 a EDT-5 completadas; no hay desvío de alcance sin OC formal |
| **Schedule** | FAT en Sem 21 (±2 sem); SAT en Sem 23 (±1 sem); Gantt baseline mantenido |
| **Finance** | Facturación conforme a hitos de pago; margen de ±5% sobre presupuesto |
| **Resources** | Utilización Ing. ≥ 85%; 0 incidentes de seguridad en taller |
| **Risk** | R-3.1 y R-3.2 monitorizados quincenalmente; triggers de contingency activados si P×I sube |

---

### 4.5 Los 6 Principios PMBOK 8ª Edición — Aplicación a TEST BENCH EMBRAGUES

El PMBOK 8ª Ed. (Sección 3, pp. 35–55) establece que *"principles for a profession serve as foundational guidelines for strategy, decision-making, and problem-solving"* y que *"the principles of project management are not prescriptive, but rather are intended to reinforce the mindset and guide the behavior of people involved in projects."*

Los 6 principios se organizan en 3 dimensiones del *project management mindset*: **Proactive**, **Ownership** y **Value-Driven** (PMBOK 8ª Ed., p. 36, Fig. 3-1).

| # | Principio PMBOK 8ª Ed. | Dimensión | Aplicación concreta a TEST BENCH EMBRAGUES |
|---|---|---|---|
| P1 | **Adopt a Holistic View** *(Adoptar una visión holística)* | Proactive | Considerar las interdependencias: ingeniería (EDT-1) → fabricación (EDT-2) → instalación (EDT-3) → commissioning (EDT-4) → cierre (EDT-5). Cada decisión en una EDT impacta a las siguientes. |
| P2 | **Focus on Value** *(Enfocarse en el valor)* | Value-Driven | Entregar el banco que permita al cliente validar su componente mecánico. El valor no es el equipo en sí, sino la capacidad de ensayo. El SAT firma la transferencia de valor. |
| P3 | **Embed Quality Into Processes and Deliverables** *(Integrar la calidad)* | Proactive | Procedimientos de taller conforme a IEC 60204-1; PLr según ISO 13849-1; pruebas FAT y SAT como quality gates. Cero defectos en armarios antes de envío. |
| P4 | **Be an Accountable Leader** *(Liderar con responsabilidad)* | Ownership | El PM actúa como *accountable leader*: decisiones sobre riesgos, alcance y cambios se documentan y comunican. Los riesgos R-3.1 y R-3.2 se escalan al Sponsor de CLIENTE INDUSTRIAL. |
| P5 | **Integrate Sustainability Within All Project Areas** *(Integrar la sostenibilidad)* | Value-Driven | Regeneración energética del bus DC reduce consumo vs. bancos de absorción. Eficiencia operativa del cliente a largo plazo. Consideración de fin de vida útil de componentes. |
| P6 | **Build an Empowered Culture** *(Construir una cultura de empoderamiento)* | Ownership | Equipos con roles claros (RACI); Ing. Eléctrica e Ing. Control autonomía en detalle técnico; feedback del cliente integrado en approval gates. Comunicación abierta y sin silos. |

> **Referencia PMBOK 8ª Ed.:** *"By adhering to these principles and aligning them with professional, organizational, and ethical values, project managers can navigate the complexities of their projects and drive meaningful, positive, and sustainable change within their organizations."* (p. 35)

---

### 4.6 Enfoque de Desarrollo y Línea Base del Proyecto

#### 4.6.1 Clasificación del enfoque según PMBOK 8ª Ed.

El PMBOK 8ª Ed. (pp. 59–70) clasifica los enfoques en un espectro: *predictivo → híbrido → adaptativo*. Este proyecto se clasifica como **Hybrid Level 2**:

> *"A largely predictive approach with an adaptive component. A small adaptive element within a primarily predictive project is used."* — PMBOK 8ª Ed., p. 70, Fig. 4-10

| Aspecto | Enfoque según PMBOK 8ª Ed. | Justificación específica del proyecto |
|---|---|---|
| **Alcance** | Predictivo (fijo) | EDT definida; alcance en oferta O-2024-001-ANON v0.3; Scope Statement formalizado |
| **Planificación** | Predictivo (front-loaded) | EDT, cronograma, RBS, RACI, Plan de Cambios elaborados al inicio |
| **Entregas** | Incremental | EDT-2 → EDT-3 → EDT-4 → EDT-5 en secuencia con gates de aprobación |
| **Ingeniería de detalle** | Híbrido parcial | Depende del layout de planta (R-3.1) y sensores del cliente (R-3.2) — incertidumbre del cliente |
| **Cambios** | Predictivo con SC/OC formal | Hitos de pago fijos; toda variación requiere Order de Cambio aprobada |
| **Gestión de riesgos** | Predictivo con monitorización | RBS con 19 riesgos; triggers definidos; contingency plan en espera |

#### 4.6.2 Integrated Baseline del proyecto

El PMBOK 8ª Ed. (p. 60) define la *integrated baseline* como la combinación de las tres líneas base:

> *"The scope, schedule, cost, resource needs, quality requirements, and risks can be well defined in the early phases of the project life cycle and are expected to remain relatively stable. This development approach allows the project team to capture reliable certainty early in the project and to perform much of the planning up front."*

**Integrated Baseline — TEST BENCH EMBRAGUES:**

| Componente de línea base | Valor / Parámetro | Documento de referencia |
|---|---|---|
| **Scope Baseline** | EDT de 5 fases, 30 paquetes de trabajo | EDT (Sección 5), Alcance (Sección 1) |
| **Schedule Baseline** | 24 semanas (1 sep 2026 – 28 feb 2027), milestones Sem 6, 13, 18, 21, 24 | Gantt (Sección 8) |
| **Cost Baseline** | 74.356,00 € + IVA | Sección 3, Condiciones Económicas |
| **Quality Baseline** | FAT + SAT conforme a protocolos firmados; PLr ISO 13849-1 | Anexo C — Normativa |
| **Risk Baseline** | 19 riesgos en RBS; R-3.1 y R-3.2 con score crítico | RBS (Sección 9) |

> **Nota PMBOK 8ª Ed.:** Todo cambio a la integrated baseline requiere el proceso *Assess and Implement Changes* (PMBOK 8ª Ed., Tabla 2-1) → en este proyecto: Solicitud de Cambio (SC) → Order de Cambio (OC) formal (Sección 14).

#### 4.6.3 Governance del Proyecto — Roles y Matriz RACI de Gobernanza

El PMBOK 8ª Ed. (p. 7–9 y Sección 2.1) define la *project governance* como *"the adaptable framework that guides project management activities to create value through a unique product, service, or result aligned with organizational, strategic, and operational goals."* La gobernanza del proyecto se articula a través de los siguientes roles y decisiones:

| Rol de gobernanza | Responsabilidad (PMBOK 8ª Ed.) | En TEST BENCH EMBRAGUES | Frecuencia |
|---|---|---|---|
| **Sponsor / Director Comercial** | Autoriza recursos, presupuestos, y cambios mayores | Aprobación de SC con impacto > 5% del presupuesto | Bajo demanda |
| **Project Manager (PM)** | Líder accountable; coordina ejecución; informa al Sponsor | Gestión diaria, reuniones quincenales, gestión SC/OC | Continua |
| **CLIENTE INDUSTRIAL (Approbador)** | Aprueba deliverables en cada approval gate | Firma de approval gates EDT-1 a EDT-5 | 5 gates |
| **Comité de Seguimiento** | Revisa desempeño, approve cambios, resuelve conflictos | Reunión quincenal PM–Cliente | 12 reuniones |
| **PMO / Dirección** | Supervisión estratégica | **No aplica** — PROVEEDOR TÉCNICO no dispone de PMO; la gobernanza recae directamente en Dirección Comercial | Según necesidad |

Las decisiones de gobernanza siguen el proceso *Initiate Project or Phase → Integrate and Align Project Plans → Manage Project Execution → Monitor and Control Project Performance → Assess and Implement Changes → Close Project or Phase* (PMBOK 8ª Ed., Tabla 2-1).

---

### 4.7 Resumen — Sección 4 PMBOK 8ª Ed. aplicada al proyecto

| Elemento PMBOK 8ª Ed. | Referencia | Estado en TEST BENCH EMBRAGUES |
|---|---|---|
| **5 Focus Areas** | PMBOK 8ª Ed., Sección 4.5, pp. 70–73 | Implementadas — ver 4.2 |
| **7 Performance Domains** | PMBOK 8ª Ed., Sección 2, pp. 7–9 y 113–114 | Mapeados — ver 4.4 |
| **40 Procesos (ITTOs)** | PMBOK 8ª Ed., Tabla 2-1, pp. 113–114 | Aplicados parcialmente (tailoring) — ver 4.4.1 |
| **6 Principios** | PMBOK 8ª Ed., Sección 3, pp. 35–55 | P1–P6 implementados — ver 4.5 |
| **Desarrollo Approach** | PMBOK 8ª Ed., Sección 4.2, pp. 59–68 | Hybrid Level 2 — ver 4.6.1 |
| **Integrated Baseline** | PMBOK 8ª Ed., p. 60 | Scope + Schedule + Cost + Quality + Risk — ver 4.6.2 |
| **Delivery Cadence** | PMBOK 8ª Ed., Sección 4.4, p. 69 | Múltiples entregas secuenciales — ver 4.1.1 |
| **Tailoring** | PMBOK 8ª Ed., Sección 3, pp. 103–112 | 6 decisiones de tailoring — ver 4.1.2 |
| **Project Governance** | PMBOK 8ª Ed., pp. 7–9 y 2.1 | Roles, approval gates, SC/OC — ver 4.6.3 |

> **Fuente:** *PMBOK® Guide — Eighth Edition* (PMI, 2025), ANSI/PMI 99-001-2025. ISBN: 978-1-62825-829-5. Disponible en: `/Users/Alfredo/Downloads/PMBOK® Guide 8th Edition.pdf`.

---

## 5. EDT — Estructura de Desglose del Trabajo

### Convenciones
- **Código de nivel 1:** EDT-X (fase)
- **Código de nivel 2:** EDT-X.X (paquete de trabajo)
- **Código de nivel 3:** EDT-X.X.X (tarea)

---

### EDT-1 · Ingeniería *(1 sep — 15 oct 2026 · 6 semanas)*

| Código | Paquete / Tarea | Descripción | Entregable | Responsable |
|---|---|---|---|---|
| **1.1** | **Ingeniería básica** | | | |
| 1.1.1 | Mecánica básica | Diseño preliminar del soporte mecánico, bancada, integración del motor y acoplamiento | Plano de disposición general preliminar | Ing. Mecánica |
| 1.1.2 | Eléctrica básica | Esquema unifilar, diseño del bus DC común, configuración de variadores | Esquema unifilar aprobado | Ing. Eléctrica |
| 1.1.3 | Especificación de instrumentación | Lista de señales, cableado, sensores del cliente (SLA) | Lista de instrumentación y señales (I/O list) | Ing. Control |
| 1.1.4 | Especificación de control | Arquitectura de control, lazos PID, estrategia de regulación del bus DC | P&ID / Diagrama de control | Ing. Control |
| **1.2** | **Ingeniería de detalle** | | | |
| 1.2.1 | Planos de detalle mecánicos | Planos de taller, piezas intermedias, sujeciones | Planos de fabricación | Ing. Mecánica |
| 1.2.2 | Esquemas eléctricos de detalle | Cableado armario potencia, armario control, bornas, puesta a tierra | Esquemas eléctricos detallados | Ing. Eléctrica |
| 1.2.3 | Programa PLC | Código ladder/ST para control del variador, lazos PID, supervisión ProfiNET | Programa PLC documentado | Ing. Control |
| 1.2.4 | Diseño de armario de control | Disposición física de componentes, etiquetado, listados de cable | Plano de armario de control | Ing. Eléctrica |
| 1.2.5 | Revisión y aprobación por el cliente | Revisión formal de toda la documentación | Acta de aprobación de ingeniería | PM + Cliente |
| **1.3** | **Gestión de documentación** | | | |
| 1.3.1 | Registro y control de documentos | Numeración, versión, distribución | Registro de documentos | PM |
| 1.3.2 | Manual de operación preliminar | Procedimientos de operación y secuencias de arranque | Borrador de manual de operación | Ing. Control |

---

### EDT-2 · Aprovisionamiento y Fabricación *(16 oct — 30 nov 2026 · 6 semanas)*

| Código | Paquete / Tarea | Descripción | Entregable | Responsable |
|---|---|---|---|---|
| **2.1** | **Aprovisionamiento** | | | |
| 2.1.1 | Pedido y compra de materiales | Variadores, PLC, tarjetas ProfiNET, cableado, componentes mecánicos | Órdenes de compra emitidas | Compras |
| 2.1.2 | Seguimiento de proveedores | Seguimiento de plazos de entrega, expediciones | Estado de pedidos actualizado | PM |
| 2.1.3 | Recepción y verificación | Inspección de material recibido contra pedido y albarán | Acta de recepción y verificación | Almacén / Calidad |
| **2.2** | **Fabricación de armarios** | | | |
| 2.2.1 | Fabricación armario de potencia | Mecanizado, cableado, montaje de variadores PID, pruebas funcionales en taller | Armario de potencia fabricado | Taller + Ing. Eléctrica |
| 2.2.2 | Fabricación armario de control | Montaje de PLC, ProfiNET, borneras, etiquetado, pruebas funcionales | Armario de control fabricado | Taller + Ing. Eléctrica |
| **2.3** | **Fabricación mecánica** | | | |
| 2.3.1 | Mecanizado de piezas | Bancada, soporte motor, acoplamientos | Piezas mecánicas terminadas | Taller + Ing. Mecánica |
| 2.3.2 | Preparación del motor | Verificación, montaje de encoder, acoplamiento al sistema | Motor preparado para envío | Ing. Mecánica |
| **2.4** | **Integración y pruebas en taller** | | | |
| 2.4.1 | Integración del sistema en taller | Ensamblaje completo, conexión entre armarios, conexión bus DC | Sistema integrado en taller | Ing. Eléctrica + Ing. Control |
| 2.4.2 | Pruebas parciales en taller | Verificación funcional básica antes de envío | Informe de pruebas en taller | Ing. Control |
| **2.5** | **Embalaje y logística** | | | |
| 2.5.1 | Embalaje | Embalaje de protección para transporte | Equipos embalados y listos para envío | Logística |
| 2.5.2 | Envío a planta del cliente | Gestión del transporte, entrega en planta | Albarán de entrega | Logística |

---

### EDT-3 · Instalación en Planta del Cliente *(1 dic 2026 — 15 ene 2027 · 7 semanas)*

| Código | Paquete / Tarea | Descripción | Entregable | Responsable |
|---|---|---|---|---|
| **3.1** | **Gestión de acceso e infraestructura** | | | |
| 3.1.1 | Coordinación con el cliente | Planificación de accesos, grúas, espacios, permisos de obra | Plan de instalación acordado | PM |
| 3.1.2 | Verificación de infraestructura cliente | Comprobación de alimentación, puesta a tierra, disposición del layout (responsabilidad del cliente) | Acta de verificación de infraestructura | Ing. Eléctrica |
| **3.2** | **Instalación mecánica** | | | |
| 3.2.1 | Recepción y posicionamiento | Recepción de equipos en planta, posicionamiento de bancada y motor | Equipos posicionados | Ing. Mecánica + Cliente |
| 3.2.2 | Montaje mecánico | Ensamblaje final, acoplamiento, alineación | Montaje mecánico completado | Ing. Mecánica |
| **3.3** | **Instalación eléctrica e instrumentación** | | | |
| 3.3.1 | Instalación de armarios | Fijación y conexión de armario de potencia y control | Armarios instalados | Ing. Eléctrica |
| 3.3.2 | Cableado de campo | Cableado entre armarios, motor, sensores del cliente | Cableado de campo completado | Ing. Eléctrica |
| 3.3.3 | Conexión de sensores del cliente | Integración de sensores (temp., velocidad, aceleración, par) | Sensores integrados | Cliente + Ing. Control |
| **3.4** | **Verificación pre-puesta en marcha** | | | |
| 3.4.1 | Inspección visual y continuidad | Comprobación de cableado, conexiones, puesta a tierra | Acta de inspección pre-arranque | Ing. Eléctrica |
| 3.4.2 | Verificación de señales y comunicaciones | Test de comunicaciones ProfiNET, lectura de sensores | Informe de verificación de señales | Ing. Control |

---

### EDT-4 · Puesta en Marcha, FAT y SAT *(16 ene — 28 feb 2027 · 7 semanas)*

| Código | Paquete / Tarea | Descripción | Entregable | Responsable |
|---|---|---|---|---|
| **4.1** | **Puesta en marcha (Commissioning)** | | | |
| 4.1.1 | Configuración de variadores | Parametrización PID, límites de par, configuración de 4 cuadrantes | Hojas de parametrización | Ing. Control |
| 4.1.2 | Configuración y verificación del bus DC | Parametrización de regeneración, equilibrado de carga | Informe de configuración del bus DC | Ing. Control |
| 4.1.3 | Programación y ajuste del PLC | Verificación de lógica, lazos PID, alarmas, HMI básico | Programa PLC verificado | Ing. Control |
| 4.1.4 | Calibración de sensores | Verificación de sensores del cliente, ajuste de rangos y escalado | Acta de calibración | Ing. Control |
| 4.1.5 | Pruebas de integración | Secuencias de arranque/parada, comportamiento en carga, respuesta dinámica | Protocolo de pruebas de integración | Ing. Control |
| **4.2** | **Pruebas FAT (Factory Acceptance Test)** | | | |
| 4.2.1 | Planificación FAT | Protocolo de pruebas FAT acordado con el cliente | Protocolo FAT firmado | PM + Cliente |
| 4.2.2 | Ejecución FAT | Pruebas según protocolo: carga estática, dinámica, transitorios, regeneración | Informe de resultados FAT | Ing. Control + Cliente |
| 4.2.3 | Corrección de incidencias FAT | Resolución de no conformidades detectadas | Lista de acciones correctivas cerradas | Ing. Control |
| **4.3** | **Pruebas SAT (Site Acceptance Test)** | | | |
| 4.3.1 | Planificación SAT | Protocolo SAT acordado con el cliente | Protocolo SAT firmado | PM + Cliente |
| 4.3.2 | Ejecución SAT en planta | Pruebas en entorno real del cliente, con sus sensores y condiciones | Informe de resultados SAT | Ing. Control + Cliente |
| 4.3.3 | Firma de aceptación SAT | Cierre formal con acta de aceptación | Acta de aceptación SAT firmada | Cliente + Proveedor |

---

### EDT-5 · Cierre, Formación y Documentación As-Built *(1 feb — 28 feb 2027 · parcialmente en paralelo con EDT-4)*

| Código | Paquete / Tarea | Descripción | Entregable | Responsable |
|---|---|---|---|---|
| **5.1** | **Documentación as-built** | | | |
| 5.1.1 | Recopilación de documentación final | Planos definitivos, esquemas actualizados, programas finales | Expediente de documentación as-built | Ing. Eléctrica + Ing. Control |
| 5.1.2 | Manual de operación final | Procedimientos operativos actualizados, con valores finales de parámetros | Manual de operación entregado | Ing. Control |
| 5.1.3 | Certificados e informes | Certificados de calibración, informes FAT/SAT, declaración de conformidad | Expediente de certificados | Calidad / PM |
| **5.2** | **Formación al cliente** | | | |
| 5.2.1 | Formación técnica | Operación, mantenimiento básico, resolución de incidencias menores | Registro de formación firmado | Ing. Control |
| **5.3** | **Cierre del proyecto** | | | |
| 5.3.1 | Cierre administrativo | Facturación final, liquidación de hitos, archivo de documentación | Factura final emitida | PM + Administración |
| 5.3.2 | Acta de cierre del proyecto | Firma de cierre entre partes | Acta de cierre firmada | PM + Cliente |

---

## 6. Matriz de Dependencias entre Paquetes

```
EDT-1 (Ingeniería)
  ├─ 1.2 depende de 1.1 (detalle depende de básico)
  ├─ 1.3 depende de 1.1 + 1.2
  └─ HITO: Aprobación ingeniería (~15 oct) → Pago 20%
         │
         ▼
EDT-2 (Aprovisionamiento y Fabricación)
  ├─ 2.1 depende de 1.1.1 + 1.1.2 (compras precisan specs)
  ├─ 2.2 depende de 1.2.2 + 1.2.4
  ├─ 2.3 depende de 1.2.1
  ├─ 2.4 depende de 2.1 + 2.2 + 2.3
  └─ 2.5 depende de 2.4
         │
         ▼
EDT-3 (Instalación en planta)
  ├─ 3.1 depende de 2.5 (material recibido en planta)
  ├─ 3.2 depende de 3.1 + Layout cliente (responsabilidad del cliente)
  ├─ 3.3 depende de 3.2
  ├─ 3.4 depende de 3.3
  └─ HITO: Instalación completada (~15 ene) → Alineado con FAT
         │
         ▼
EDT-4 (Puesta en marcha, FAT, SAT)
  ├─ 4.1 depende de 3.4
  ├─ 4.2 depende de 4.1
  │   └─ HITO: FAT aprobado (~15 ene) → Pago 30%
  └─ 4.3 depende de 4.2
         │
         ▼
EDT-5 (Cierre, formación, as-built)
  ├─ 5.1 depende de 4.1 + 4.2 + 4.3
  ├─ 5.2 depende de 4.3
  └─ 5.3 depende de 5.1 + 5.2
      └─ HITO: Cierre SAT + Acta firma (~28 feb) → Pago 10%
```

---

## 7. Estimación de Horas y Recursos

### 6.1 Horas por EDT y paquete

| EDT | Paquetes | Horas EDT |
|---|---|---|
| EDT-1 — Ingeniería | 1.1, 1.2, 1.3 | ~336 h |
| EDT-2 — Aprovisionamiento y Fabricación | 2.1, 2.2, 2.3, 2.4, 2.5 | ~336 h |
| EDT-3 — Instalación en planta | 3.1, 3.2, 3.3, 3.4 | ~264 h |
| EDT-4 — Puesta en marcha + FAT + SAT | 4.1, 4.2, 4.3 | ~224 h |
| EDT-5 — Cierre, formación, as-built | 5.1, 5.2, 5.3 | ~96 h |
| **TOTAL** | **~30 paquetes** | **~1.256 h** |

**Ratios clave:**
- Duración total: ~24 semanas / 6 meses
- Media: ~210 h/mes ≈ **~2,6 ETP** (equivalente a tiempo completo)

### 6.2 Detalle EDT-1 · Ingeniería (~336 h)

| Código | Paquete | Sem 1-2 | Sem 3-4 | Sem 5-6 | Total h | Perfil |
|---|---|---|---|---|---|---|
| **1.1** | **Ingeniería básica** | | | | **~144 h** | |
| 1.1.1 | Mecánica básica | ████████ | ██ | | 40 | Ing. Mecánica |
| 1.1.2 | Eléctrica básica | ████████ | ██ | | 40 | Ing. Eléctrica |
| 1.1.3 | Especificación instrumentación | ████ | ████ | | 32 | Ing. Control |
| 1.1.4 | Especificación de control | ████ | ████ | | 32 | Ing. Control |
| **1.2** | **Ingeniería de detalle** | | | | **~168 h** | |
| 1.2.1 | Planos detalle mecánicos | ██ | ████████ | ██ | 40 | Ing. Mecánica |
| 1.2.2 | Esquemas eléctricos detalle | | ████████ | ██ | 40 | Ing. Eléctrica |
| 1.2.3 | Programa PLC | | ████ | ████ | 40 | Ing. Control |
| 1.2.4 | Diseño armario control | | ████ | ████ | 32 | Ing. Eléctrica |
| 1.2.5 | Revisión y aprobación cliente | | | ████ | 16 | PM + Cliente |
| **1.3** | **Gestión de documentación** | | | | **~24 h** | |
| 1.3.1 | Registro y control docs | ██ | ██ | ██ | 8 | PM |
| 1.3.2 | Manual de operación preliminar | | | ████ | 16 | Ing. Control |

### 6.3 Detalle EDT-2 · Aprovisionamiento y Fabricación (~336 h)

| Código | Paquete | Sem 7-8 | Sem 9-10 | Sem 11-12 | Total h | Perfil |
|---|---|---|---|---|---|---|
| **2.1** | **Aprovisionamiento** | | | | **~40 h** | |
| 2.1.1 | Pedido y compra materiales | ████ | | | 16 | Compras |
| 2.1.2 | Seguimiento proveedores | ██ | ████ | | 16 | PM |
| 2.1.3 | Recepción y verificación | | ████ | | 8 | Almacén |
| **2.2** | **Fabricación armarios** | | | | **~200 h** | |
| 2.2.1 | Armario de potencia | | ██████████ | ████ | 80 | Taller + Ing. Eléc. |
| 2.2.2 | Armario de control | | ████████ | ████ | 80 | Taller + Ing. Eléc. |
| **2.3** | **Fabricación mecánica** | | | | **~40 h** | |
| 2.3.1 | Mecanizado taller | | ████ | ████ | 40 | Taller + Ing. Mec. |
| **2.4** | **Integración y pruebas taller** | | | | **~80 h** | |
| 2.4.1 | Integración sistema taller | | | ████████ | 48 | Ing. Eléc. + Ing. Control |
| 2.4.2 | Pruebas parciales taller | | | ████ | 32 | Ing. Control |
| **2.5** | **Embalaje y logística** | | | | **~16 h** | |
| 2.5.1 | Embalaje | | | ███ | 8 | Logística |
| 2.5.2 | Envío a planta cliente | | | ███ | 8 | Logística |

### 6.4 Detalle EDT-3 · Instalación en Planta (~264 h)

| Código | Paquete | Sem 13 | Sem 14 | Sem 15 | Sem 16-17 | Total h | Perfil |
|---|---|---|---|---|---|---|---|
| **3.1** | **Gestión acceso** | | | | | **~24 h** | |
| 3.1.1 | Coordinación con cliente | ██ | ██ | | | 8 | PM |
| 3.1.2 | Verificación infraestructura | ██ | ██ | | | 16 | Ing. Eléctrica |
| **3.2** | **Instalación mecánica** | | | | | **~96 h** | |
| 3.2.1 | Recepción y posicionamiento | ████ | ██ | | | 32 | Ing. Mec. + Cliente |
| 3.2.2 | Montaje mecánico | | ████████ | ████ | | 64 | Ing. Mecánica |
| **3.3** | **Instalación eléctrica** | | | | | **~96 h** | |
| 3.3.1 | Instalación armarios | | ████ | ████ | | 40 | Ing. Eléctrica |
| 3.3.2 | Cableado de campo | | ████ | ████ | | 40 | Ing. Eléctrica |
| 3.3.3 | Conexión sensores cliente | | | ████ | | 16 | Cliente + Ing. Control |
| **3.4** | **Verificación pre-comm.** | | | | | **~48 h** | |
| 3.4.1 | Inspección visual / continuidad | | | ████ | ██ | 24 | Ing. Eléctrica |
| 3.4.2 | Verificación señales / ProfiNET | | | ████ | ██ | 24 | Ing. Control |

### 6.5 Detalle EDT-4 · Puesta en Marcha, FAT y SAT (~224 h)

| Código | Paquete | Sem 17-18 | Sem 19-20 | Sem 21-22 | Sem 23-24 | Total h | Perfil |
|---|---|---|---|---|---|---|---|
| **4.1** | **Commissioning** | | | | | **~128 h** | |
| 4.1.1 | Configuración variadores | ████ | ██ | | | 32 | Ing. Control |
| 4.1.2 | Configuración bus DC | ████ | ██ | | | 32 | Ing. Control |
| 4.1.3 | Programación y ajuste PLC | ████ | ████ | | | 32 | Ing. Control |
| 4.1.4 | Calibración de sensores | | ████ | | | 16 | Ing. Control |
| 4.1.5 | Pruebas de integración | | ████ | | | 16 | Ing. Control |
| **4.2** | **FAT** | | | | | **~48 h** | |
| 4.2.1 | Planificación FAT | | ██ | | | 8 | PM + Cliente |
| 4.2.2 | Ejecución FAT | | | ████████ | | 32 | Ing. Control + Cliente |
| 4.2.3 | Corrección incidencias | | | ████ | | 8 | Ing. Control |
| **4.3** | **SAT** | | | | | **~48 h** | |
| 4.3.1 | Planificación SAT | | | ██ | | 8 | PM + Cliente |
| 4.3.2 | Ejecución SAT | | | ████ | ████ | 32 | Ing. Control + Cliente |
| 4.3.3 | Firma de aceptación SAT | | | | ████ | 8 | Cliente + Proveedor |

### 6.6 Distribución por perfil

| Perfil | Horas est. | % |
|---|---|---|
| Ing. Control | ~360 h | 29% |
| Ing. Eléctrica | ~300 h | 24% |
| Taller | ~240 h | 19% |
| Ing. Mecánica | ~160 h | 13% |
| PM / Compras / Calidad | ~196 h | 16% |
| **Total** | **~1.256 h** | **100%** |

---

## 8. Cronograma — Diagrama de Gantt Simplificado

```
LEYENDA: ██ = duración  |  || = hito de pago

CALENDARIO (semanas del proyecto)
Sem:    1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
Fecha               15oct      30nov  1dic    15ene 16ene              28feb

EDT-1 INGENIERÍA
  1.1 Ing. básica           ████████████
  1.2 Ing. detalle               ████████████████████
  1.3 Docs                            ████           ████
  HITO: Aprobación Ing.                   ||

EDT-2 APROVISIONAMIENTO
  2.1 Aprovisionamiento              ████████
  2.2 Fabric. armarios                    ████████████████
  2.3 Fabric. mecánica                        █████████
  2.4 Integración taller                           █████████
  2.5 Embalaje / envío                                ███
  HITO: Material en planta                               ||

EDT-3 INSTALACIÓN PLANTA
  3.1 Coordinación / infra                 ████
  3.2 Instalación mecánica                      ████████████████
  3.3 Instalación eléctrica                         ████████████████████
  3.4 Verificación pre-comm.                                    ████████
  HITO: Instalación completada                                     ||

EDT-4 PUESTA EN MARCHA / FAT / SAT
  4.1 Commissioning                                          ████████████████████
  4.2 FAT                                                        ████████████████
  HITO: FAT aprobado                                                   ||
  4.3 SAT                                                                  ████████████████████
  HITO: SAT aprobado + cierre                                               ||

EDT-5 CIERRE / FORMACIÓN
  5.1 Documentación as-built                                         ████████████████████
  5.2 Formación                                                              ████████
  5.3 Cierre administrativo                                                     ████████████████
```

### Tabla de hitos

| Hito | Fecha objetivo | EDT responsable | Día proyecto |
|---|---|---|---|
| Inicio proyecto | 1 sep 2026 | — | Día 0 |
| Aprobación ingeniería | 15 oct 2026 | EDT-1 | Día 45 |
| Material en planta | 30 nov 2026 | EDT-2 | Día 90 |
| Instalación completada / FAT | 15 ene 2027 | EDT-3 / EDT-4 | Día 105 |
| SAT aprobado + firma cierre | 28 feb 2027 | EDT-4 / EDT-5 | Día 150 |

---

## 9. RBS — Registro de Riesgos

### 8.1 Categorías de nivel 1

| Código | Categoría |
|---|---|
| RBS-1 | Riesgos técnicos |
| RBS-2 | Riesgos de suministro |
| RBS-3 | Riesgos de cliente |
| RBS-4 | Riesgos de instalación |
| RBS-5 | Riesgos externos |

### 8.2 Registro detallado de riesgos

#### RBS-1 · Riesgos técnicos

| ID | Riesgo | Prob. | Imp. | Score | Mitigación (M) / Contingencia (C) |
|---|---|---|---|---|---|
| R-1.1 | Error en ingeniería básica que requiere rediseño en detalle | Media | Alta | 🟡 15 | M: revisión formal a final de 1.1 / C: addendum de ingeniería |
| R-1.2 | Incompatibilidad entre variadores y motor 4Q en bus DC | Baja | Muy alta | 🟡 12 | M: validación técnica con proveedor en fase de specs / C: cambio de modelo |
| R-1.3 | Fallo en integración de sensores del cliente (PLC) | Media | Alta | 🟡 15 | M: SLA claro y validación de interfaces en EDT-1.3 / C: provisión de I/O adicionales |
| R-1.4 | Parámetros PID de control de bus DC no convergen | Media | Alta | 🟡 15 | M: experiencia previa con bus DC / C: soporte del fabricante del variador |
| R-1.5 | Fallo en prueba FAT: no se alcanzan los pares o velocidades requeridos | Baja | Muy alta | 🟡 12 | M: ingeniería conservadora + pruebas parciales en taller / C: redesign de acoplamiento |
| R-1.6 | Deficiencia en el programa PLC que provoca paradas no deseadas | Media | Alta | 🟡 15 | M: revisión de código + tests en taller / C: horas de ingeniería adicionales (reserva) |

#### RBS-2 · Riesgos de suministro

| ID | Riesgo | Prob. | Imp. | Score | Mitigación (M) / Contingencia (C) |
|---|---|---|---|---|---|
| R-2.1 | Retraso en entrega de variadores o PLC (plazo > 6 sem) | Media | Alta | 🟡 15 | M: pedido inmediato tras aceptación oferta / C: variadores de stock del fabricante |
| R-2.2 | Componente defectuoso recibido (armario, motor) | Baja | Alta | 🟢 8 | M: inspección a recepción / C: RMA + buffer de 1 semana |
| R-2.3 | Motor 75 kW 4Q no disponible en plazo | Baja | Muy alta | 🟡 12 | M: confirmación de disponibilidad antes de pedido / C: solicitar extensión de plazo |
| R-2.4 | Fallo de proveedor subcontractado (mecanizado) | Baja | Media | 🟢 8 | M: 2 proveedores identificados / C: taller interno |

#### RBS-3 · Riesgos de cliente ⚠️ CRÍTICOS

| ID | Riesgo | Prob. | Imp. | Score | Mitigación (M) / Contingencia (C) |
|---|---|---|---|---|---|
| R-3.1 | **Cliente no entrega layout de planta en plazo** | Alta | Muy alta | 🔴 25 | M: recordatorio formal a kick-off / C: reclamar extensión de plazo contractual |
| R-3.2 | **Cliente no entrega sensores a tiempo** | Alta | Alta | 🟠 20 | M: SLA escrito con fechas / C: trabajar sin sensor de par; paralizar EDT-4.1.4 |
| R-3.3 | Cambio de alcance o requisito durante el proyecto (scope creep) | Media | Alta | 🟡 15 | M: control de cambios formal / C: addendum de oferta |
| R-3.4 | Retraso en pago de algún hito | Media | Alta | 🟡 15 | M: facturación inmediata tras cada hito / C: suspensión de trabajos según cláusula |
| R-3.5 | Falta de acceso a planta del cliente en fechas acordadas | Media | Alta | 🟡 15 | M: coordinación anticipada en EDT-3.1.1 / C: renegociar fecha de instalación |
| R-3.6 | Cliente no facilita personal de apoyo durante instalación / SAT | Media | Media | 🟡 10 | M: asignar recursos propios suficientes / C: incremento de horas de proveedor |

#### RBS-4 · Riesgos de instalación

| ID | Riesgo | Prob. | Imp. | Score | Mitigación (M) / Contingencia (C) |
|---|---|---|---|---|---|
| R-4.1 | Espacio insuficiente o condiciones de planta inadecuadas | Baja | Alta | 🟢 8 | M: visita de verificación en EDT-3.1.2 / C: adaptación del diseño, obra civil adicional |
| R-4.2 | Daño en equipos durante transporte o manipulación | Baja | Alta | 🟢 8 | M: embalaje profesional / C: seguro de transporte + reparación |
| R-4.3 | Problemas de puesta a tierra o alimentación eléctrica en planta | Media | Alta | 🟡 15 | M: verificación previa (EDT-3.1.2) / C: generador o inversores de aislamiento |

#### RBS-5 · Riesgos externos

| ID | Riesgo | Prob. | Imp. | Score | Mitigación (M) / Contingencia (C) |
|---|---|---|---|---|---|
| R-5.1 | Fuerza mayor (inundación, incendio, pandemia) | Muy baja | Muy alta | 🟡 10 | M: ninguna / C: fuerza mayor contractual, extensión automática de plazo |
| R-5.2 | Cambio normativo que afecte a requisitos de seguridad | Muy baja | Alta | 🟢 6 | M: monitoreo de normativa aplicable / C: adaptación del diseño |
| R-5.3 | Aumento de precios de componentes por mercado | Baja | Media | 🟢 6 | M: precios cerrados en pedido / C: materiales de stock |

### 8.3 Matriz probabilidad × impacto

```
                    IMPACTO
              Bajo    Medio    Alto    Muy alto
          ┌────────┬────────┬────────┬────────┐
Probabilidad│ R-2.2  │R-2.4   │R-4.1   │        │
   Alta    │ R-5.2  │R-4.3   │R-2.1   │R-3.1 🔴│
          │ R-5.3  │R-3.6   │R-1.1   │        │
          │        │        │R-3.2 🟠│        │
          ├────────┼────────┼────────┼────────┤
Probabilidad│        │        │        │        │
   Media   │        │R-1.4   │R-1.3   │        │
          │        │R-3.3   │R-1.6   │        │
          │        │R-3.4   │R-3.5   │        │
          │        │        │        │        │
          ├────────┼────────┼────────┼────────┤
Probabilidad│ R-5.1  │        │R-1.2   │R-1.5   │
   Baja    │        │        │R-2.3   │        │
          │        │        │R-4.2   │        │
          └────────┴────────┴────────┴────────┘
```

### 8.4 Riesgos prioritarios para seguimiento

| Prioridad | ID | Descripción | Score | Acción inmediata |
|---|---|---|---|---|
| 🔴 1 | R-3.1 | Cliente no entrega layout de planta | 25 | Solicitar layout en reunión de kick-off con fecha compromiso |
| 🟠 2 | R-3.2 | Cliente no entrega sensores a tiempo | 20 | **AI-3 en Kick-off:** Compromiso escrito del cliente con fecha de entrega de los 9 sensores; si no se obtiene → activar plan de contingencia |
| 🟡 3 | R-1.1 | Error en ingeniería básica → rediseño | 15 | Revisión formal a final de EDT-1.1 con checklist de cliente |
| 🟡 4 | R-1.3 | Fallo integración sensores – PLC | 15 | Validar interfaces en EDT-1.3 antes de compra de materiales |
| 🟡 5 | R-1.4 | PID bus DC no convergen | 15 | Contactar fabricante de variadores en fase de especificación |

---

## 10. Resumen Ejecutivo

- **Proyecto:** Banco de ensayos para sistema rotativo — CLIENTE INDUSTRIAL, S.A. / PROVEEDOR TÉCNICO, S.L. (O-2024-001-ANON v0.3)
- **Plazo:** 1 sep 2026 → 28 feb 2027 (6 meses / 24 semanas). **Presupuesto:** 74.356,00 € + IVA
- **EDT en 5 fases:** (1) Ingeniería, (2) Aprovisionamiento y Fabricación, (3) Instalación en planta, (4) Puesta en marcha + FAT + SAT, (5) Cierre, formación y documentación
- **~30 paquetes de trabajo** distribuidos en 14 paquetes de nivel 2 y ~30 tareas de nivel 3
- **Horas totales estimadas: ~1.256 h** (~210 h/mes ≈ ~2,6 ETP de media)
- **Perfil más exigido:** Ing. Control (~360 h, 29%), seguido de Ing. Eléctrica (~300 h, 24%) y Taller (~240 h, 19%)
- **Hitos de pago alineados:** 5 hitos que coinciden con entregas de ingeniería, envío a planta, FAT y SAT
- **Alcance del proveedor:** ingeniería, fabricación de armarios, motor 75 kW 4Q, bus DC, instrumentación, puesta en marcha y pruebas
- **Layout de planta → fuera de alcance del proveedor → responsabilidad del cliente (riesgo crítico)**
- **5 riesgos críticos identificados:** 2 con probabilidad alta e impacto muy alto/alto (R-3.1 layout y R-3.2 sensores), ambos responsabilidad del cliente
- **Gantt muestra solapamiento EDT-2/EDT-3** en la semana de transición (~Sem 12–13): fabricación de detalle y primeros trabajos de instalación pueden correr en paralelo si la infraestructura del cliente está lista

---

---

## 11. Project Charter

### 10.1 Información general

| Campo | Valor |
|---|---|
| **Nombre del proyecto** | Banco de Ensayos para Componente Mecánico de Sistema Rotativo |
| **Alias** | TEST BENCH EMBRAGUES |
| **Referencia** | O-2024-001-ANON v0.3 |
| **Cliente** | CLIENTE INDUSTRIAL, S.A. |
| **Proveedor** | PROVEEDOR TÉCNICO, S.L. |
| **Fecha de emisión** | [Fecha de firma del contrato] |
| **Versión** | 1.0 |
| **Estado** | Borrador — pendiente de firma |

---

### 10.2 Justificación del proyecto (Business Case)

Desarrollo de un banco de ensayos para validar el comportamiento dinámico y el rendimiento de un componente mecánico de sistema rotativo industrial. El sistema permite:

- **Validación técnica**: caracterización del componente bajo condiciones reales de carga y velocidad
- **Eficiencia energética**: regeneración de energía al bus DC común, reduciendo el consumo frente a bancos de absorción tradicionales
- **Flexibilidad de ensayo**: motor de 4 cuadrantes que permite operar como generador o motor, cubriendo todo el rango de pares y velocidades del componente bajo prueba
- **Reducción de coste de desarrollo**: detección temprana de problemas de diseño antes de la puesta en servicio final del componente

**Beneficio esperado para el cliente:**
- Validación objetiva del componente bajo especificaciones
- Datos de rendimiento para la documentación técnica del producto
- Reducción del riesgo en la puesta en marcha del sistema completo

---

### 10.3 Objetivos del proyecto

| # | Objetivo | Criterio de éxito |
|---|---|---|
| OBJ-1 | Entregar un banco de ensayos operativo en planta del cliente | Aprobación SAT firmada antes del 28 feb 2027 |
| OBJ-2 | Validar el comportamiento dinámico del componente | FATpassed según protocolo acordado |
| OBJ-3 | Garantizar la regeneración energética al bus DC | Rendimiento del bus DC verificado ≥ [PENDIENTE: % objetivo] |
| OBJ-4 | Minimizar el consumo energético del banco | Registro de consumo durante FAT/SAT dentro de especificaciones |
| OBJ-5 | Garantizar la seguridad del sistema | Cumplimiento de IEC 60204-1 e ISO 13849-1 |

---

### 10.4 Alcance del proyecto

#### Dentro del alcance ✓

- Ingeniería básica y de detalle (mecánica, eléctrica, control)
- Fabricación de armarios de potencia y control
- Suministro e integración del motor 75 kW 4Q y encoder
- Sistema de bus DC común con regeneración
- Instalación y puesta en marcha en planta del cliente
- Pruebas FAT y SAT según protocolo
- Formación al equipo del cliente
- Documentación as-built

#### Fuera del alcance ✗

- Disposición general / layout de planta (responsabilidad del cliente)
- Suministro de sensores (responsabilidad del cliente: 4×temp, 2×vel, 2×accel, 1×par)
- Obra civil o preparación de infraestructura de planta
- Mantenimiento post-garantía
- Software de gestión de activos o SCADA (más allá del control de lazo cerrado del banco)

---

### 10.5 Restricciones del proyecto

| Tipo | Restricción | Responsable |
|---|---|---|
| **Plazo** | Cierre del proyecto: 28 feb 2027 | Proveedor + Cliente |
| **Presupuesto** | 74.356,00 € + IVA (no incluye cambios de alcance) | Proveedor |
| **Tecnológica** | Bus DC común, control PID, ProfiNET | Proveedor |
| **Infraestructura** | Layout de planta, alimentación, puesta a tierra | **Cliente** |
| **Componentes** | Entrega de sensores del cliente antes del inicio de EDT-4 | **Cliente** |
| **Normativa** | IEC 60204-1, IEC 61800-2, ISO 13849-1 | Proveedor |

---

### 10.6 Supuestos del proyecto

| # | Supuesto |
|---|---|
| SUP-1 | El cliente dispondrá del layout de planta antes del 1 dic 2026 |
| SUP-2 | El cliente entregará los sensores antes del inicio de la fase EDT-4 (16 ene 2027) |
| SUP-3 | El cliente facilitará acceso a planta y grúa según el plan de instalación |
| SUP-4 | Los pagos se realizarán según los hitos pactados sin retrasos |
| SUP-5 | No habrá cambios de alcance durante la ejecución del proyecto |

---

### 10.7 Partes interesadas (Stakeholders)

| Parte interesada | Rol | Expectativa principal | Gestión |
|---|---|---|---|
| CLIENTE INDUSTRIAL, S.A. | Cliente final | Banco operativo y aprobado SAT | Relación directa PM |
| Director Técnico (cliente) | Decisor técnico | Validación del componente | Reuniones de seguimiento |
| PROVEEDOR TÉCNICO, S.L. | Proveedor / ejecutor | Entrega a tiempo y dentro de presupuesto | Gestión interna |
| Director Comercial (proveedor) | Sponsor del proyecto | Rentabilidad y satisfacción del cliente | Escalado de riesgos |
| Equipo de ingeniería (proveedor) | Ejecutores técnicos | Claridad en specs y plazos | Comunicaciones internas |
| Normativa aplicable | Requisito externo | Cumplimiento de IEC/ISO | Verificación en EDT-4 |

---

### 10.8 Estructura de gobernanza

| Mecanismo | Frecuencia | Participantes | Objetivo |
|---|---|---|---|
| Reunión de seguimiento | Quincenal | PM + Director Técnico cliente | Seguimiento de hitos, riesgos abiertos |
| Revisión de ingeniería | Fin de EDT-1 | Ing. Eléctrica + Ing. Control + Cliente | Aprobación de specs |
| Revisión pre-envío | Fin de EDT-2 | PM + Cliente | Inspección visual, packing list |
| Revisión FAT | Fin de EDT-4.2 | Proveedor + Cliente | Firma de protocolo FAT |
| Revisión SAT | Fin de EDT-4.3 | Proveedor + Cliente | Firma de aceptación SAT |
| Reunión de cierre | Fin de EDT-5 | PM + Director Comercial + Cliente | Firma de acta de cierre |

---

### 10.9 Resumen de hitos

| Hito | Fecha | Entregable | Criterio de éxito |
|---|---|---|---|
| M1 — Kick-off | [Fecha inicio] | Acta de kick-off, Charter firmado | Charter firmado por ambas partes |
| M2 — Aprobación ingeniería | 15 oct 2026 | Documentación EDT-1 aprobada | Acta de aprobación ingeniería |
| M3 — Material en planta | 30 nov 2026 | Equipos recibidos en planta | Albarán de entrega firmado |
| M4 — FAT aprobado | 15 ene 2027 | Protocolo FAT firmado | Acta FAT |
| M5 — SAT aprobado | 28 feb 2027 | Acta SAT + acta de cierre | Firma de aceptación final |

---

### 10.10 Firmas del Project Charter

| Rol | Nombre | Empresa | Firma | Fecha |
|---|---|---|---|---|
| Director Comercial | | PROVEEDOR TÉCNICO, S.L. | | |
| Project Manager | | PROVEEDOR TÉCNICO, S.L. | | |
| Director Técnico | | CLIENTE INDUSTRIAL, S.A. | | |
| Responsable de proyecto | | CLIENTE INDUSTRIAL, S.A. | | |

---

## 12. Orden del Día — Reunión de Kick-off

### Información de la reunión

| Campo | Valor |
|---|---|
| **Proyecto** | TEST BENCH EMBRAGUES |
| **Fecha** | [Fecha de celebración — primer día del proyecto] |
| **Hora** | [Hora de inicio] — [Hora de fin estimada] |
| **Lugar** | [Presencial: sala / ubicación] / [Virtual: link de videoconferencia] |
| **Convocante** | Project Manager — PROVEEDOR TÉCNICO, S.L. |
| **Asistentes esperados** | PM, Director Comercial (proveedor), Director Técnico, Responsable de proyecto (cliente) |

---

### Orden del día

#### Bloque 1 — Apertura y contexto *(15 min)*

| # | Tema | Responsable | Objetivo | Duración |
|---|---|---|---|---|
| 1.1 | Bienvenida y presentación de asistentes | PM | Asegurar que todos los participantes se conocen | 5 min |
| 1.2 | Objetivo de la reunión | PM | Alineación sobre el propósito del kick-off | 5 min |
| 1.3 | Revisión del contexto del proyecto | PM | Recordar alcance, plazos y condiciones generales | 5 min |

#### Bloque 2 — Presentación del Project Charter *(20 min)*

| # | Tema | Responsable | Objetivo | Duración |
|---|---|---|---|---|
| 2.1 | Lectura y explicación del Project Charter | PM | Asegurar comprensión común de objetivos, alcance y restricciones | 10 min |
| 2.2 | Firma del Project Charter | PM + Cliente | Compromiso formal de ambas partes | 5 min |
| 2.3 | Preguntas y aclaraciones sobre el Charter | Todos | Resolver dudas antes de continuar | 5 min |

#### Bloque 3 — EDT y cronograma *(20 min)*

| # | Tema | Responsable | Objetivo | Duración |
|---|---|---|---|---|
| 3.1 | Presentación de la EDT y paquetes de trabajo | PM | Asegurar que el cliente entiende la estructura del proyecto | 8 min |
| 3.2 | Cronograma y hitos principales | PM | Confirmar fechas objetivo con el cliente | 7 min |
| 3.3 | Alineación sobre hitos de pago | PM + Admin | Confirmar proceso de facturación | 5 min |

#### Bloque 4 — Responsabilidades y gobernanza *(15 min)*

| # | Tema | Responsable | Objetivo | Duración |
|---|---|---|---|---|
| 4.1 | Revisión de la Matriz RACI | PM | Confirmar responsables de cada paquete | 5 min |
| 4.2 | Frecuencia y formato de reuniones de seguimiento | PM | Acordar cadencia de seguimiento (quincenal) | 5 min |
| 4.3 | Canales de comunicación y escalado | PM | Definir interlocutores y vías de contacto | 5 min |

#### Bloque 5 — Riesgos críticos y dependencias del cliente *(25 min)* ⚠️

| # | Tema | Responsable | Objetivo | Duración |
|---|---|---|---|---|
| 5.1 | Riesgo R-3.1: Layout de planta — compromiso de entrega | PM + Cliente | **Obtener fecha comprometeda de entrega del layout de planta en formato written** | 7 min |
| 5.2 | Riesgo R-3.2: Sensores del cliente — compromiso de entrega | PM + Cliente | **Obtener fecha comprometeda de entrega de los 9 sensores (4× temperatura, 2× velocidad, 2× aceleración, 1× par); Formalizar compromiso escrito** | 10 min |
| 5.3 | Otros riesgos compartidos (accesos, infraestructura) | PM + Cliente | Identificar necesidades de coordinación | 8 min |

#### Bloque 6 — Plan de Gestión de Cambios *(10 min)*

| # | Tema | Responsable | Objetivo | Duración |
|---|---|---|---|---|
| 6.1 | Explicación del proceso de gestión de cambios | PM | Asegurar que el cliente entiende el procedimiento SC/OC | 5 min |
| 6.2 | Acuerdo sobre cómo se gestionarán los cambios | PM + Cliente | Compromiso mutuo sobre el proceso | 5 min |

#### Bloque 7 — Cierre *(10 min)*

| # | Tema | Responsable | Objetivo | Duración |
|---|---|---|---|---|
| 7.1 | Resumen de acuerdos y compromisos | PM | Dejar claros los action items | 5 min |
| 7.2 | Revisión de action items y asignación de responsables | PM | Cada acción con responsable y fecha | 3 min |
| 7.3 | Próximos pasos y fecha de la próxima reunión | PM | Confirmar seguimiento | 2 min |

---

### Action Items — Plantilla de seguimiento

| # | Acción | Responsable | Fecha límite | Estado |
|---|---|---|---|---|
| AI-1 | Entregar copia firmada del Project Charter a ambas partes | PM + Cliente | Kick-off | Abierta |
| AI-2 | Confirmar fecha de entrega del **layout de planta** (R-3.1) por escrito | CLIENTE INDUSTRIAL | Kick-off + 3 días | Abierta |
| AI-3 | Confirmar fecha de entrega de **sensores del cliente** (R-3.2) por escrito: 4× temperatura, 2× velocidad, 2× aceleración, 1× par | CLIENTE INDUSTRIAL | Kick-off + 3 días | Abierta |
| AI-4 | Distribuir acta de Kick-off con action items firmadas | PM | Kick-off + 1 día | Abierta |
| AI-3 | | | | Abierta |
| AI-4 | | | | Abierta |
| AI-5 | | | | Abierta |

---

### Minimum Acceptance Criteria — Kick-off

| Criterio | Indicador |
|---|---|
| ☐ | Project Charter firmado por ambas partes |
| ☐ | Fecha de entrega del layout confirmada por el cliente |
| ☐ | SLA de sensores firmado o confirmado por escrito |
| ☐ | Frecuencia de reuniones de seguimiento acordada |
| ☐ | Action items asignados y con fecha |
| ☐ | Acta de kick-off distribuida |

---

### Acta de Reunión de Kick-off — Plantilla

```
════════════════════════════════════════════════════════════
ACTA DE REUNIÓN DE KICK-OFF
════════════════════════════════════════════════════════════

Proyecto:     TEST BENCH EMBRAGUES
Referencia:  O-2024-001-ANON v0.3
Fecha:       ___/___/______
Lugar:       ________________________________

ASISTENTES:
  Nombre              Empresa                   Rol
  ───────────────────────────────────────────────────
  1. ________________  PROVEEDOR TÉCNICO, S.L.  PM / Director Comercial
  2. ________________  CLIENTE INDUSTRIAL, S.A.  Director Técnico
  3. ________________  CLIENTE INDUSTRIAL, S.A.  Responsable proyecto
  4. ________________  PROVEEDOR TÉCNICO, S.L.  _______________
  5. ________________  PROVEEDOR TÉCNICO, S.L.  _______________

ACUERDOS:

1. Project Charter:
   □ Firmado por ambas partes
   □ No firme — motivo: _______________________________

2. Layout de planta:
   Fecha compromiso de entrega: ___/___/______
   Responsable en cliente: _______________________________

3. Sensores del cliente (4× temperatura, 2× velocidad, 2× aceleración, 1× par — ver oferta O-2024-001-ANON v0.3):
   □ Compromiso escrito entregado    □ Pendiente — Riesgo R-3.2 activo
   Fecha compromiso de entrega: ___/___/______
   Responsable en cliente: _______________________________

4. Reuniones de seguimiento:
   Frecuencia acordada: Quincenal / Mensual / Otra: _________
   Día/hora preferido: _________________________________

5. Otros acuerdos:

   _________________________________________________________
   _________________________________________________________

ACTION ITEMS:

  #   Acción                                    Responsable  Fecha
  ──────────────────────────────────────────────────────────────────
  1   _________________________________  __________________  ___/___/______
  2   _________________________________  __________________  ___/___/______
  3   _________________________________  __________________  ___/___/______
  4   _________________________________  __________________  ___/___/______
  5   _________________________________  __________________  ___/___/______

PRÓXIMA REUNIÓN:
  Fecha: ___/___/______    Hora: ________    Lugar/Link: _____________

FIRMAS:

_____________________________    _____________________________
PM — PROVEEDOR TÉCNICO         Director Técnico — CLIENTE INDUSTRIAL

Fecha: ___/___/______         Fecha: ___/___/______

════════════════════════════════════════════════════════════
```

---

## 13. Matriz RACI

### Convenciones

| Código | Responsable | Definición |
|---|---|---|
| **R** | Responsible (Responsable de ejecución) | Ejecuta la tarea |
| **A** | Accountable (Responsable ante el cliente) | Toma la decisión final, firma el entregable |
| **C** | Consulted (Consultado) | Aporta información o aprobación previa |
| **I** | Informed (Informado) | Recibe notificación del resultado |

> **Regla:** Solo un **A** por fila. Las celdas vacías significan "no aplica".

### Roles del proyecto

| Sigla | Rol |
|---|---|
| PM | Project Manager (Proveedor) |
| IE | Ingeniero Eléctrico (Proveedor) |
| IC | Ingeniero de Control (Proveedor) |
| IM | Ingeniero Mecánico (Proveedor) |
| T | Taller / Fabricación (Proveedor) |
| C | Compras (Proveedor) |
| Ca | Calidad (Proveedor) |
| L | Logística (Proveedor) |
| CL | Cliente (CLIENTE INDUSTRIAL, S.A.) |
| ADM | Administración (Proveedor) |

---

### Matriz RACI — EDT-1 · Ingeniería

| Paquete / Tarea | PM | IE | IC | IM | C | Ca | CL | ADM |
|---|---|---|---|---|---|---|---|---|
| **1.1** **Ingeniería básica** | | | | | | | | |
| 1.1.1 Mecánica básica | I | C | I | **R/A** | | | I | |
| 1.1.2 Eléctrica básica | I | **R/A** | C | | | | I | |
| 1.1.3 Especificación instrumentación | I | C | **R/A** | | | | I | |
| 1.1.4 Especificación de control | I | C | **R/A** | | | | I | |
| **1.2** **Ingeniería de detalle** | | | | | | | | |
| 1.2.1 Planos detalle mecánicos | I | | I | **R/A** | | | | |
| 1.2.2 Esquemas eléctricos detalle | I | **R/A** | C | | | | | |
| 1.2.3 Programa PLC | I | C | **R/A** | | | | | |
| 1.2.4 Diseño armario control | I | **R/A** | C | | | | | |
| 1.2.5 Revisión y aprobación cliente | **A** | C | C | C | | | **R** | |
| **1.3** **Gestión de documentación** | | | | | | | | |
| 1.3.1 Registro y control docs | **R/A** | | | | | | I | |
| 1.3.2 Manual de operación preliminar | I | | **R/A** | | | | | |

---

### Matriz RACI — EDT-2 · Aprovisionamiento y Fabricación

| Paquete / Tarea | PM | IE | IC | IM | T | C | Ca | L | CL |
|---|---|---|---|---|---|---|---|---|---|
| **2.1** **Aprovisionamiento** | | | | | | | | | |
| 2.1.1 Pedido y compra materiales | I | C | C | C | | **R/A** | | | |
| 2.1.2 Seguimiento proveedores | **R/A** | | | | | C | | | |
| 2.1.3 Recepción y verificación | C | C | C | C | | | **R/A** | | |
| **2.2** **Fabricación de armarios** | | | | | | | | | |
| 2.2.1 Armario de potencia | I | C | C | | **R/A** | | I | | |
| 2.2.2 Armario de control | I | C | C | | **R/A** | | I | | |
| **2.3** **Fabricación mecánica** | | | | | | | | | |
| 2.3.1 Mecanizado de piezas | I | | | C | **R/A** | | I | | |
| 2.3.2 Preparación del motor | I | | | **R/A** | C | | | | |
| **2.4** **Integración y pruebas taller** | | | | | | | | | |
| 2.4.1 Integración sistema taller | I | C | **R/A** | | C | | | | |
| 2.4.2 Pruebas parciales taller | I | | **R/A** | | | | C | | |
| **2.5** **Embalaje y logística** | | | | | | | | | |
| 2.5.1 Embalaje | I | | | | C | | | **R/A** | |
| 2.5.2 Envío a planta cliente | C | | | | | | | **R/A** | **I** |

---

### Matriz RACI — EDT-3 · Instalación en Planta

| Paquete / Tarea | PM | IE | IC | IM | T | CL |
|---|---|---|---|---|---|---|
| **3.1** **Gestión de acceso** | | | | | | |
| 3.1.1 Coordinación con cliente | **R/A** | | | | | C |
| 3.1.2 Verificación infraestructura | C | **R/A** | C | C | | C |
| **3.2** **Instalación mecánica** | | | | | | |
| 3.2.1 Recepción y posicionamiento | C | | | **R/A** | | C |
| 3.2.2 Montaje mecánico | C | | | **R/A** | | I |
| **3.3** **Instalación eléctrica** | | | | | | |
| 3.3.1 Instalación de armarios | C | **R/A** | | | | I |
| 3.3.2 Cableado de campo | C | **R/A** | C | | | I |
| 3.3.3 Conexión sensores del cliente | C | C | **R/A** | | | **R/A** |
| **3.4** **Verificación pre-comm.** | | | | | | |
| 3.4.1 Inspección visual / continuidad | C | **R/A** | | | | I |
| 3.4.2 Verificación señales / ProfiNET | C | C | **R/A** | | | I |

---

### Matriz RACI — EDT-4 · Puesta en Marcha, FAT y SAT

| Paquete / Tarea | PM | IE | IC | CL |
|---|---|---|---|---|
| **4.1** **Commissioning** | | | | |
| 4.1.1 Configuración de variadores | I | C | **R/A** | I |
| 4.1.2 Configuración bus DC | I | C | **R/A** | I |
| 4.1.3 Programación y ajuste PLC | I | | **R/A** | I |
| 4.1.4 Calibración de sensores | I | | **R/A** | C |
| 4.1.5 Pruebas de integración | C | | **R/A** | C |
| **4.2** **FAT** | | | | |
| 4.2.1 Planificación FAT | **R/A** | | C | C |
| 4.2.2 Ejecución FAT | C | | **R/A** | **R/A** |
| 4.2.3 Corrección de incidencias | C | C | **R/A** | I |
| **4.3** **SAT** | | | | |
| 4.3.1 Planificación SAT | **R/A** | | C | C |
| 4.3.2 Ejecución SAT | C | | **R/A** | **R/A** |
| 4.3.3 Firma de aceptación SAT | **A** | | | **R/A** |

---

### Matriz RACI — EDT-5 · Cierre, Formación y Documentación

| Paquete / Tarea | PM | IE | IC | Ca | ADM | CL |
|---|---|---|---|---|---|---|
| **5.1** **Documentación as-built** | | | | | | |
| 5.1.1 Recopilación de documentación final | C | **R/A** | **R/A** | | | |
| 5.1.2 Manual de operación final | C | | **R/A** | | | I |
| 5.1.3 Certificados e informes | C | | | **R/A** | | |
| **5.2** **Formación** | | | | | | |
| 5.2.1 Formación técnica | C | | **R/A** | | | **R/A** |
| **5.3** **Cierre administrativo** | | | | | | |
| 5.3.1 Cierre administrativo | C | | | | **R/A** | |
| 5.3.2 Acta de cierre | **A** | | | | C | **R/A** |

---

## 14. Plan de Gestión de Cambios

### 11.1 Objetivo

Este plan establece el proceso para gestionar cualquier solicitud de cambio al alcance, plazo o coste del proyecto durante su ejecución, garantizando la transparencia entre ambas partes y la trazabilidad de las decisiones.

### 13.2 Ámbito de aplicación

Este plan aplica a todos los trabajos descritos en la oferta O-2024-001-ANON v0.3. Cualquier trabajo no expresamente incluido en el alcance se considerará fuera del mismo y requerirá un proceso de cambio.

### 13.3 Tipos de cambio

| Tipo | Descripción | Tratamiento |
|---|---|---|
| **Tipo 1 — Cambio de alcance** | Añadir, eliminar o modificar paquetes de trabajo, entregables o funcionalidades | Requiere Order de Cambio (OC) formal |
| **Tipo 2 — Cambio de plazo** | Desplazamiento de hitos por causas imputables al cliente | Requiere OC + addendum al cronograma |
| **Tipo 3 — Cambio de coste** | Cualquier variación en el presupuesto derivada de un Tipo 1 o Tipo 2 | Requiere OC con impacto económico |
| **Tipo 4 — Cambio menor** | Corrección de errores o ambigüedades en documentación existente | Puede gestionarse por correo electrónico con aceptación formal |

### 13.4 Roles en la gestión de cambios

| Rol | Responsabilidad |
|---|---|
| **Solicitante** | Genera la Solicitud de Cambio (SC) y la presenta al PM |
| **PM (Proveedor)** | Evalúa el impacto técnico, de plazo y económico, y emite la Order de Cambio (OC) |
| **Responsable técnico (Proveedor)** | Valida la viabilidad técnica de la SC |
| **Cliente** | Evalúa y aprueba/rechaza la Order de Cambio en un plazo máximo de 5 días hábiles |
| **Dirección comercial (Proveedor)** | Aprueba la OC desde el punto de vista económico si hay variación de coste |

### 13.5 Proceso de gestión de cambios

```
SOLICITANTE          PM (PROVEEDOR)           CLIENTE
    │                      │                       │
    │  1. Emitir SC        │                       │
    │─────────────────────►│                       │
    │                      │                       │
    │                      │  2. Evaluar impacto   │
    │                      │  (técnico, plazo,     │
    │                      │   coste)              │
    │                      │                       │
    │                      │  3. Emitir Order de   │
    │                      │  Cambio (OC)          │
    │                      │                       │
    │                      │  4. Revisar OC       │
    │                      │──────────────────────►│
    │                      │                       │
    │                      │  5. Aprobar /        │
    │                      │  Rechazar OC          │
    │                      │◄─────────────────────│
    │                      │                       │
    │  6. Notificar        │                       │
    │  decisión            │                       │
    │◄────────────────────│                       │
    │                      │                       │
    │  7. Ejecutar        │                       │
    │  cambio (si se      │                       │
    │  aprueba)           │                       │
```

### 13.6 Documentos de gestión de cambios

#### Solicitud de Cambio (SC)

| Campo | Descripción |
|---|---|
| Número de SC | Identificador secuencial (SC-001, SC-002…) |
| Fecha de solicitud | Fecha de emisión |
| Solicitante | Nombre y empresa |
| Paquete EDT afectado | Código EDT-X.X |
| Descripción del cambio | Descripción detallada del cambio propuesto |
| Justificación | Motivo de negocio o técnico |
| Impacto estimado | Plazo / Coste / Alcance |

#### Order de Cambio (OC)

| Campo | Descripción |
|---|---|
| Número de OC | Identificador (OC-001…) |
| SC asociada | Referencia a la SC origen |
| Fecha de emisión | Fecha de emisión de la OC |
| Cambios aprobados | Descripción de los cambios aprobados |
| Impacto en plazo | Días adicionales al plazo final |
| Impacto en coste | Importe adicional o deducción en € |
| Firmas | PM (Proveedor) + Cliente |
| Fecha límite de respuesta | 5 días hábiles desde emisión |

### 13.7 Plazos y condiciones

| Aspecto | Condición |
|---|---|
| **Plazo de respuesta del cliente** | Máximo 5 días hábiles desde emisión de la OC |
| **Silencio administrativo** | Si el cliente no responde en plazo, se entiende como rechazo tácito |
| **Ejecución sin OC aprobada** | Los trabajos adicionales NO se ejecutarán hasta la aprobación formal de la OC |
| **Facturación de cambios** | Los cambios aprobados se facturarán en el siguiente hito de pago tras su ejecución |
| **Impacto en hitos** | Cualquier cambio que afecte a hitos de pago requerirá addendum al contrato |

### 13.8 Situaciones que requieren Order de Cambio obligatoria

| # | Situación | Justificación |
|---|---|---|
| OC-1 | Cliente solicita cambio en especificaciones técnicas | Ampliación de alcance técnico |
| OC-2 | Cliente no facilita layout, sensores o accesos en plazo | Impacto directo en plazo y coste |
| OC-3 | Retraso en pagos de hitos que causa paralización | Suspensión contractual pactada |
| OC-4 | Inclusión de работы no descritas en la oferta original | Nueva ingeniería, fabricación o puesta en marcha |
| OC-5 | Cambio de normativa o requisito de seguridad durante el proyecto | Adaptación del diseño |

### 13.9 Plantilla de Solicitud de Cambio (SC)

```
═══════════════════════════════════════════════════
SOLICITUD DE CAMBIO (SC)
═══════════════════════════════════════════════════

Nº SC:        SC-____
Fecha:        ___/___/______
Proyecto:     TEST BENCH EMBRAGUES
Referencia:   O-2024-001-ANON v0.3

Solicitante:  ________________________________
Empresa:      ________________________________

PAQUETE EDT AFECTADO:  _______________________

DESCRIPCIÓN DEL CAMBIO:
_______________________________________________
_______________________________________________
_______________________________________________

JUSTIFICACIÓN:
_______________________________________________
_______________________________________________

IMPACTO ESTIMADO:
  □ Alcance:    Sí / No
  □ Plazo:      ___ días adicionales
  □ Coste:      ___ € adicionales / (deducción)

Firmado: ____________________   Fecha: ___/___/______
═══════════════════════════════════════════════════
```

### 13.10 Plantilla de Order de Cambio (OC)

```
═══════════════════════════════════════════════════
ORDER DE CAMBIO (OC)
═══════════════════════════════════════════════════

Nº OC:         OC-____
SC asociada:   SC-____
Fecha emisión: ___/___/______
Proyecto:      TEST BENCH EMBRAGUES
Referencia:    O-2024-001-ANON v0.3

DESCRIPCIÓN DEL CAMBIO:
_______________________________________________
_______________________________________________
_______________________________________________

IMPACTO APROBADO:
  □ Alcance:    Descripción del cambio de alcance
  □ Plazo:      ___ días adicionales al hito: ___________
  □ Coste:      ___ € + IVA (añadir / deducir)

CONDICIONES DE PAGO:
_______________________________________________

FIRMAS DE APROBACIÓN:

Proveedor: ____________________   Fecha: ___/___/______
Cliente:   ____________________   Fecha: ___/___/______

Fecha límite de respuesta: ___/___/______
(5 días hábiles — silencio = rechazo tácito)
═══════════════════════════════════════════════════
```

---

## 15. Registro de Órdenes de Cambio

*(A cumplimentar durante la ejecución del proyecto)*

| Nº OC | SC asociada | Descripción | Fecha | Plazo (días) | Coste (€) | Estado | Firmas |
|---|---|---|---|---|---|---|---|
| OC-001 | | | | | | Pendiente / Aprobada / Rechazada | |
| OC-002 | | | | | | Pendiente / Aprobada / Rechazada | |

---

## 16. Anexos

### Anexo A — Lista de componentes principales

| Componente | Referencia | Proveedor | Plazo entrega | Estado pedido |
|---|---|---|---|---|
| Armario de potencia (2000×1800×500 mm) | [PENDIENTE] | [PENDIENTE] | ~6 sem | [PENDIENTE] |
| Armario de control (800×1800×500 mm) | [PENDIENTE] | [PENDIENTE] | ~6 sem | [PENDIENTE] |
| Variadores de frecuencia PID | [PENDIENTE] | [PENDIENTE] | ~6 sem | [PENDIENTE] |
| PLC + tarjetas ProfiNET | [PENDIENTE] | [PENDIENTE] | ~4 sem | [PENDIENTE] |
| Motor eléctrico 75 kW 4Q con encoder | [PENDIENTE] | [PENDIENTE] | ~8 sem | [PENDIENTE] |
| Bus DC común | [PENDIENTE] | [PENDIENTE] | [PENDIENTE] | [PENDIENTE] |

### Anexo B — Sensores del cliente (SLA)

| Sensor | Tipo | Precisión requerida | Fecha entrega cliente | Estado |
|---|---|---|---|---|
| Temperatura (×4) | [PENDIENTE] | [PENDIENTE] | [PENDIENTE] | [PENDIENTE] |
| Velocidad (×2) | [PENDIENTE] | [PENDIENTE] | [PENDIENTE] | [PENDIENTE] |
| Aceleración (×2) | [PENDIENTE] | [PENDIENTE] | [PENDIENTE] | [PENDIENTE] |
| Par (×1) | [PENDIENTE] | [PENDIENTE] | [PENDIENTE] | [PENDIENTE] |

> ⚠️ **RECUERDO:** La entrega de sensores por parte del cliente es condición crítica para el inicio de EDT-4.1.4 (calibración). Formalizar mediante SLA en la reunión de kick-off.

### Anexo C — Normativa y estándares aplicables

| Norma | Descripción | Aplicabilidad |
|---|---|---|
| IEC 60204-1 | Seguridad de máquinas — Equipo eléctrico | Armarios de potencia y control |
| IEC 61800-2 | Accionamientos de potencia electrónica | Variadores y bus DC |
| ISO 13849-1 | Seguridad de máquinas — Partes de sistemas de mando | Sistema de control |
| [PENDIENTE] | Normativa específica del cliente | Requisitos adicionales del cliente |
| [PENDIENTE] | Normativa de país de instalación | Requisitos legales locales |

---

*Documento generado por Mavis · MiniMax Code*
*Proyecto TEST BENCH EMBRAGUES · O-2024-001-ANON v0.3*
*Versión del documento: 1.0 — Fecha: septiembre 2026*
