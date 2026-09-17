import { NextRequest, NextResponse } from "next/server";
import { getDb, getSessionUser } from "@/lib/db";

interface SectionScore {
  section: string;
  score: number;
  missing: string[];
  tips: string[];
}

interface ImprovementReport {
  overall_score: number;
  section_scores: SectionScore[];
  missing_fields: string[];
  tips: string[];
  reasoning: string;
  generated_at: string;
}

// Simple in-memory rate limiter (5 calls per user per hour)
const rateLimit = new Map<number, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function checkRateLimit(userId: number): boolean {
  const now = Date.now();
  const userCalls = rateLimit.get(userId) ?? [];
  const recent = userCalls.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return false;
  recent.push(now);
  rateLimit.set(userId, recent);
  return true;
}

const SECTION_WEIGHTS: Record<string, number> = {
  resumen: 10,
  fechas: 15,
  presupuesto: 15,
  stakeholders: 10,
  especificaciones_tecnicas: 15,
  tareas: 10,
  riesgos: 15,
  entregables: 10,
};

const SECTION_LABELS: Record<string, string> = {
  resumen: "Resumen ejecutivo",
  fechas: "Fechas e hitos",
  presupuesto: "Presupuesto y contrato",
  stakeholders: "Stakeholders",
  especificaciones_tecnicas: "Especificaciones técnicas",
  tareas: "Tareas y WBS",
  riesgos: "Riesgos y suposiciones",
  entregables: "Entregables y criterios",
};

// Heuristic scoring: based on field presence and content quality
function computeSectionScores(row: Record<string, unknown>): SectionScore[] {
  const scores: SectionScore[] = [];

  // resumen
  const summary = String(row.offer_summary ?? "");
  scores.push({
    section: "resumen",
    score: summary.length > 200 ? 1 : summary.length > 80 ? 0.6 : summary.length > 0 ? 0.3 : 0,
    missing: summary.length < 200 ? ["Resumen ejecutivo detallado (mínimo 2 frases con alcance, objetivo y entregable)"] : [],
    tips: summary.length < 200 ? ["Añade un párrafo resumen con: objetivo del proyecto, alcance, entregable clave, valor para el cliente"] : [],
  });

  // fechas
  const startDate = row.start_date;
  const endDate = row.end_date;
  const milestones = parseJsonField<unknown[]>(row.milestones, []);
  const datesScore = (startDate && endDate ? 0.5 : 0) + (milestones.length >= 3 ? 0.5 : milestones.length > 0 ? 0.25 : 0);
  scores.push({
    section: "fechas",
    score: datesScore,
    missing: !startDate ? ["Fecha de inicio del proyecto"] : [],
    tips: !startDate ? ["Especifica la fecha de inicio en formato YYYY-MM-DD"] : milestones.length < 3 ? ["Añade al menos 3 hitos clave con fechas (kick-off, hitos contractuales, entrega final)"] : [],
  });

  // presupuesto
  const budget = row.total_budget;
  const contract = parseJsonField<Record<string, unknown>>(row.contract_json, {});
  const budgetScore = budget ? (Object.keys(contract).length > 2 ? 1 : 0.6) : 0;
  scores.push({
    section: "presupuesto",
    score: budgetScore,
    missing: !budget ? ["Presupuesto total con moneda"] : [],
    tips: !budget ? ["Incluye el precio total de la oferta con su moneda (ej: '€74.356,00' o '74.356 EUR')"] : [],
  });

  // stakeholders
  const stakeholders = parseJsonField<Array<{name: string; email?: string}>>(row.stakeholders, []);
  const hasEmail = stakeholders.some(s => s.email && s.email !== "null" && !s.email.includes("ejemplo"));
  const stakeholdersScore = stakeholders.length >= 2 && hasEmail ? 1 : stakeholders.length > 0 ? 0.5 : 0;
  scores.push({
    section: "stakeholders",
    score: stakeholdersScore,
    missing: stakeholders.length === 0 ? ["Lista de stakeholders con roles"] : !hasEmail ? ["Emails reales de los stakeholders"] : [],
    tips: stakeholders.length === 0 ? ["Lista todos los contactos mencionados: cliente, fabricante, equipo técnico, con sus roles"] : !hasEmail ? ["Incluye los emails reales de los stakeholders (no placeholders como 'ejemplo@...')"] : [],
  });

  // especificaciones tecnicas
  const specs = parseJsonField<Array<{item: string; brand_model?: string}>>(row.technical_specs, []);
  const specsWithBrand = specs.filter(s => s.brand_model && s.brand_model !== "No especificado").length;
  const specsScore = specs.length >= 5 ? (specsWithBrand / specs.length > 0.5 ? 1 : 0.6) : specs.length > 0 ? 0.4 : 0;
  scores.push({
    section: "especificaciones_tecnicas",
    score: specsScore,
    missing: specs.length < 3 ? ["Listado detallado de componentes técnicos (armarios, motores, PLC, variadores, sensores)"] : [],
    tips: specs.length < 3 ? ["Lista todos los componentes mencionados en la sección técnica con cantidades y modelos"] : specsWithBrand < specs.length / 2 ? ["Especifica marcas y modelos reales de los componentes (no 'No especificado')"] : [],
  });

  // tareas
  const tasks = parseJsonField<Array<{duration_days?: number; phase?: string; dependencies?: string[]}>>(row.tasks, []);
  const tasksWithDetail = tasks.filter(t => t.duration_days && t.phase).length;
  const tasksScore = tasks.length >= 5 && tasksWithDetail === tasks.length ? 1 : tasks.length > 0 ? 0.5 : 0;
  scores.push({
    section: "tareas",
    score: tasksScore,
    missing: tasks.length < 3 ? ["WBS con tareas específicas por fase"] : [],
    tips: tasks.length < 3 ? ["Divide el proyecto en tareas específicas (verbo + objeto) por fase: ingeniería, fabricación, instalación, puesta en marcha"] : tasksWithDetail < tasks.length ? ["Añade duración estimada y fase a cada tarea"] : [],
  });

  // riesgos
  const risks = parseJsonField<Array<{mitigation?: string}>>(row.risks, []);
  const risksWithMitigation = risks.filter(r => r.mitigation).length;
  const risksScore = risks.length >= 3 && risksWithMitigation === risks.length ? 1 : risks.length > 0 ? 0.6 : 0;
  scores.push({
    section: "riesgos",
    score: risksScore,
    missing: risks.length === 0 ? ["Análisis de riesgos con probabilidad, impacto y mitigación"] : risksWithMitigation < risks.length ? ["Mitigación concreta para cada riesgo"] : [],
    tips: risks.length === 0 ? ["Añade sección de riesgos identificados: retrasos, dependencias externas, suministros críticos"] : risksWithMitigation < risks.length ? ["Para cada riesgo, define acción específica de mitigación (no dejes vacío)"] : [],
  });

  // entregables + criterios
  const deliverables = parseJsonField<string[]>(row.deliverables, []);
  const successCriteria = parseJsonField<string[]>(row.success_criteria, []);
  const validationTests = parseJsonField<string[]>(row.validation_tests, []);
  const entScore = deliverables.length >= 3 ? (successCriteria.length >= 2 ? 1 : 0.6) : deliverables.length > 0 ? 0.4 : 0;
  scores.push({
    section: "entregables",
    score: entScore,
    missing: deliverables.length < 3 ? ["Lista de entregables concretos"] : successCriteria.length === 0 ? ["Criterios de éxito medibles"] : [],
    tips: deliverables.length < 3 ? ["Lista los entregables del proyecto (documentación, equipos, servicios) con nombres específicos"] : successCriteria.length === 0 ? ["Define al menos 2 criterios de éxito medibles (ej: 'FAT firmada por cliente', 'SAT completada en plazo')"] : validationTests.length === 0 ? ["Añade pruebas de validación: FAT, SAT, certificaciones CE, calibraciones"] : [],
  });

  return scores;
}

