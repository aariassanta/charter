import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "./db";

/**
 * Verify the current request is from an authenticated admin user.
 * Returns the admin user object, or a 401/403 response if not authorized.
 */
export async function requireAdmin(): Promise<
  | { ok: true; user: { id: number; email: string; role: string } }
  | { ok: false; response: NextResponse }
> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;
  if (!sessionId) {
    return { ok: false, response: NextResponse.json({ error: "No autenticado" }, { status: 401 }) };
  }

  const db = getDb();
  const row = db
    .prepare(
      `SELECT u.id, u.email, u.role, u.status, s.expires_at
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`
    )
    .get(sessionId) as { id: number; email: string; role: string; status: string; expires_at: string } | undefined;

  if (!row) {
    return { ok: false, response: NextResponse.json({ error: "Sesión inválida" }, { status: 401 }) };
  }

  if (row.status !== "active") {
    return { ok: false, response: NextResponse.json({ error: "Usuario deshabilitado" }, { status: 403 }) };
  }

  if (new Date(row.expires_at + "Z").getTime() < Date.now()) {
    return { ok: false, response: NextResponse.json({ error: "Sesión expirada" }, { status: 401 }) };
  }

  if (row.role !== "admin") {
    return { ok: false, response: NextResponse.json({ error: "Sin permisos de administrador" }, { status: 403 }) };
  }

  return { ok: true, user: { id: row.id, email: row.email, role: row.role } };
}
