import { NextRequest, NextResponse } from "next/server";
import { getDb, getSessionUser } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  const row = db.prepare("SELECT * FROM extractions WHERE id = ? AND user_id = ?").get(parseInt(id), user.id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const allowedFields = ["offer_summary", "start_date", "end_date", "milestones", "tasks", "deliverables", "stakeholders"];
  const sets: string[] = [];
  const args: (string | number)[] = [];

  for (const field of allowedFields) {
    if (field in body) {
      sets.push(`${field} = ?`);
      args.push(typeof body[field] === "object" ? JSON.stringify(body[field]) : body[field]);
    }
  }

  if (sets.length) {
    sets.push("updated_at = datetime('now')");
    args.push(parseInt(id));
    db.prepare(`UPDATE extractions SET ${sets.join(", ")} WHERE id = ?`).run(...args);
  }

  const updated = db.prepare("SELECT * FROM extractions WHERE id = ?").get(parseInt(id));
  return NextResponse.json(updated);
}
