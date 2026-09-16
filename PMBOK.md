# PMBOK 8ª Edición — Alineación con Charter

## Resumen

Charter implementa un subconjunto enfocado de prácticas del **PMBOK 8ª Edición (PMI, 2025)**,
adaptado al contexto de **proyectos industriales de ingeniería** (banco de ensayos, retrofit,
instalación, puesta en marcha). El objetivo no es cubrir todos los dominios del PMBOK, sino
automatizar las prácticas de **iniciación y planificación** que representan el mayor esfuerzo
manual en una oficina PMO industrial.

---

## Mapa de prácticas vs dominios PMBOK 8

```
Dominio PMBOK 8ª                    Agente Charter
────────────────────────────────────────────────────
  1. Proyecto individuales      ←  [contexto]
  2. Desarrollo del negocio     ←  ExtractorAgent
  3. Planificación              ←  DossierAgent
  4. Trabajo del proyecto        ←  KickoffAgent
  5. Entrega del proyecto        ←  DossierAgent (entregables)
  6. Medición del proyecto      ←  (futuro: reporting)
  7. Nexo de cierre              ←  KickoffAgent (cierre operativo)
```

---

## 2 · Desarrollo del Negocio

### Práctica: Análisis de propuesta de valor

**Agente:** `ExtractorAgent`

**Implementación:**
El `ExtractorAgent` analiza el texto de la oferta comercial y extrae:

- **Caso de negocio implícito:** qué problema resuelve el proyecto para el cliente
- **Resumen de oferta:** 2-3 frases que articulan el alcance
- **Criterios de éxito:** extraídos directamente de las condiciones de aceptación
- **Supuestos y restricciones:** identificados del texto

**Salida →** `charter.project_name`, `charter.offer_summary`, `charter.success_criteria`,
`charter.assumptions`, `charter.constraints`

**PMBOK 8 referencia:** Section 2.2 "Business Case" y 2.3 "Benefits Management"

---

## 3 · Planificación

### Práctica: EDT / WBS

**Agente:** `DossierAgent` — Sección 3

**Implementación:**
La EDT se genera como tabla jerárquica de 3 niveles:

```
Nivel 1  EDT-X     → Fase (ej. EDT-1 Ingeniería)
Nivel 2  EDT-X.X   → Paquete de trabajo (ej. EDT-1.1 Ingeniería básica)
Nivel 3  EDT-X.X.X → Tarea (ej. EDT-1.1.1 Mecánica básica)
```

Cada fila incluye: código, nombre, descripción, entregable y responsable.

La EDT del ejemplo TEST_BENCH_EMBRAGUES contiene:
- **EDT-1** Ingeniería (básica + detalle + gestión documental)
- **EDT-2** Aprovisionamiento y Fabricación
- **EDT-3** Instalación en planta del cliente
- **EDT-4** Puesta en marcha, FAT y SAT
- **EDT-5** Cierre, formación y documentación as-built

**PMBOK 8 referencia:** Section 3.4 "Scope Baseline" → WBS

---

### Práctica: Cronograma del proyecto

**Agente:** `DossierAgent` — Sección 6 + generación de Gantt visual

**Implementación:**
El cronograma se genera a partir de:
1. Fechas de inicio/fin extraídas de la oferta (`start_date`, `end_date`)
2. Hitos con fechas explícitas mencionados en la oferta
3. Duraciones estimadas por fase (basadas en el texto o en_defaults coherentes)

El **diagrama de Gantt** se exporta como HTML/SVG editorial (dark-first, conmutable a light).
Incluye:
- Fases como swimlanes horizontales
- Barras de duración por tarea
- Hitos como diamantes
- Hitos de pago con importe
- Línea de "hoy" automática
- Tooltip con descripción de cada tarea

**PMBOK 8 referencia:** Section 3.5 "Project Schedule" → Gantt chart

---

### Práctica: Presupuesto y hitos de pago

**Agente:** `ExtractorAgent` + `DossierAgent` — Sección 5

**Implementación — Validación de presupuesto:**
El `total_budget` se extrae de la oferta y se **valida** contra el texto fuente:
- Se buscan todos los importes monetarios con regex (€, $, EUR, USD, GBP)
- Se comparan con el importe extraído
- Si no hay coincidencia literal → `total_budget = null` (se marca como no disponible)
- **No se estiman ni inventan importes** (principio anti-alucinación)

**Hitos de pago:**
Se extraen de las condiciones de pago declaradas en la oferta:
- Porcentaje por hito
- Importe por hito
- Fecha objetivo de cada hito
- Hitos típicos industriales: Firma de pedido, Aprobación ingeniería, Entrega material,
  FAT aprobado, SAT firmado

**PMBOK 8 referencia:** Section 3.6 "Financial Baseline" y 3.8 "Procurement Strategy"

