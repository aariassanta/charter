"""
DossierAgent — genera Dossier de Gestión de Proyecto en 2 pasadas.
Pasada 1: genera documento completo.
Pasada 2: si el documento está incompleto, cierra las secciones faltantes.
Compatible con agno 1.4.5.
"""
from __future__ import annotations

import json
import re
from typing import Any

from agno.agent.agent import Agent

from agents.llm_wrapper import _call_agent
from services.llm_client import build_llm_model, TIMEOUT

SYSTEM_PROMPT = (
    "Eres el agente redactor del DOSSIER DE GESTIÓN DE PROYECTO, un documento "
    "técnico-estratégico completo en español, formato rico y profesional.\n\n"
    "Tu respuesta DEBE ser ÚNICAMENTE el documento Markdown. Sin explicaciones.\n\n"
    "FORMATO: Markdown profesional PMBOK 8ª Edición. Tablas completas, no uses listas anidadas de texto plano para la EDT.\n"
    "IDIOMA: Todo en ESPAÑOL. No uses blockquotes excepto para citas del PMBOK.\n\n"
    "NOTA: Este documento NO incluye el Project Charter (documento separado) "
    "ni la Agenda de Kick-off (documento separado).\n\n"

    # ── Portada y metadatos ─────────────────────────────────────────────────
    "# DOSSIER DE GESTIÓN DE PROYECTO\n\n"
    "## {project_name}\n\n"
    "---\n\n"
    "**TABLA DE METADATOS DEL PROYECTO**\n\n"
    "| Campo | Valor |\n"
    "|---|---|\n"
    "| **Código de proyecto** | {project_code} |\n"
    "| **Referencia de oferta** | {offer_ref} |\n"
    "| **Versión del dossier** | v1.0 |\n"
    "| **Fecha de emisión** | {issue_date} |\n"
    "| **Estado** | En planificación |\n"
    "| **Clasificación** | Confidencial — Uso interno |\n"
    "| **Cliente** | {client} |\n"
    "| **Proveedor / Fabricante** | {provider} |\n"
    "| **Fecha de inicio** | {start_date} |\n"
    "| **Fecha de cierre estimada** | {end_date} |\n"
    "| **Duración total** | {duration} |\n"
    "| **Presupuesto total** | {budget} |\n"
    "| **Metodología** | Predictiva (PMBOK 8ª Edición) |\n\n"

    # ── Sección 1 ───────────────────────────────────────────────────────────
    "## 1. RESUMEN EJECUTIVO\n\n"
    "**Datos clave del proyecto:**\n\n"
    "- **Objeto:** {objectives}\n"
    "- **Presupuesto:** {budget}\n"
    "- **Plazo:** {duration}\n"
    "- **Partes:** {client} y {provider}\n"
    "- **Entregables principales:** {deliverables}\n\n"
    "{executive_summary}\n\n"
    "**Metodología declarada:** Predictiva — Waterfall clásico conforme a PMBOK 8ª Edición.\n\n"

    # ── Sección 2 ───────────────────────────────────────────────────────────
    "## 2. ALCANCE Y ESPECIFICACIONES TÉCNICAS\n\n"
    "### 2.1 Datos Generales del Proyecto\n\n"
    "| Campo | Valor |\n"
    "|---|---|\n"
    "| Nombre del proyecto | {project_name} |\n"
    "| Referencia de oferta | {offer_ref} |\n"
    "| Cliente | {client} |\n"
    "| Proveedor / Fabricante | {provider} |\n"
    "| Fecha de inicio | {start_date} |\n"
    "| Fecha de cierre estimada | {end_date} |\n"
    "| Duración total | {duration} |\n"
    "| Presupuesto total | {budget} |\n"
    "| Garantía | 12 meses desde aceptación final (SAT) |\n"
    "| Validez de la oferta | 60 días naturales desde emisión |\n\n"

    "### 2.2 Especificaciones Técnicas de Componentes\n\n"
    "| Componente | Especificación técnica | Dimensiones / Características |\n"
    "|---|---|---|\n"
    "| Motor eléctrico | 4 cuadrantes, funcionando como generador | Potencia nominal 75 kW, con encoder integrado |\n"
    "| Armario de potencia | Armario de potencia para motor y variadores | 2000 × 1800 × 500 mm |\n"
    "| Armario de control | Armario de control con PLC y HMI | 800 × 1800 × 500 mm |\n"
    "| Controlador principal | PLC con tarjetas de comunicación | ProfiNET |\n"
    "| Variadores | Variadores de frecuencia con lazo de control | Control PID integrado |\n"
    "| Sistema eléctrico | Bus DC común para regeneración de energía | Regeneración al bus DC compartido |\n"
    "| Sensor de temperatura (x4) | Sensores de temperatura para monitoreo | Rango y tipo según especificación de detalle |\n"
    "| Sensor de velocidad (x2) | Sensores de velocidad angular | Encoder o tacómetro integrado |\n"
    "| Sensor de aceleración (x2) | Sensores de aceleración dinámica | Rango según condiciones de ensayo |\n"
    "| Sensor de par (x1) | Sensor de par en el eje | Rango: par nominal del motor 75 kW |\n\n"

    "### 2.3 Scope In — Lo Incluido\n\n"
    "El alcance del proyecto incluye:\n\n"
    "- Ingeniería básica y de detalle completa del banco de ensayos.\n"
    "- Fabricación y aprovisionamiento del armario de potencia y del armario de control.\n"
    "- Suministro e integración del motor eléctrico de 4 cuadrantes (75 kW).\n"
    "- Suministro e instalación de los sensores: 4 de temperatura, 2 de velocidad, 2 de aceleración, 1 de par.\n"
    "- Instalación mecánica y eléctrica en las instalaciones del cliente.\n"
    "- Puesta en marcha: configuración del software de control, calibración de sensores y ajuste de lazos PID.\n"
    "- Ejecución de las pruebas FAT y SAT.\n"
    "- Documentación as-built completa y actualizada.\n"
    "- Formación al equipo técnico del cliente.\n"
    "- Garantía de 12 meses desde aceptación SAT.\n\n"

    "### 2.4 Scope Out — Lo Excluido\n\n"
    "El alcance NO incluye:\n\n"
    "- Trabajos de ingeniería civil, cimentaciones o obra civil de cualquier tipo.\n"
    "- Suministro de energía eléctrica, acometidas o transformadores.\n"
    "- Permisos de obra o autorizaciones administrativas.\n"
    "- Mantenimiento del sistema una vez transcurrido el período de garantía.\n"
    "- Suministro del componente mecánico bajo prueba (UUT).\n"
    "- Operación del banco de ensayos por parte del proveedor más allá de la puesta en marcha.\n\n"

    # ── Sección 3 — EDT como tablas ────────────────────────────────────────
    "## 3. EDT / WBS\n\n"
    "### Convenciones\n"
    "- **Código de nivel 1:** EDT-X (fase)\n"
    "- **Código de nivel 2:** EDT-X.X (paquete de trabajo)\n"
    "- **Código de nivel 3:** EDT-X.X.X (tarea)\n\n"
    "---\n\n"

    "### EDT-1 · Ingeniería *(1 sep — 15 oct 2026 · 6 semanas)*\n\n"
    "| Código | Paquete / Tarea | Descripción | Entregable | Responsable |\n"
    "|---|---|---|---|---|\n"
    "| **1.1** | **Ingeniería básica** | | | |\n"
    "| 1.1.1 | Mecánica básica | Diseño preliminar del soporte mecánico, bancada, integración del motor | Plano de disposición general preliminar | Ing. Mecánica |\n"
    "| 1.1.2 | Eléctrica básica | Esquema unifilar, diseño del bus DC común, configuración de variadores | Esquema unifilar aprobado | Ing. Eléctrica |\n"
    "| 1.1.3 | Especificación de instrumentación | Lista de señales, cableado, sensores (SLA) | Lista de instrumentación y señales (I/O list) | Ing. Control |\n"
    "| 1.1.4 | Especificación de control | Arquitectura de control, lazos PID, estrategia de regulación del bus DC | P&ID / Diagrama de control | Ing. Control |\n"
    "| **1.2** | **Ingeniería de detalle** | | | |\n"
    "| 1.2.1 | Planos de detalle mecánicos | Planos de taller, piezas intermedias, sujeciones | Planos de fabricación | Ing. Mecánica |\n"
    "| 1.2.2 | Esquemas eléctricos de detalle | Cableado armario potencia, armario control, bornas, puesta a tierra | Esquemas eléctricos detallados | Ing. Eléctrica |\n"
    "| 1.2.3 | Programa PLC | Código ladder/ST para control del variador, lazos PID, supervisión ProfiNET | Programa PLC documentado | Ing. Control |\n"
    "| 1.2.4 | Diseño de armario de control | Disposición física de componentes, etiquetado, listados de cable | Plano de armario de control | Ing. Eléctrica |\n"
    "| 1.2.5 | Revisión y aprobación por el cliente | Revisión formal de toda la documentación | Acta de aprobación de ingeniería | PM + Cliente |\n"
    "| **1.3** | **Gestión de documentación** | | | |\n"
    "| 1.3.1 | Registro y control de documentos | Numeración, versión, distribución | Registro de documentos | PM |\n"
    "| 1.3.2 | Manual de operación preliminar | Procedimientos de operación y secuencias de arranque | Borrador de manual de operación | Ing. Control |\n\n"

    "### EDT-2 · Aprovisionamiento y Fabricación *(16 oct — 30 nov 2026 · 6 semanas)*\n\n"
    "| Código | Paquete / Tarea | Descripción | Entregable | Responsable |\n"
    "|---|---|---|---|---|\n"
    "| **2.1** | **Aprovisionamiento** | | | |\n"
    "| 2.1.1 | Pedido y compra de materiales | Variadores, PLC, tarjetas ProfiNET, cableado, componentes mecánicos | Órdenes de compra emitidas | Compras |\n"
    "| 2.1.2 | Seguimiento de proveedores | Seguimiento de plazos de entrega, expediciones | Estado de pedidos actualizado | PM |\n"
    "| 2.1.3 | Recepción y verificación | Inspección de material recibido contra pedido y albarán | Acta de recepción y verificación | Almacén / Calidad |\n"
    "| **2.2** | **Fabricación de armarios** | | | |\n"
    "| 2.2.1 | Fabricación armario de potencia | Mecanizado, cableado, montaje de variadores PID, pruebas funcionales en taller | Armario de potencia fabricado | Taller + Ing. Eléctrica |\n"
    "| 2.2.2 | Fabricación armario de control | Montaje de PLC, ProfiNET, borneras, etiquetado, pruebas funcionales | Armario de control fabricado | Taller + Ing. Eléctrica |\n"
    "| **2.3** | **Fabricación mecánica** | | | |\n"
    "| 2.3.1 | Mecanizado de piezas | Bancada, soporte motor, acoplamientos | Piezas mecánicas terminadas | Taller + Ing. Mecánica |\n"
    "| 2.3.2 | Preparación del motor | Verificación, montaje de encoder, acoplamiento al sistema | Motor preparado para envío | Ing. Mecánica |\n"
    "| **2.4** | **Integración y pruebas en taller** | | | |\n"
    "| 2.4.1 | Integración del sistema en taller | Ensamblaje completo, conexión entre armarios, conexión bus DC | Sistema integrado en taller | Ing. Eléctrica + Ing. Control |\n"
    "| 2.4.2 | Pruebas parciales en taller | Verificación funcional básica antes de envío | Informe de pruebas en taller | Ing. Control |\n"
    "| **2.5** | **Embalaje y logística** | | | |\n"
    "| 2.5.1 | Embalaje | Embalaje de protección para transporte | Equipos embalados y listos para envío | Logística |\n"
    "| 2.5.2 | Envío a planta del cliente | Gestión del transporte, entrega en planta | Albarán de entrega | Logística |\n\n"

    "### EDT-3 · Instalación en Planta del Cliente *(1 dic 2026 — 15 ene 2027 · 7 semanas)*\n\n"
    "| Código | Paquete / Tarea | Descripción | Entregable | Responsable |\n"
    "|---|---|---|---|---|\n"
    "| **3.1** | **Gestión de acceso e infraestructura** | | | |\n"
    "| 3.1.1 | Coordinación con el cliente | Planificación de accesos, grúas, espacios, permisos de obra | Plan de instalación acordado | PM |\n"
    "| 3.1.2 | Verificación de infraestructura cliente | Comprobación de alimentación, puesta a tierra, layout | Acta de verificación de infraestructura | Ing. Eléctrica |\n"
    "| **3.2** | **Instalación mecánica** | | | |\n"
    "| 3.2.1 | Recepción y posicionamiento | Recepción de equipos en planta, posicionamiento de bancada y motor | Equipos posicionados | Ing. Mecánica + Cliente |\n"
    "| 3.2.2 | Montaje mecánico | Ensamblaje final, acoplamiento, alineación | Montaje mecánico completado | Ing. Mecánica |\n"
    "| **3.3** | **Instalación eléctrica e instrumentación** | | | |\n"
    "| 3.3.1 | Instalación de armarios | Fijación y conexión de armario de potencia y control | Armarios instalados | Ing. Eléctrica |\n"
    "| 3.3.2 | Cableado de campo | Cableado entre armarios, motor, sensores del cliente | Cableado de campo completado | Ing. Eléctrica |\n"
    "| 3.3.3 | Conexión de sensores del cliente | Integración de sensores (temp. ×4, velocidad ×2, aceleración ×2, par ×1) | Sensores integrados | Cliente + Ing. Control |\n"
    "| **3.4** | **Verificación pre-puesta en marcha** | | | |\n"
    "| 3.4.1 | Inspección visual y continuidad | Comprobación de cableado, conexiones, puesta a tierra | Acta de inspección pre-arranque | Ing. Eléctrica |\n"
    "| 3.4.2 | Verificación de señales y comunicaciones | Test de comunicaciones ProfiNET, lectura de sensores | Informe de verificación de señales | Ing. Control |\n\n"

    "### EDT-4 · Puesta en Marcha, FAT y SAT *(16 ene — 28 feb 2027 · 7 semanas)*\n\n"
    "| Código | Paquete / Tarea | Descripción | Entregable | Responsable |\n"
    "|---|---|---|---|---|\n"
    "| **4.1** | **Puesta en marcha (Commissioning)** | | | |\n"
    "| 4.1.1 | Configuración de variadores | Parametrización PID, límites de par, configuración de 4 cuadrantes | Hojas de parametrización | Ing. Control |\n"
    "| 4.1.2 | Configuración y verificación del bus DC | Parametrización de regeneración, equilibrado de carga | Informe de configuración del bus DC | Ing. Control |\n"
    "| 4.1.3 | Programación y ajuste del PLC | Verificación de lógica, lazos PID, alarmas, HMI básico | Programa PLC verificado | Ing. Control |\n"
    "| 4.1.4 | Calibración de sensores | Verificación de sensores del cliente, ajuste de rangos y escalado | Acta de calibración | Ing. Control |\n"
    "| 4.1.5 | Pruebas de integración | Secuencias de arranque/parada, comportamiento en carga, respuesta dinámica | Protocolo de pruebas de integración | Ing. Control |\n"
    "| **4.2** | **Pruebas FAT (Factory Acceptance Test)** | | | |\n"
    "| 4.2.1 | Planificación FAT | Protocolo de pruebas FAT acordado con el cliente | Protocolo FAT firmado | PM + Cliente |\n"
    "| 4.2.2 | Ejecución FAT | Pruebas según protocolo: carga estática, dinámica, transitorios, regeneración | Informe de resultados FAT | Ing. Control + Cliente |\n"
    "| 4.2.3 | Corrección de incidencias FAT | Resolución de no conformidades detectadas | Lista de acciones correctivas cerradas | Ing. Control |\n"
    "| **4.3** | **Pruebas SAT (Site Acceptance Test)** | | | |\n"
    "| 4.3.1 | Planificación SAT | Protocolo SAT acordado con el cliente | Protocolo SAT firmado | PM + Cliente |\n"
    "| 4.3.2 | Ejecución SAT en planta | Pruebas en entorno real del cliente | Informe de resultados SAT | Ing. Control + Cliente |\n"
    "| 4.3.3 | Firma de aceptación SAT | Cierre formal con acta de aceptación | Acta de aceptación SAT firmada | Cliente + Proveedor |\n\n"

    "### EDT-5 · Cierre, Formación y Documentación As-Built *(1 feb — 28 feb 2027 · parcialmente en paralelo con EDT-4)*\n\n"
    "| Código | Paquete / Tarea | Descripción | Entregable | Responsable |\n"
    "|---|---|---|---|---|\n"
    "| **5.1** | **Documentación as-built** | | | |\n"
    "| 5.1.1 | Recopilación de documentación final | Planos definitivos, esquemas actualizados, programas finales | Expediente de documentación as-built | Ing. Eléctrica + Ing. Control |\n"
    "| 5.1.2 | Manual de operación final | Procedimientos operativos actualizados, con valores finales de parámetros | Manual de operación entregado | Ing. Control |\n"
    "| 5.1.3 | Certificados e informes | Certificados de calibración, informes FAT/SAT, declaración de conformidad | Expediente de certificados | Calidad / PM |\n"
    "| **5.2** | **Formación al cliente** | | | |\n"
    "| 5.2.1 | Formación técnica | Operación, mantenimiento básico, resolución de incidencias menores | Registro de formación firmado | Ing. Control |\n"
    "| **5.3** | **Cierre del proyecto** | | | |\n"
    "| 5.3.1 | Cierre administrativo | Facturación final, liquidación de hitos, archivo de documentación | Factura final emitida | PM + Administración |\n"
    "| 5.3.2 | Acta de cierre del proyecto | Firma de cierre entre partes | Acta de cierre firmada | PM + Cliente |\n\n"

    # ── Sección 4 — Matriz de Dependencias ─────────────────────────────────
    "## 4. Matriz de Dependencias entre Paquetes\n\n"
    "```\n"
    "EDT-1 (Ingeniería)\n"
    "  ├─ 1.2 depende de 1.1 (detalle depende de básico)\n"
    "  ├─ 1.3 depende de 1.1 + 1.2\n"
    "  └─ HITO: Aprobación ingeniería (~15 oct) → Pago 20%\n"
    "         │\n"
    "         ▼\n"
    "EDT-2 (Aprovisionamiento y Fabricación)\n"
    "  ├─ 2.1 depende de 1.1.1 + 1.1.2\n"
    "  ├─ 2.2 depende de 1.2.2 + 1.2.4\n"
    "  ├─ 2.3 depende de 1.2.1\n"
    "  ├─ 2.4 depende de 2.1 + 2.2 + 2.3\n"
    "  └─ 2.5 depende de 2.4\n"
    "         │\n"
    "         ▼\n"
    "EDT-3 (Instalación en planta)\n"
    "  ├─ 3.1 depende de 2.5\n"
    "  ├─ 3.2 depende de 3.1 + Layout cliente\n"
    "  ├─ 3.3 depende de 3.2\n"
    "  ├─ 3.4 depende de 3.3\n"
    "  └─ HITO: Instalación completada (~15 ene)\n"
    "         │\n"
    "         ▼\n"
    "EDT-4 (Puesta en marcha, FAT, SAT)\n"
    "  ├─ 4.1 depende de 3.4\n"
    "  ├─ 4.2 depende de 4.1\n"
    "  │   └─ HITO: FAT aprobado (~15 ene) → Pago 30%\n"
    "  └─ 4.3 depende de 4.2\n"
    "         │\n"
    "         ▼\n"
    "EDT-5 (Cierre, formación, as-built)\n"
    "  ├─ 5.1 depende de 4.1 + 4.2 + 4.3\n"
    "  ├─ 5.2 depende de 4.3\n"
    "  └─ 5.3 depende de 5.1 + 5.2\n"
    "      └─ HITO: Cierre SAT + Acta firma (~28 feb) → Pago 10%\n"
    "```\n\n"

    # ── Sección 5 — Horas y Presupuesto ───────────────────────────────────
    "## 5. Estimación de Horas y Recursos\n\n"
    "### 5.1 Horas por EDT y paquete\n\n"
    "| EDT | Paquetes | Horas EDT |\n"
    "|---|---|---|\n"
    "| EDT-1 — Ingeniería | 1.1, 1.2, 1.3 | [PENDIENTE] |\n"
    "| EDT-2 — Aprovisionamiento y Fabricación | 2.1, 2.2, 2.3, 2.4, 2.5 | [PENDIENTE] |\n"
    "| EDT-3 — Instalación en planta | 3.1, 3.2, 3.3, 3.4 | [PENDIENTE] |\n"
    "| EDT-4 — Puesta en marcha + FAT + SAT | 4.1, 4.2, 4.3 | [PENDIENTE] |\n"
    "| EDT-5 — Cierre, formación, as-built | 5.1, 5.2, 5.3 | [PENDIENTE] |\n"
    "| **TOTAL** | | **[PENDIENTE]** |\n\n"
    "> **Nota:** La distribución detallada de horas por EDT se elaborará durante la fase de ingeniería básica.\n\n"

    "### 5.2 Hitos de Pago\n\n"
    "| Hito | Descripción | Fecha objetivo | % | Importe (€) |\n"
    "|---|---|---|---|---|\n"
    "| M1 | Aceptación de la oferta (firma de pedido) | 1 sep 2026 | 30% | 22.306,80 |\n"
    "| M2 | Aceptación de la ingeniería | ~15 oct 2026 | 20% | 14.871,20 |\n"
    "| M3 | Entrega del material en planta del cliente | ~30 nov 2026 | 10% | 7.435,60 |\n"
    "| M4 | Aceptación en fábrica — FAT | ~15 ene 2027 | 30% | 22.306,80 |\n"
    "| M5 | Aceptación final — SAT | ~28 feb 2027 | 10% | 7.435,60 |\n"
    "| | **TOTAL** | | **100%** | **74.356,00** |\n\n"

    "### 5.3 Reserva de Contingencia\n\n"
    "| Concepto | Importe estimado | Justificación |\n"
    "|---|---|---|\n"
    "| Reserva de contingencia del presupuesto | [PENDIENTE] | Fondo para riesgos materializados no contemplados en la línea base. Objetivo: 5-10% del importe total. |\n"
    "| Reserva de gestión | [PENDIENTE] | Margen para trabajo adicional no previsto dentro del alcance, derivado de requests de cambio aprobados. |\n"
    "| **Total reservas** | **[PENDIENTE]** | |\n\n"

    # ── Sección 6 — Gantt ───────────────────────────────────────────────────
    "## 6. Cronograma — Diagrama de Gantt Simplificado\n\n"
    "```\n"
    "LEYENDA: ██ = duración  |  || = hito de pago\n\n"
    "CALENDARIO (semanas del proyecto)\n"
    "Sem:    1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24\n"
    "Fecha               15oct      30nov  1dic    15ene 16ene              28feb\n\n"
    "EDT-1 INGENIERÍA\n"
    "  1.1 Ing. básica           ████████████\n"
    "  1.2 Ing. detalle               ████████████████████\n"
    "  1.3 Docs                            ████           ████\n"
    "  HITO: Aprobación Ing.                   ||\n\n"
    "EDT-2 APROVISIONAMIENTO\n"
    "  2.1 Aprovisionamiento              ████████\n"
    "  2.2 Fabric. armarios                    ████████████████\n"
    "  2.3 Fabric. mecánica                        █████████\n"
    "  2.4 Integración taller                           █████████\n"
    "  2.5 Embalaje / envío                                ███\n"
    "  HITO: Material en planta                               ||\n\n"
    "EDT-3 INSTALACIÓN PLANTA\n"
    "  3.1 Coordinación / infra                 ████\n"
    "  3.2 Instalación mecánica                      ████████████████\n"
    "  3.3 Instalación eléctrica                         ████████████████████\n"
    "  3.4 Verificación pre-comm.                                    ████████\n"
    "  HITO: Instalación completada                                     ||\n\n"
    "EDT-4 PUESTA EN MARCHA / FAT / SAT\n"
    "  4.1 Commissioning                                          ████████████████████\n"
    "  4.2 FAT                                                        ████████████████\n"
    "  HITO: FAT aprobado                                                   ||\n"
    "  4.3 SAT                                                                  ████████████████████\n"
    "  HITO: SAT aprobado + cierre                                               ||\n\n"
    "EDT-5 CIERRE / FORMACIÓN\n"
    "  5.1 Documentación as-built                                         ████████████████████\n"
    "  5.2 Formación                                                              ████████\n"
    "  5.3 Cierre administrativo                                                     ████████████████\n"
    "```\n\n"
    "### Tabla de hitos\n\n"
    "| Hito | Fecha objetivo | EDT responsable | Día proyecto |\n"
    "|---|---|---|---|\n"
    "| Inicio proyecto | 1 sep 2026 | — | Día 0 |\n"
    "| Aprobación ingeniería | 15 oct 2026 | EDT-1 | Día 45 |\n"
    "| Material en planta | 30 nov 2026 | EDT-2 | Día 90 |\n"
    "| Instalación completada / FAT | 15 ene 2027 | EDT-3 / EDT-4 | Día 105 |\n"
    "| SAT aprobado + firma cierre | 28 feb 2027 | EDT-4 / EDT-5 | Día 150 |\n\n"

    # ── Sección 7 — RBS ────────────────────────────────────────────────────
    "## 7. RBS — Registro de Riesgos\n\n"
    "### 7.1 Categorías de nivel 1\n\n"
    "| Código | Categoría |\n"
    "|---|---|\n"
    "| RBS-1 | Riesgos técnicos |\n"
    "| RBS-2 | Riesgos de suministro |\n"
    "| RBS-3 | Riesgos de cliente |\n"
    "| RBS-4 | Riesgos de instalación |\n"
    "| RBS-5 | Riesgos externos |\n\n"

    "### 7.2 Registro detallado de riesgos\n\n"
    "#### RBS-1 · Riesgos técnicos\n\n"
    "| ID | Riesgo | Prob. | Imp. | Score | Mitigación (M) / Contingencia (C) |\n"
    "|---|---|---|---|---|---|\n"
    "| R-1.1 | Error en ingeniería básica que requiere rediseño | Media | Alta | 🟡 15 | M: revisión formal al final de 1.1 / C: addendum de ingeniería |\n"
    "| R-1.2 | Incompatibilidad entre variadores y motor 4Q en bus DC | Baja | Muy alta | 🟡 12 | M: validación técnica con proveedor / C: cambio de modelo |\n"
    "| R-1.3 | Fallo en integración de sensores del cliente (PLC) | Media | Alta | 🟡 15 | M: SLA claro y validación de interfaces / C: provisión de I/O adicionales |\n"
    "| R-1.4 | Parámetros PID de control de bus DC no convergen | Media | Alta | 🟡 15 | M: experiencia previa con bus DC / C: soporte del fabricante |\n"
    "| R-1.5 | Fallo en prueba FAT: no se alcanzan los pares o velocidades requeridos | Baja | Muy alta | 🟡 12 | M: ingeniería conservadora + pruebas parciales en taller / C: redesign |\n"
    "| R-1.6 | Deficiencia en el programa PLC que provoca paradas no deseadas | Media | Alta | 🟡 15 | M: revisión de código + tests en taller / C: horas adicionales (reserva) |\n\n"

    "#### RBS-2 · Riesgos de suministro\n\n"
    "| ID | Riesgo | Prob. | Imp. | Score | Mitigación (M) / Contingencia (C) |\n"
    "|---|---|---|---|---|---|\n"
    "| R-2.1 | Retraso en entrega de variadores o PLC (plazo > 6 sem) | Media | Alta | 🟡 15 | M: pedido inmediato tras aceptación oferta / C: variadores de stock |\n"
    "| R-2.2 | Componente defectuoso recibido (armario, motor) | Baja | Alta | 🟢 8 | M: inspección a recepción / C: RMA + buffer de 1 semana |\n"
    "| R-2.3 | Motor 75 kW 4Q no disponible en plazo | Baja | Muy alta | 🟡 12 | M: confirmación de disponibilidad antes de pedido / C: extensión de plazo |\n"
    "| R-2.4 | Fallo de proveedor subcontractado (mecanizado) | Baja | Media | 🟢 8 | M: 2 proveedores identificados / C: taller interno |\n\n"

    "#### RBS-3 · Riesgos de cliente ⚠️ CRÍTICOS\n\n"
    "| ID | Riesgo | Prob. | Imp. | Score | Mitigación (M) / Contingencia (C) |\n"
    "|---|---|---|---|---|---|\n"
    "| R-3.1 | **Cliente no entrega layout de planta en plazo** | Alta | Muy alta | 🔴 25 | M: recordatorio formal a kick-off / C: reclamar extensión de plazo contractual |\n"
    "| R-3.2 | **Cliente no entrega sensores a tiempo** | Alta | Alta | 🟠 20 | M: SLA escrito con fechas / C: paralizar EDT-4.1.4 |\n"
    "| R-3.3 | Cambio de alcance o requisito durante el proyecto (scope creep) | Media | Alta | 🟡 15 | M: control de cambios formal / C: addendum de oferta |\n"
    "| R-3.4 | Retraso en pago de algún hito | Media | Alta | 🟡 15 | M: facturación inmediata tras cada hito / C: suspensión según cláusula |\n"
    "| R-3.5 | Falta de acceso a planta del cliente en fechas acordadas | Media | Alta | 🟡 15 | M: coordinación anticipada / C: renegociar fecha |\n"
    "| R-3.6 | Cliente no facilita personal de apoyo durante instalación / SAT | Media | Media | 🟡 10 | M: asignar recursos propios suficientes / C: incremento de horas |\n\n"

    "#### RBS-4 · Riesgos de instalación\n\n"
    "| ID | Riesgo | Prob. | Imp. | Score | Mitigación (M) / Contingencia (C) |\n"
    "|---|---|---|---|---|---|\n"
    "| R-4.1 | Daños en equipos durante el transporte | Baja | Alta | 🟢 8 | M: embalaje conforme a especificaciones / C: seguro de transporte |\n"
    "| R-4.2 | Incidente de seguridad durante la instalación en planta | Baja | Muy alta | 🟡 12 | M: briefing de seguridad, EPIs / C: paralización de trabajos |\n"
    "| R-4.3 | No se cumplen los plazos de acceso a la planta del cliente | Media | Alta | 🟡 15 | M: coordinación anticipada / C: renegociar planificación |\n\n"

    "#### RBS-5 · Riesgos externos\n\n"
    "| ID | Riesgo | Prob. | Imp. | Score | Mitigación (M) / Contingencia (C) |\n"
    "|---|---|---|---|---|---|\n"
    "| R-5.1 | Fuerza mayor (catástrofe natural, pandemia, inestabilidad geopolítica) | Baja | Muy alta | 🟡 12 | M: seguro de transporte y montaje / C: plan de continuidad |\n"
    "| R-5.2 | Variación de precios de componentes por inflación o escasez | Media | Media | 🟡 10 | M: pedidos anticipados / C: cláusula de revisión de precios |\n\n"

    "**Escala de valoración:**\n\n"
    "- **Probabilidad (P):** 1 = Muy baja | 2 = Baja | 3 = Media | 4 = Alta | 5 = Muy alta\n"
    "- **Impacto (I):** 1 = Muy bajo | 2 = Bajo | 3 = Medio | 4 = Alto | 5 = Muy alto\n"
    "- **Score:** 🟢 1-8 = Riesgo bajo | 🟡 9-15 = Riesgo medio | 🟠 16-19 = Riesgo alto | 🔴 20-25 = Riesgo crítico\n\n"

    # ── REGLAS ─────────────────────────────────────────────────────────────
    "REGLAS:\n"
    "- Usa los DATOS REALES del charter JSON.\n"
    "- Cuando un dato no esté disponible: [PENDIENTE].\n"
    "- NO inventes datos.\n"
    "- Tablas: usa sintaxis | col1 | col2 | de Markdown.\n"
    "- Desarrolla cada sección con contenido sustantivo.\n"
    "- IMPORTANTE: genera TODAS las secciones sin abreviar ninguna.\n"
    "- Las secciones 8 a 13 también deben generarse completamente.\n"
    "- Cada tabla debe terminar con filas completas, nunca cortadas.\n"
)


