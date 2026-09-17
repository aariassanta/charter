import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Rule } from "@/components/ui/Rule";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--rule)",
          background: "var(--paper)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "var(--max)",
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
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-5)",
            }}
          >
            <Link
              href="/login"
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink)",
              }}
            >
              Iniciar sesión
            </Link>
            <Button as="a" href="/register" variant="filled" size="md">
              Comenzar
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ borderBottom: "1px solid var(--rule)" }}>
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "var(--space-10)",
            paddingTop: "var(--space-12)",
            paddingBottom: "var(--space-12)",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.75rem, 6vw, 4.5rem)",
              fontWeight: 500,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: "var(--ink)",
            }}
          >
            Tu oferta PDF,{" "}
            <span className="accent-italic">convertida</span>
            <br />
            en un charter de proyecto.
          </h1>
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--mid)",
                marginBottom: "var(--space-3)",
              }}
            >
              IA estratégica para ingenierías y consultoras
            </div>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "var(--ink-2)",
                lineHeight: 1.65,
                marginBottom: "var(--space-5)",
              }}
            >
              Subes tu oferta comercial y, en menos de tres minutos, obtienes
              un Project Charter completo: alcance, fechas, hitos, riesgos,
              entregables y stakeholders. Editas lo que haga falta y lo exportas
              listo para tu cliente.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <Button as="a" href="/register" variant="filled" size="lg">
                Empezar gratis <ArrowRight size={16} />
              </Button>
              <Button as="a" href="#como-funciona" variant="outline" size="lg">
                Ver cómo funciona <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Three offered pillars */}
      <section style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-10)" }}>
        <div className="container">
          <SectionLabel>Qué resuelve</SectionLabel>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginTop: "var(--space-3)",
              marginBottom: "var(--space-8)",
              maxWidth: 720,
            }}
          >
            Las preguntas que tu cliente siempre hace,{" "}
            <span className="accent-italic">respondidas</span> desde el primer minuto.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {[
              {
                num: "01",
                title: "Alcance claro",
                body: "Extrae fases, tareas y entregables con granularidad PMBOK. Lo que estaba enterrado en la oferta queda visible.",
              },
              {
                num: "02",
                title: "Fechas y hitos",
                body: "Detecta fechas críticas, plazos de entrega y dependencias. Lo editas inline si la IA interpreta algo distinto.",
              },
              {
                num: "03",
                title: "Riesgos y supuestos",
                body: "Propone riesgos típicos del sector si la oferta no los menciona. Cada uno etiquetado como [Propuesto].",
              },
            ].map((pillar) => (
              <div key={pillar.num} style={{ paddingTop: "var(--space-4)", borderTop: "1px solid var(--rule)" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "1.5rem",
                    color: "var(--ink)",
                  }}
                >
                  {pillar.num}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    marginTop: "var(--space-3)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {pillar.title}
                </h3>
                <p style={{ color: "var(--ink-2)", fontSize: "0.9375rem", lineHeight: 1.65 }}>
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <Rule />
      </div>

      {/* How it works */}
      <section
        id="como-funciona"
        style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-10)" }}
      >
        <div className="container">
          <SectionLabel>Cómo funciona</SectionLabel>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.875rem, 3.5vw, 2.5rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginTop: "var(--space-3)",
              marginBottom: "var(--space-8)",
              maxWidth: 700,
            }}
          >
            Cuatro pasos. <span className="accent-italic">Menos</span> de tres minutos.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {[
              {
                num: "01",
                title: "Sube tu oferta",
                body: "Arrastra un PDF o DOCX. Acepta propuestas comerciales, RFPs, pliegos, propuestas técnicas.",
              },
              {
                num: "02",
                title: "Agente IA extrae",
                body: "Modelo orquestado (Agno + cadena de validación) lee el documento y propone cada sección del charter.",
              },
              {
                num: "03",
                title: "Edita inline",
                body: "Revisa el modal. Corrige fechas, completa hitos, ajusta el resumen. El progreso se guarda al instante.",
              },
              {
                num: "04",
                title: "Exporta y comparte",
                body: "Descarga como PDF profesional, Markdown para Notion/Obsidian, o JSON para integrarlo con tu PMO.",
              },
            ].map((step) => (
              <div key={step.num} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "2rem",
                    lineHeight: 1,
                    color: "var(--ink)",
                  }}
                >
                  {step.num}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ color: "var(--mid)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <Rule />
      </div>

      {/* Pricing */}
      <section style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-10)" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "var(--space-5)",
              marginBottom: "var(--space-8)",
            }}
          >
            <div>
              <SectionLabel>Planes</SectionLabel>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.875rem, 3.5vw, 2.5rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  marginTop: "var(--space-3)",
                }}
              >
                Empieza gratis. Crece cuando lo{" "}
                <span className="accent-italic">necesites</span>.
              </h2>
            </div>
            <p
              style={{
                color: "var(--mid)",
                fontSize: "0.9375rem",
                maxWidth: 360,
                textAlign: "right",
              }}
            >
              Sin tarjeta de crédito para empezar. Cancela cuando quieras.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 0,
              border: "1px solid var(--rule)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
            }}
          >
            {[
              {
                plan: "Free",
                price: "€0",
                period: "/mes",
                desc: "Para probar y proyectos puntuales.",
                features: ["3 charters al mes", "PDF y DOCX", "Editor inline", "Export JSON"],
                cta: "Empezar gratis",
                href: "/register",
                accent: false,
              },
              {
                plan: "Pro",
                price: "€49",
                period: "/mes",
                desc: "Para equipos que viven del RFP.",
                features: [
                  "Charters ilimitados",
                  "5 seats incluidos",
                  "Export PDF + Markdown",
                  "Historial 90 días",
                ],
                cta: "Probar 14 días gratis",
                href: "/register?plan=pro",
                accent: true,
              },
            ].map((tier, i) => (
              <div
                key={tier.plan}
                style={{
                  padding: "var(--space-6)",
                  borderLeft: i === 0 ? "none" : "1px solid var(--rule)",
                  background: tier.accent ? "var(--tint)" : "var(--paper)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: tier.accent ? "var(--accent)" : "var(--mid)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  {tier.plan}
                </div>
                <div style={{ marginBottom: "var(--space-3)" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "3rem",
                      fontWeight: 500,
                      letterSpacing: "-0.03em",
                      color: "var(--ink)",
                    }}
                  >
                    {tier.price}
                  </span>
                  <span style={{ color: "var(--mid)", fontSize: "0.9375rem" }}>
                    {tier.period}
                  </span>
                </div>
                <p
                  style={{
                    color: "var(--ink-2)",
                    fontSize: "0.9375rem",
                    marginBottom: "var(--space-5)",
                  }}
                >
                  {tier.desc}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    marginBottom: "var(--space-6)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                    flex: 1,
                  }}
                >
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "var(--space-2)",
                        fontSize: "0.9375rem",
                        color: "var(--ink-2)",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--mid)",
                          fontFamily: "var(--font-display)",
                          fontStyle: "italic",
                        }}
                      >
                        —
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`btn btn--${tier.accent ? "filled" : "outline"}`}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <Rule />
      </div>

      {/* Footer */}
      <footer style={{ padding: "var(--space-10) 0" }}>
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gap: "var(--space-8)",
          }}
        >
          <div>
            <Logo />
            <p
              style={{
                marginTop: "var(--space-3)",
                color: "var(--mid)",
                fontSize: "0.9375rem",
                maxWidth: 280,
                lineHeight: 1.6,
              }}
            >
              Una herramienta del ecosistema{" "}
              <a href="https://pmo.dosas.org" style={{ color: "var(--accent)" }}>
                PMO Digital
              </a>
              .
            </p>
          </div>
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--mid)",
                marginBottom: "var(--space-3)",
              }}
            >
              Navegación
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <li>
                <Link href="/login" style={{ color: "var(--ink)" }}>Iniciar sesión</Link>
              </li>
              <li>
                <Link href="/register" style={{ color: "var(--ink)" }}>Registrarse</Link>
              </li>
            </ul>
          </div>
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--mid)",
                marginBottom: "var(--space-3)",
              }}
            >
              Contacto
            </div>
            <a href="mailto:hola@dosas.org" style={{ color: "var(--ink)" }}>
              hola@dosas.org
            </a>
          </div>
        </div>
        <div className="container" style={{ marginTop: "var(--space-8)" }}>
          <p style={{ color: "var(--mid)", fontSize: "0.8125rem" }}>
            © 2026 Charter — AI Project Charter from Offers
          </p>
        </div>
      </footer>
    </div>
  );
}
