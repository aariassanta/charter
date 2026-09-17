"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
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
      <div style={{ width: "100%", maxWidth: 400 }}>
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
          <SectionLabel>Acceso</SectionLabel>
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
            Iniciar sesión
          </h1>
          <p
            style={{
              color: "var(--mid)",
              fontSize: "0.9375rem",
              marginBottom: "var(--space-6)",
            }}
          >
            Accede a tu cuenta de Charter.
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
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              variant="filled"
              size="md"
              disabled={loading}
              style={{ width: "100%", marginTop: "var(--space-2)" }}
            >
              {loading ? "Iniciando…" : "Iniciar sesión"}
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
            ¿No tienes cuenta?{" "}
            <Link href="/register" style={{ color: "var(--accent)" }}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