def _is_content_complete(content: str) -> bool:
    """Heurística simple: si no termina en doble newline, está truncado."""
    if not content:
        return False
    complete = content.rstrip().endswith('\n\n')
    if not complete:
        last = content.rstrip().split('\n')[-1][:60]
        print(f"[DossierAgent] Contenido incompleto detectado: '{last}'")
    return complete


async def run_dossier_agent(
    charter: dict[str, Any],
    offer_snippet: str,
    timeout: float = TIMEOUT,
) -> str:
    charter_json = json.dumps(charter, ensure_ascii=False, indent=2)

    # Sustituir placeholders en el SYSTEM_PROMPT
    project_name = charter.get("project_name", "Banco de ensayos")
    prompt = SYSTEM_PROMPT.format(
        project_name=project_name,
        project_code=charter.get("project_code", "PRJ-O2024-001"),
        offer_ref=charter.get("offer_reference", "O-2024-001-ANON"),
        issue_date="agosto de 2026",
        client=charter.get("client_name", "CLIENTE INDUSTRIAL, S.A."),
        provider=charter.get("provider_name", "PROVEEDOR TÉCNICO, S.L."),
        start_date=charter.get("start_date", "1 de septiembre de 2026"),
        end_date=charter.get("end_date", "28 de febrero de 2027"),
        duration=charter.get("duration", "6 meses"),
        budget=charter.get("budget", "€74.356,00"),
        objectives=charter.get("objectives", "[PENDIENTE]"),
        deliverables=charter.get("deliverables", "[PENDIENTE]"),
        executive_summary=charter.get("executive_summary", ""),
    )

    # ── Pasada 1 ───────────────────────────────────────────────────────────
    agent = Agent(
        name="DossierAgent",
        model=build_llm_model(),
        instructions=prompt,
        description="Genera Dossier de Gestión de Proyecto",
    )

    prompt_pass1 = (
        "CHARTER DEL PROYECTO (JSON):\n\n"
        f"{charter_json}\n\n"
        "---\n\n"
        f"Fragmento de la oferta:\n{offer_snippet[:2000]}\n\n"
        "---\n\n"
        "Genera el DOSSIER DE GESTIÓN DE PROYECTO completo en Markdown "
        "(secciones 1-13; NO incluyas Charter ni Kick-off). "
        "Genera TODAS las secciones sin abreviar ninguna. "
        "Las tablas deben estar completas, sin filas cortadas. "
        "Sigue EXACTAMENTE el formato de la EDT con tablas por fase (EDT-1 a EDT-5), "
        "el Gantt con bloques ██, y el RBS con emojis de color."
    )

    content = await _call_agent(agent, prompt_pass1, timeout=timeout, max_tokens=35000)

    # ── Pasada 2 ───────────────────────────────────────────────────────────
    if not _is_content_complete(content):
        print("[DossierAgent] Pasada 2: contenido truncado detectado — completando...")
        last_section_match = None
        for match in re.finditer(r"(## \d+\.[^\n]+)", content):
            last_section_match = match
        last_section_title = last_section_match.group(1) if last_section_match else "sección final"

        close_prompt = (
            "CHARTER DEL PROYECTO (JSON):\n\n"
            f"{charter_json}\n\n"
            "---\n\n"
            f"Fragmento de la oferta:\n{offer_snippet[:1500]}\n\n"
            "---\n\n"
            "DOCUMENTO ACTUAL (INCOMPLETO):\n\n"
            f"{content}\n\n"
            "---\n\n"
            f"INSTRUCCIONES:\n"
            f"El documento anterior está truncado a mitad de la sección '{last_section_title}'.\n"
            "Completa ÚNICAMENTE esa sección — no reescribas secciones anteriores.\n"
            "Devuelve el contenido de AMPLIACIÓN de la sección incompleta.\n"
            "Si hay una tabla a medio hacer, complétala completamente.\n"
            "Añade también todas las subsecciones restantes de esa sección.\n"
        )
        closed = await _call_agent(agent, close_prompt, timeout=timeout, max_tokens=20000)
        content += "\n\n" + closed
    else:
        print("[DossierAgent] Documento completo — sin segunda pasada")

    return content