---

### Práctica: Gestión de riesgos

**Agente:** `DossierAgent` — Sección 10 (Riesgos)

**Implementación:**
Los riesgos se extraen de la oferta y se clasifican en:
- **Riesgos técnicos:** integración, compatibilidad, calibración
- **Riesgos de planificación:** retrasos en aprovisionamiento, dependencia de terceros
- **Riesgos externos:** permisos, infraestructura del cliente
- **Riesgos de scope creep:** cambios en el alcance durante ejecución

Para cada riesgo: descripción, probabilidad (Alta/Media/Baja), impacto (Alto/Medio/Bajo),
y estrategia de mitigación.

**PMBOK 8 referencia:** Section 3.7 "Risk Management Plan"

---

### Práctica: Partes interesadas (Stakeholders)

**Agente:** `ExtractorAgent` + `DossierAgent` — Sección 7

**Implementación:**
Se identifican las partes interesadas del texto de la oferta:
- **Sponsor del proyecto:** quien firma la oferta por el proveedor
- **Cliente:** empresa destinataria
- **Equipo del proyecto:** roles mencionados (PM, Ing. Eléctrica, Ing. Control, etc.)
- **Terceros:** fabricante del componente bajo prueba, subcontratistas

Se genera una tabla RACI: Responsible, Accountable, Consulted, Informed por cada paquete EDT.

**PMBOK 8 referencia:** Section 3.9 "Stakeholder Engagement"

---

## 4 · Iniciación

### Práctica: Acta de Constitución del Proyecto (Project Charter)

**Agente:** `CharterAgent`

**Implementación:**
El `CharterAgent` genera un documento standalone en formato formal, independiente del dossier,
que incluye:

1. **Información del proyecto:** nombre, código, referencia de oferta, versión
2. **Partes y roles:** sponsor, PM, cliente, fabricante
3. **Resumen del proyecto:** resumen ejecutivo de 2-3 párrafos
4. **Alcance de alto nivel:** scope in / scope out
5. **Objetivos:** medibles, alcanzables, relevantes, con plazo definido
6. **Criterios de éxito:** condiciones de aceptación del proyecto
7. **Restricciones:** presupuesto, plazo, normativa, calidad
8. **Supuestos:** premisas asumidas para la planificación
9. **Riesgos de alto nivel:** top-5 riesgos identificados
10. **Hitos principales:** fechas clave del proyecto
11. **Hitos de pago:** condiciones financieras vinculadas a entregas
12. **Autorización:** nombre, cargo, fecha, firma del sponsor

**PMBOK 8 referencia:** Section 4.2 "Project Charter" y Section 4.3 "Assumptions Log"

---

## 7 · Entrega del proyecto

### Práctica: Kick-off meeting

**Agente:** `KickoffAgent`

**Implementación:**
Genera una agenda estructurada de reunión de kick-off:
1. Bienvenida y presentación del equipo
2. Repaso del Project Charter (objetivos, alcance, criterios de éxito)
3. Revisión de la EDT y cronograma de alto nivel
4. Roles y responsabilidades (RACI)
5. Hitos de pago y condiciones comerciales
6. Gestión de cambios — proceso de request
7. Comunicación — canales y frecuencia de reuniones
8. Riesgos identificados y plan de respuesta
9. Q&A y próximos pasos
10. Firma del acta

**PMBOK 8 referencia:** Section 7.2 "Team Collaboration" y Section 7.4 "Stakeholder Engagement"

---

## Principios de calidad aplicados

### Anti-alucinación en datos financieros

```
ExtractorAgent
  │
  ├─ _extract_amounts_from_text()  → busca importes literales en la oferta
  ├─ _normalize_amount()            → estandariza formato (punto/coma/símbolo)
  └─ _sanitize_budget()             → valida: si no está en el texto → null
```

Este mecanismo garantiza que:
- El `total_budget` en el charter **solo aparece si está literalmente en la oferta**
- No se estiman presupuestos
- Se emite warning en logs si el importe no se valida

**PMBOK 8 referencia:** Section 8.3 "Quality Management" — precisión en datos

---

## Áreas de mejora y trabajo futuro

| Área | Prioridad | Descripción |
|---|---|---|
| **Reporting de seguimiento** | Alta | Dashboard de avance vs planificado (PMBOK 8 Dominio 5) |
| **Gestión de cambios** | Alta | Flujo formal de request de cambio vinculado al charter |
| **Lessons learned** | Media | Recopilación de lecciones al cierre (PMBOK 8 Dominio 6) |
| **Integración con ERP** | Media | Vincular hitos de pago con sistema de facturación |
| **Exportación a MS Project** | Baja | Generar .mpp o .xlsx para MS Project |
| **Validación de fechas** | Media | Verificar coherencia de fechas entre start/end y hitos |
