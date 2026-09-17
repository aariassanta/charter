import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/users — list all users with stats
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const db = getDb();
  const users = db
    .prepare(
      `SELECT u.id, u.email, u.role, u.status, u.company, u.created_at,
              (SELECT COUNT(*) FROM extractions WHERE user_id = u.id) AS extraction_count
       FROM users u
       ORDER BY u.created_at DESC`
    )
    .all();

  const stats = db
    .prepare(
      `SELECT
         COUNT(*) AS total_users,
         SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) AS active_users,
         (SELECT COUNT(*) FROM extractions) AS total_extractions,
         (SELECT AVG(confidence_overall) FROM extractions WHERE confidence_overall IS NOT NULL) AS avg_confidence
       FROM users`
    )
    .get();

  return NextResponse.json({ users, stats });
}

// PATCH /api/admin/users — toggle user status (enable/disable)
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const userId = Number(body.id);
    const status = String(body.status);

    if (!Number.isInteger(userId)) {
      return NextResponse.json({ error: "id inválido" }, { status: 400 });
    }
    if (!["active", "disabled"].includes(status)) {
      return NextResponse.json({ error: "status debe ser 'active' o 'disabled'" }, { status: 400 });
    }

    if (userId === auth.user.id && status === "disabled") {
      return NextResponse.json(
        { error: "No puedes deshabilitar tu propia cuenta de administrador" },
        { status: 400 }
      );
    }

    const db = getDb();
    db.prepare("UPDATE users SET status = ? WHERE id = ?").run(status, userId);

    return NextResponse.json({ ok: true, userId, status });
  } catch (err) {
    console.error("[admin/users PATCH]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
