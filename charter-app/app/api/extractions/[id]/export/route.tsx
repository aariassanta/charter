import { NextRequest, NextResponse } from "next/server";
import { getDb, getSessionUser } from "@/lib/db";

function parseJsonField<T>(value: unknown, fallback: T): T {
  if (typeof value === "string") {
    try { return JSON.parse(value) as T; } catch { return fallback; }
  }
  if (Array.isArray(value) || typeof value === "object") return value as T;
  return fallback;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  const row = db.prepare("SELECT * FROM extractions WHERE id = ? AND user_id = ?").get(parseInt(id), user.id) as Record<string, unknown> | undefined;
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const fmt = req.nextUrl.searchParams.get("format") ?? "json";

  if (fmt === "pdf") {
    const workerUrl = `http://charter-worker:8001/extractions/${id}/pdf`;
    const workerRes = await fetch(workerUrl, { headers: { Host: "charter-worker" } });
    if (!workerRes.ok) return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
    const pdfBuffer = await workerRes.arrayBuffer();
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${String(row.project_name ?? "charter")}.pdf"`,
      },
    });
  }

  const milestones = parseJsonField<Array<{name: string; due_date?: string; type?: string; description?: string}>>(row.milestones, []);
  const tasks = parseJsonField<Array<{name: string; duration_days?: number; phase?: string; start_week?: string; dependencies?: string[]; description?: string}>>(row.tasks, []);
  const deliverables = parseJsonField<string[]>(row.deliverables, []);
  const stakeholders = parseJsonField<Array<{name: string; role?: string; organization?: string; email?: string; engagement?: string}>>(row.stakeholders, []);
  const risks = parseJsonField<Array<{name: string; probability?: string; impact?: string; mitigation?: string}>>(row.risks, []);
  const assumptions = parseJsonField<string[]>(row.assumptions, []);
  const constraints = parseJsonField<string[]>(row.constraints, []);
  const technical_specs = parseJsonField<Array<{category?: string; item?: string; quantity?: string; brand_model?: string}>>(row.technical_specs, []);
  const specs = parseJsonField<string[]>(row.specs, []);

  if (fmt === "markdown") {
    let md = `# ${row.project_name}\n\n`;
    if (row.offer_summary) md += `## Resumen\n${row.offer_summary}\n\n`;
    if (row.total_budget) md += `## Presupuesto\n${row.total_budget}\n\n`;
    if (row.start_date || row.end_date) {
      md += `## Fechas\n- Inicio: ${row.start_date ?? "—"}\n- Fin: ${row.end_date ?? "—"}\n\n`;
    }
    if (milestones.length) {
      md += `## Hitos\n`;
      for (const m of milestones) {
        md += `- [ ] **${m.name}**${m.due_date ? ` — ${m.due_date}` : ""}${m.type ? ` [${m.type}]` : ""}\n`;
        if (m.description) md += `  ${m.description}\n`;
      }
      md += "\n";
    }
    if (technical_specs.length) {
      md += `## Especificaciones Técnicas\n`;
      for (const s of technical_specs) {
        const brand = s.brand_model ? ` (${s.brand_model})` : "";
        const qty = s.quantity ? ` — ${s.quantity}` : "";
        md += `- **${s.category ?? "Otro"}**: ${s.item}${brand}${qty}\n`;
      }
      md += "\n";
    }
    if (risks.length) {
      md += `## Riesgos\n`;
      for (const r of risks) {
        md += `- **${r.name}** [${r.probability ?? "?"}/${r.impact ?? "?"}]\n  ${r.mitigation ?? ""}\n`;
      }
      md += "\n";
    }
    if (assumptions.length) {
      md += `## Suposiciones\n`;
      for (const a of assumptions) md += `- ${a}\n`;
      md += "\n";
    }
    if (constraints.length) {
      md += `## Restricciones\n`;
      for (const c of constraints) md += `- ${c}\n`;
      md += "\n";
    }
    if (tasks.length) {
      md += `## Tareas\n`;
      for (const t of tasks) {
        const deps = t.dependencies?.length ? ` (deps: ${t.dependencies.join(", ")})` : "";
        const phase = t.phase ? ` [${t.phase}]` : "";
        const week = t.start_week ? ` — ${t.start_week}` : "";
        md += `- [ ] ${t.name}${phase}${week}${deps}\n`;
        if (t.description) md += `  ${t.description}\n`;
        if (t.duration_days) md += `  ${t.duration_days} días\n`;
      }
      md += "\n";
    }
    if (deliverables.length) {
      md += `## Entregables\n`;
      for (const d of deliverables) md += `- ${d}\n`;
      md += "\n";
    }
    if (stakeholders.length) {
      md += `## Stakeholders\n`;
      for (const s of stakeholders) {
        const org = s.organization ? ` (${s.organization})` : "";
        const eng = s.engagement ? ` [${s.engagement}]` : "";
        md += `- **${s.name}**${org} — ${s.role ?? ""}${eng}\n`;
      }
      md += "\n";
    }
    return new NextResponse(md, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${row.project_name}.md"`,
      },
    });
  }

  const json = {
    project_name: row.project_name,
    offer_summary: row.offer_summary,
    start_date: row.start_date,
    end_date: row.end_date,
    total_budget: row.total_budget,
    milestones,
    tasks,
    specs,
    deliverables,
    stakeholders,
    risks,
    assumptions,
    constraints,
    technical_specs,
    field_confidence: parseJsonField(row.field_confidence, null),
    created_at: row.created_at,
  };

  return NextResponse.json(json, {
    headers: {
      "Content-Disposition": `attachment; filename="${row.project_name}.json"`,
    },
  });
}
