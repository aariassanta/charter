import { NextRequest, NextResponse } from "next/server";
import { getDb, getSessionUser } from "@/lib/db";

const WORKER_URL = process.env.CHARTER_WORKER_URL ?? "http://localhost:8001";
// Timeout para la llamada al worker: cubre ejecuciones largas (8-20 min).
// Next.js default route timeout es ~60 s; sobredimensionamos para no cortar
// una extracción que está corriendo correctamente.
const WORKER_TIMEOUT_MS = 90 * 1000; // 90 s — tiempo para que el worker acepte el job; el keepalive mantiene el request vivo en background

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();

  // ── 1. Verificar límites del plan ──────────────────────────────────────────
  const userRow = db.prepare("SELECT plan, role FROM users WHERE id = ?").get(user.id) as { plan: string; role: string };
  if (userRow.role !== "admin" && userRow.plan === "free") {
    const count = db.prepare(
      "SELECT COUNT(*) as c FROM extractions WHERE user_id = ? AND created_at > datetime('now', '-30 days')"
    ).get(user.id) as { c: number };
    if (count.c >= 3) {
      return NextResponse.json(
        { error: "Límite free alcanzado (3 charters/mes). Actualiza a Pro para charters ilimitados." },
        { status: 403 }
      );
    }
  }

  // ── 2. Validar archivo ──────────────────────────────────────────────────────
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const projectName = (formData.get("project_name") as string) || "Nuevo proyecto";

  if (!file) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Solo PDF o DOCX" }, { status: 400 });
  }

  // ── 3. Crear registro en BD con status=processing ──────────────────────────
  const insertResult = db.prepare(`
    INSERT INTO extractions (user_id, project_name, status, offer_text, created_at)
    VALUES (?, ?, 'processing', '', datetime('now'))
  `).run(user.id, projectName) as { lastInsertRowid: number };
  const extractionId = insertResult.lastInsertRowid;

  // ── 4. Extraer texto del archivo (delegado al worker) ──────────────────────
  const workerForm = new FormData();
  workerForm.set("file", file, file.name);
  workerForm.set("project_name", projectName);

  let offerText = "";
  try {
    const extractRes = await fetch(`${WORKER_URL}/extractions`, {
      method: "POST",
      body: workerForm,
      signal: AbortSignal.timeout(30000),
    });
    if (extractRes.ok) {
      const data = (await extractRes.json()) as { offer_text: string };
      offerText = data.offer_text;
      db.prepare("UPDATE extractions SET offer_text = ? WHERE id = ?").run(offerText, extractionId);
    } else {
      // Fallback offline: lectura cruda del archivo
      const bytes = await file.arrayBuffer();
      offerText = Buffer.from(bytes).toString("utf-8").slice(0, 50000);
      db.prepare("UPDATE extractions SET offer_text = ? WHERE id = ?").run(offerText.slice(0, 20000), extractionId);
    }
  } catch {
    // Worker offline — fallback local
    const bytes = await file.arrayBuffer();
    offerText = Buffer.from(bytes).toString("utf-8").slice(0, 50000);
    db.prepare("UPDATE extractions SET offer_text = ? WHERE id = ?").run(offerText.slice(0, 20000), extractionId);
  }

  if (!offerText || offerText.length < 100) {
    db.prepare("UPDATE extractions SET status = 'failed', error = ?, updated_at = datetime('now') WHERE id = ?")
      .run("No se pudo extraer texto del archivo", extractionId);
    return NextResponse.json({ id: extractionId, status: "created" });
  }

  // ── 5. Lanzar extracción completa (POST /documents) y retornar ────────────
  // El worker escribirá el resultado en charter-app.db al completar.
  // Usamos keepalive para que el fetch sobreviva al close del request.
  fetch(`${WORKER_URL}/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      offer_text: offerText,
      extraction_id: String(extractionId),
      timeout_extractor: 600,
      timeout_dossier: 600,
    }),
    keepalive: true,
    signal: AbortSignal.timeout(WORKER_TIMEOUT_MS),
  }).catch((err) => {
    // El worker puede estar corriendo aunque el fetch falle (timeout de red).
    // No marcamos failed aquí — el worker actualizará la BD cuando termine.
    // Solo log para debugging.
    console.warn(`[create] fetch to worker returned early (id=${extractionId}): ${err.message}`);
  });

  // Retornamos inmediatamente. El polling del frontend detectará
  // el cambio a status=completed|failed cuando el worker termine.
  return NextResponse.json({ id: extractionId, status: "created" });
}
