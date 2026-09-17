import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb, createSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email y password requeridos" }, { status: 400 });
    }

    const db = getDb();
    const user = db.prepare("SELECT id, email, password_hash, status FROM users WHERE email = ?").get(email) as { id: number; email: string; password_hash: string; status: string } | undefined;
    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    if (user.status !== "active") {
      return NextResponse.json({ error: "Cuenta deshabilitada. Contacta con el administrador." }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const sessionId = createSession(user.id);
    const response = NextResponse.json({ ok: true, userId: user.id });
    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