function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try { return JSON.parse(value) as T; } catch { return fallback; }
  }
  if (Array.isArray(value)) return value as T;
  if (typeof value === "object") return value as T;
  return fallback;
}

function computeOverallScore(sections: SectionScore[]): number {
  const totalWeight = Object.values(SECTION_WEIGHTS).reduce((a, b) => a + b, 0);
  const weightedSum = sections.reduce((acc, s) => {
    const weight = SECTION_WEIGHTS[s.section] ?? 0;
    return acc + weight * s.score;
  }, 0);
  return Math.round((weightedSum / totalWeight) * 100);
}

function generateReasoning(sections: SectionScore[], overall: number): string {
  const weak = sections.filter(s => s.score < 0.5).map(s => SECTION_LABELS[s.section]);
  const strong = sections.filter(s => s.score >= 0.8).map(s => SECTION_LABELS[s.section]);

  const parts: string[] = [];
  parts.push(`Confianza global: ${overall}/100.`);
  if (strong.length > 0) {
    parts.push(`Puntos fuertes: ${strong.join(", ")}.`);
  }
  if (weak.length > 0) {
    parts.push(`Áreas de mejora: ${weak.join(", ")}.`);
  }
  if (overall < 60) {
    parts.push("Recomendación: revisar el documento original y completar la información faltante antes de generar el charter.");
  } else if (overall < 80) {
    parts.push("Recomendación: el charter es utilizable pero podría afinarse ampliando detalles técnicos y contractuales.");
  } else {
    parts.push("Recomendación: el charter tiene alta fidelidad respecto al documento original.");
  }
  return parts.join(" ");
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = getDb();

  // Verify ownership
  const row = db.prepare("SELECT * FROM extractions WHERE id = ? AND user_id = ?").get(parseInt(id), user.id) as Record<string, unknown> | undefined;
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Rate limit check
  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: "Has alcanzado el límite de 5 informes por hora. Intenta más tarde." },
      { status: 429 }
    );
  }

  // Check cache (improvement already generated for this version)
  if (row.improvement_tips && row.improvement_reasoning && row.improvement_generated_at) {
    try {
      const cached: ImprovementReport = {
        overall_score: Number(row.confidence_overall ?? 0),
        section_scores: JSON.parse(String(row.improvement_tips)) as SectionScore[],
        missing_fields: [],
        tips: (JSON.parse(String(row.improvement_tips)) as SectionScore[]).flatMap(s => s.tips),
        reasoning: String(row.improvement_reasoning),
        generated_at: String(row.improvement_generated_at ?? ""),
      };
      return NextResponse.json(cached);
    } catch {
      // fall through to regeneration
    }
  }

  // Compute section scores heuristically
  const sectionScores = computeSectionScores(row);
  const overallScore = Number(row.confidence_overall) || computeOverallScore(sectionScores);
  const reasoning = generateReasoning(sectionScores, overallScore);

  const report: ImprovementReport = {
    overall_score: overallScore,
    section_scores: sectionScores,
    missing_fields: sectionScores.flatMap(s => s.missing),
    tips: sectionScores.flatMap(s => s.tips),
    reasoning,
    generated_at: new Date().toISOString(),
  };

  // Persist for next call
  db.prepare(
    `UPDATE extractions SET
       improvement_tips = ?,
       improvement_reasoning = ?,
       improvement_generated_at = ?
     WHERE id = ?`
  ).run(JSON.stringify(sectionScores), reasoning, report.generated_at, parseInt(id));

  return NextResponse.json(report);
}
