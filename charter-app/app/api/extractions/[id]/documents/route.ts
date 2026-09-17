import { NextRequest, NextResponse } from "next/server";
import { getDb, getSessionUser } from "@/lib/db";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL ?? "http://localhost:8001";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  const row = db.prepare("SELECT * FROM extractions WHERE id = ? AND user_id = ?").get(parseInt(id), user.id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Proxy to worker: GET /extractions/{extraction_id}/documents
  const workerRes = await fetch(`${WORKER_URL}/extractions/${id}/documents`, {
    signal: AbortSignal.timeout(10_000),
  });

  if (!workerRes.ok) {
    const err = await workerRes.text().catch(() => "Failed to reach worker");
    return NextResponse.json({ error: err }, { status: workerRes.status });
  }

  return NextResponse.json(await workerRes.json());
}
