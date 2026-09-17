import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

const INVITE_TTL_DAYS = 7;

async function sendInviteEmail(email: string, token: string, role: string): Promise<{ ok: boolean; error?: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://charter.dosas.org";
  const link = `${baseUrl}/register?token=${token}`;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? smtpUser ?? "noreply@charter.dosas.org";

  if (!smtpHost || !smtpUser || !smtpPass) {
    // Dev fallback: log to stdout so admin can copy the link
    console.log(`[invite] SMTP not configured — invite link: ${link}`);
    return { ok: true, error: "smtp_not_configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "Invitación a Charter SaaS",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
          <div style="background:#0f172a;color:white;padding:16px 20px;border-radius:8px 8px 0 0;display:flex;align-items:center;gap:10px;">
            <strong style="font-size:18px;">Charter SaaS</strong>
          </div>
          <div style="background:#f8fafc;padding:32px 24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
            <h2 style="margin:0 0 12px;font-size:20px;color:#0f172a;">Has sido invitado</h2>
            <p style="color:#475569;line-height:1.6;margin:0 0 16px;">Tu rol asignado: <strong>${role}</strong></p>
            <p style="color:#475569;line-height:1.6;margin:0 0 24px;">Haz clic en el siguiente botón para crear tu cuenta. El enlace caduca en ${INVITE_TTL_DAYS} días.</p>
            <p style="margin:0 0 24px;">
              <a href="${link}" style="background:#0f172a;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">Aceptar invitación</a>
            </p>
            <p style="color:#64748b;font-size:12px;line-height:1.5;margin:24px 0 0;padding-top:16px;border-top:1px solid #e2e8f0;">
              Si no puedes hacer clic, copia este enlace:<br><span style="word-break:break-all;color:#475569;">${link}</span>
            </p>
          </div>
        </div>
      `,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err).slice(0, 200) };
  }
}

// GET /api/admin/invites — list all invites
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const db = getDb();
  const rows = db
    .prepare(
      `SELECT i.id, i.token, i.email, i.role, i.expires_at, i.used_at, i.used_by_user_id,
              i.created_at, u.email AS invited_by_email
       FROM invites i
       LEFT JOIN users u ON i.invited_by_user_id = u.id
       ORDER BY i.created_at DESC
       LIMIT 200`
    )
    .all();

  return NextResponse.json(rows);
}

// POST /api/admin/invites — create invite + send email
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const role = String(body.role ?? "user").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }
    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    const db = getDb();
    const token = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const result = db
      .prepare(
        `INSERT INTO invites (token, email, role, invited_by_user_id, expires_at)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(token, email, role, auth.user.id, expiresAt);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://charter.dosas.org";
    const link = `${baseUrl}/register?token=${token}`;

    const mail = await sendInviteEmail(email, token, role);

    if (!mail.ok) {
      // Roll back invite if email failed
      db.prepare("DELETE FROM invites WHERE id = ?").run(result.lastInsertRowid);
      return NextResponse.json({ error: `Error enviando email: ${mail.error}` }, { status: 502 });
    }

    return NextResponse.json({
      id: Number(result.lastInsertRowid),
      email,
      role,
      expires_at: expiresAt,
      link,
      email_sent: true,
    });
  } catch (err) {
    console.error("[admin/invites POST]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// DELETE /api/admin/invites?id=N — revoke invite
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id requerido" }, { status: 400 });
  }

  const db = getDb();
  db.prepare("DELETE FROM invites WHERE id = ? AND used_at IS NULL").run(id);

  return NextResponse.json({ ok: true });
}
