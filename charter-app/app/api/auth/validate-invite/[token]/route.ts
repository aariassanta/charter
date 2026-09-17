import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  const db = getDb();
  const invite = db
    .prepare(
      `SELECT id, email, role, expires_at, used_at FROM invites WHERE token = ?`
    )
    .get(token) as { id: number; email: string; role: string; expires_at: string; used_at: string | null } | undefined;

  if (!invite) {
    return NextResponse.json({ valid: false, error: "Invitación no encontrada" }, { status: 404 });
  }

  if (invite.used_at) {
    return NextResponse.json({ valid: false, error: "Esta invitación ya fue utilizada" }, { status: 409 });
  }

  if (new Date(invite.expires_at + "Z").getTime() < Date.now()) {
    return NextResponse.json({ valid: false, error: "Esta invitación ha caducado" }, { status: 410 });
  }

  return NextResponse.json({
    valid: true,
    email: invite.email,
    role: invite.role,
    expires_at: invite.expires_at,
  });
}
