"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LogOut,
  UserPlus,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Rule } from "@/components/ui/Rule";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface User {
  id: number;
  email: string;
  role: string;
  status: string;
  company: string | null;
  created_at: string;
  extraction_count: number;
}

interface Invite {
  id: number;
  token: string;
  email: string;
  role: string;
  expires_at: string;
  used_at: string | null;
  used_by_user_id: number | null;
  created_at: string;
  invited_by_email: string | null;
}

interface Stats {
  total_users: number;
  active_users: number;
  total_extractions: number;
  avg_confidence: number | null;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"user" | "admin">("user");
  const [inviteResult, setInviteResult] =
    useState<{ link?: string; error?: string } | null>(null);
  const [inviteSubmitting, setInviteSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("unauthorized");
      const data = await res.json();
      setUsers(data.users);
      setStats(data.stats);

      const inv = await fetch("/api/admin/invites");
      if (inv.ok) setInvites(await inv.json());
    } catch {
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteResult(null);
    setInviteSubmitting(true);
    try {
      const res = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteResult({ error: data.error });
        return;
      }
      setInviteResult({ link: data.link });
      setNewEmail("");
      loadData();
    } finally {
      setInviteSubmitting(false);
    }
  }

  async function handleRevoke(id: number) {
    if (!confirm("¿Revocar esta invitación?")) return;
    await fetch(`/api/admin/invites?id=${id}`, { method: "DELETE" });
    loadData();
  }

  async function handleToggleStatus(userId: number, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "disabled" : "active";
    if (!confirm(`¿Cambiar status del usuario a ${newStatus}?`)) return;
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, status: newStatus }),
    });
    loadData();
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-5)",
          background: "var(--paper)",
        }}
      >
        <Skeleton height={32} width={140} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <header
        style={{
          background: "var(--paper)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "var(--space-4) var(--space-5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ display: "inline-flex" }}>
            <Logo />
          </Link>
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <Button as="a" href="/dashboard" variant="outline" size="sm">
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<LogOut size={14} />}
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
            >
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "var(--space-8) var(--space-5)",
        }}
      >
        {/* Page title */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <SectionLabel>Administración</SectionLabel>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginTop: "var(--space-2)",
            }}
          >
            Charter Admin
          </h1>
        </div>

        {/* Stats */}
        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0,
              border: "1px solid var(--rule)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              marginBottom: "var(--space-8)",
            }}
          >
            {[
              { label: "Usuarios totales", value: stats.total_users },
              { label: "Activos", value: stats.active_users },
              { label: "Charters", value: stats.total_extractions },
              {
                label: "Confianza media",
                value: stats.avg_confidence ? Math.round(stats.avg_confidence) : "—",
              },
            ].map((s, i, arr) => (
              <div
                key={s.label}
                style={{
                  padding: "var(--space-5)",
                  textAlign: "center",
                  borderLeft: i === 0 ? "none" : "1px solid var(--rule)",
                  background: "var(--paper)",
                }}
              >
                <SectionLabel>{s.label}</SectionLabel>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.25rem",
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    color: "var(--ink)",
                    marginTop: "var(--space-2)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create invite */}
        <div className="surface" style={{ marginBottom: "var(--space-8)" }}>
          <SectionLabel>Crear invitación</SectionLabel>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginTop: "var(--space-3)",
              marginBottom: "var(--space-4)",
            }}
          >
            Generar acceso
          </h2>
          <form
            onSubmit={handleInvite}
            style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}
          >
            <input
              className="input"
              placeholder="email@empresa.com"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              style={{ flex: 1, minWidth: 200 }}
            />
            <select
              className="input"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as "user" | "admin")}
              style={{ width: 130 }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="submit" variant="filled" size="md" disabled={inviteSubmitting}>
              {inviteSubmitting ? "Enviando…" : "Generar invitación"}
            </Button>
          </form>
          {inviteResult?.link && (
            <div style={{ marginTop: "var(--space-3)" }}>
              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  borderLeft: "2px solid var(--accent)",
                  background: "var(--tint)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.875rem",
                  color: "var(--ink)",
                }}
              >
                <strong>Link generado:</strong>{" "}
                <a href={inviteResult.link} style={{ color: "var(--accent)" }}>
                  {inviteResult.link}
                </a>
              </div>
            </div>
          )}
          {inviteResult?.error && (
            <div style={{ marginTop: "var(--space-3)" }}>
              <ErrorBanner>{inviteResult.error}</ErrorBanner>
            </div>
          )}
        </div>

        {/* Invites list */}
        <div style={{ marginBottom: "var(--space-8)" }}>
          <SectionLabel>Invitaciones</SectionLabel>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginTop: "var(--space-3)",
              marginBottom: "var(--space-4)",
            }}
          >
            {invites.length} {invites.length === 1 ? "invitación" : "invitaciones"}
          </h2>
          {invites.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title="Sin invitaciones todavía"
              description="Genera una invitación con el formulario de arriba para dar acceso a un nuevo usuario."
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
              }}
            >
              {invites.map((inv) => {
                const isUsed = !!inv.used_at;
                const isExpired = new Date(inv.expires_at + "Z").getTime() < Date.now();
                return (
                  <div
                    key={inv.id}
                    className="surface"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "var(--space-3) var(--space-4)",
                      fontSize: "0.875rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: "var(--ink)" }}>
                        {inv.email}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--mid)" }}>
                        {inv.role} · caducidad{" "}
                        {new Date(inv.expires_at + "Z").toLocaleDateString("es-ES")}
                      </div>
                    </div>
                    {isUsed ? (
                      <Badge variant="plain" icon={<CheckCircle size={12} strokeWidth={2} />}>
                        Usada
                      </Badge>
                    ) : isExpired ? (
                      <Badge variant="muted" icon={<Clock size={12} strokeWidth={2} />}>
                        Caducada
                      </Badge>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                        <Badge variant="muted">Pendiente</Badge>
                        <button
                          onClick={() => handleRevoke(inv.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--mid)",
                          }}
                          aria-label="Revocar invitación"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Users list */}
        <div>
          <SectionLabel>Usuarios</SectionLabel>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginTop: "var(--space-3)",
              marginBottom: "var(--space-4)",
            }}
          >
            {users.length} {users.length === 1 ? "usuario" : "usuarios"}
          </h2>
          {users.length === 0 ? (
            <EmptyState title="Sin usuarios registrados" />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
              }}
            >
              {users.map((u) => (
                <div
                  key={u.id}
                  className="surface"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "var(--space-3) var(--space-4)",
                    fontSize: "0.875rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: "var(--ink)" }}>{u.email}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--mid)" }}>
                      {u.company ?? "—"} · {u.role} · {u.extraction_count} charters
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <Badge variant={u.status === "active" ? "plain" : "muted"}>
                      {u.status === "active" ? "Activo" : "Deshabilitado"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={
                        u.status === "active" ? (
                          <XCircle size={12} />
                        ) : (
                          <CheckCircle size={12} />
                        )
                      }
                      onClick={() => handleToggleStatus(u.id, u.status)}
                    >
                      {u.status === "active" ? "Deshabilitar" : "Habilitar"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
