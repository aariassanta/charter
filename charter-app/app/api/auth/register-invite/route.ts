import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDb, createSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, email, password, name, company } = body;

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (token, email, password)" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Indica tu nombre completo" }, { status: 400 });
    }
    if (!company || company.trim().length < 2) {
      return NextResponse.json({ error: "Indica tu empresa" }, { status: 400 });
    }

    const db = getDb();

    // Validate invite token
    const invite = db
      .prepare(
        `SELECT id, email, role, expires_at, used_at FROM invites WHERE token = ?`
      )
      .get(token) as { id: number; email: string; role: string; expires_at: string; used_at: string | null } | undefined;

    if (!invite) {
      return NextResponse.json({ error: "Invitación no encontrada" }, { status: 404 });
    }

    if (invite.used_at) {
      return NextResponse.json({ error: "Esta invitación ya fue utilizada" }, { status: 409 });
    }

    if (new Date(invite.expires_at + "Z").getTime() < Date.now()) {
      return NextResponse.json({ error: "Esta invitación ha caducado" }, { status: 410 });
    }

    if (invite.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: "Esta invitación no es válida para este email" },
        { status: 403 }
      );
    }

    // Check email not already used
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);

    // Insert user
    const insertResult = db
      .prepare(
        `INSERT INTO users (email, password_hash, role, status, company, created_by_invite_token)
         VALUES (?, ?, ?, 'active', ?, ?)`
      )
      .run(email, hash, invite.role, company, token);

    const rawId = insertResult.lastInsertRowid;
    const userId = typeof rawId === "bigint" ? Number(rawId) : (rawId as number);

    // Mark invite as used
    db.prepare(
      `UPDATE invites SET used_at = datetime('now'), used_by_user_id = ? WHERE id = ?`
    ).run(userId, invite.id);

    const sessionId = createSession(userId);

    const response = NextResponse.json({ ok: true, userId });
    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("[register-invite]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
