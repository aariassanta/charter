"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Skeleton } from "@/components/ui/Skeleton";

interface InviteValidation {
  valid: boolean;
  email?: string;
  role?: string;
  expires_at?: string;
  error?: string;
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [invite, setInvite] = useState<InviteValidation | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setInvite({ valid: false, error: "Falta el token de invitación" });
      setLoadingInvite(false);
      return;
    }
    fetch(`/api/auth/validate-invite/${token}`)
      .then((r) => r.json())
      .then((data: InviteValidation) => {
        setInvite(data);
        if (data.valid && data.email) {
          setEmail(data.email);
        }
        setLoadingInvite(false);
      })
      .catch(() => {
        setInvite({ valid: false, error: "Error al validar la invitación" });
        setLoadingInvite(false);
      });
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (!name || !company) {
      setError("Completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password, name, company }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al crear la cuenta");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  }

  if (loadingInvite) {
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
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-8)" }}>
            <Logo size={32} />
          </div>
          <div className="surface" style={{ padding: "var(--space-8)" }}>
            <SectionLabel>Validando</SectionLabel>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
                marginTop: "var(--space-4)",
              }}
            >
              <Skeleton height={28} width="60%" />
              <Skeleton height={14} width="80%" />
              <Skeleton height={44} />
              <Skeleton height={44} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invite?.valid) {
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
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-8)" }}>
            <Logo size={32} />
          </div>
          <div className="surface" style={{ padding: "var(--space-8)" }}>
            <SectionLabel>Invitación</SectionLabel>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                marginTop: "var(--space-3)",
                marginBottom: "var(--space-3)",
              }}
            >
              Invitación no válida
            </h1>
            <p
              style={{
                color: "var(--mid)",
                marginBottom: "var(--space-6)",
                lineHeight: 1.6,
              }}
            >
              {invite?.error || "El enlace de invitación no es válido o ha caducado."}
            </p>
            <Button as="a" href="/login" variant="filled" size="md" style={{ width: "100%" }}>
              Ir a iniciar sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Link
          href="/"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "var(--space-8)",
          }}
        >
          <Logo size={32} />
        </Link>

        <div className="surface" style={{ padding: "var(--space-8)" }}>
          <SectionLabel>Crear cuenta</SectionLabel>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginTop: "var(--space-3)",
              marginBottom: "var(--space-2)",
            }}
          >
            Bienvenido a Charter
          </h1>
          <p
            style={{
              color: "var(--mid)",
              fontSize: "0.9375rem",
              marginBottom: "var(--space-6)",
            }}
          >
            Invitación válida para <strong style={{ color: "var(--ink)" }}>{email}</strong>.
          </p>

          {error && (
            <div style={{ marginBottom: "var(--space-4)" }}>
              <ErrorBanner>{error}</ErrorBanner>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
          >
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                disabled
                style={{ background: "var(--tint)", color: "var(--mid)" }}
              />
            </div>
            <div>
              <label className="label">Nombre completo</label>
              <input
                type="text"
                className="input"
                placeholder="María García"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Empresa</label>
              <input
                type="text"
                className="input"
                placeholder="Ingeniería Industrial S.L."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input
                type="password"
                className="input"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <Button
              type="submit"
              variant="filled"
              size="md"
              disabled={loading}
              style={{ width: "100%", marginTop: "var(--space-2)" }}
            >
              {loading ? "Creando cuenta…" : "Crear cuenta"}
            </Button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "var(--space-6)",
              fontSize: "0.9375rem",
              color: "var(--mid)",
            }}
          >
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" style={{ color: "var(--accent)" }}>
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--paper)",
          }}
        >
          <Skeleton height={32} width={120} />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
