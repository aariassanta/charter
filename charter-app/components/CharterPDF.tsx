import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import React from "react";

function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  if (Array.isArray(value)) return value as T;
  if (typeof value === "object") return value as T;
  return fallback;
}

// ── Tokens (qaizn-aligned, inlined because @react-pdf/renderer
//    does not resolve CSS custom properties) ────────────────────────
const COLORS = {
  paper: "#ffffff",
  ink: "#0d0d0a",
  ink2: "#1d1d1a",
  mid: "#888480",
  faint: "#ebebeb",
  rule: "#d6d6d3", // rgba(13,13,10,0.10) at 1× rendered →  ~10% gray
  accent: "#1a5cc8",
  tintBg: "#f5f5f3",
} as const;

const FONT = {
  display: "Times-Roman",
  displayBold: "Times-Bold",
  displayItalic: "Times-Italic",
  body: "Helvetica",
  bodyBold: "Helvetica-Bold",
  bodyItalic: "Helvetica-Oblique",
} as const;

const pdfStyles = StyleSheet.create({
  // ── Page ─────────────────────────────────────────────────────────────
  page: {
    fontFamily: FONT.body,
    fontSize: 10,
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 56,
    color: COLORS.ink2,
    lineHeight: 1.55,
  },

  // ── Header (cover-ish treatment of project name + date) ─────────────
  brand: {
    fontFamily: FONT.body,
    fontSize: 7,
    fontWeight: 700,
    color: COLORS.mid,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 18,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  title: {
    fontFamily: FONT.display,
    fontSize: 30,
    color: COLORS.ink,
    lineHeight: 1.05,
    flex: 1,
  },
  titleItalic: {
    fontFamily: FONT.displayItalic,
    color: COLORS.accent,
  },
  meta: {
    fontFamily: FONT.body,
    fontSize: 8,
    color: COLORS.mid,
    marginBottom: 28,
    letterSpacing: 0.5,
  },

  // ── Hairline dividers (sections separated by --rule) ─────────────────
  hairline: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.rule,
    marginTop: 22,
    marginBottom: 14,
  },

  // ── Section blocks ───────────────────────────────────────────────────
  section: { marginBottom: 22 },
  eyebrow: {
    fontFamily: FONT.body,
    fontSize: 7,
    color: COLORS.mid,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
  },
  eyebrowWithNumeral: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  numeral: {
    fontFamily: FONT.displayItalic,
    fontSize: 11,
    color: COLORS.ink,
    marginRight: 12,
    fontWeight: 400,
  },
  h2: {
    fontFamily: FONT.display,
    fontSize: 18,
    color: COLORS.ink,
    marginBottom: 8,
  },

  // ── Body text variants ──────────────────────────────────────────────
  body: {
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLORS.ink2,
    marginBottom: 6,
  },
  bodyMuted: {
    fontFamily: FONT.body,
    fontSize: 9,
    color: COLORS.mid,
    marginBottom: 4,
  },
  bodyItalic: {
    fontFamily: FONT.bodyItalic,
    fontSize: 10,
    color: COLORS.ink2,
  },
  displayPrice: {
    fontFamily: FONT.display,
    fontSize: 22,
    color: COLORS.ink,
    marginTop: 2,
  },

  // ── Bullet item: small '.' prefix (matches the modal's <ul> default
//    browser dot, ~8px instead of bold 11px)
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "baseline",
  },
  bulletDot: {
    fontFamily: FONT.body,
    fontSize: 8,
    color: COLORS.mid,
    width: 12,
  },
  bulletBody: {
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLORS.ink2,
    flex: 1,
  },

  // ── Card patterns: mirror DetailModal card layouts ───────────────────
  // Modal uses borderLeft 2px tint + var(--tint) background with consistent
  // padding (var(--space-3) var(--space-4)) — replicate that here.

  // Mod-tarea (Task): borderLeft + name + phase Badge + duration + week + desc
  // (modal uses borderRadius sm = 4px but only on bordered (risk) cards;
  // tasks use borderLeft only and no border-radius)
  taskCard: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.rule,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 6,
  },
  taskCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  taskCardTitle: {
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLORS.ink,
    fontWeight: 500,
    marginRight: 6,
  },
  taskDescription: {
    fontFamily: FONT.body,
    fontSize: 9,
    color: COLORS.mid,
    marginTop: 4,
  },

  // Modal-risks (Risk): border 1px rule + paper bg + radius sm (matches modal's
  // `border: "1px solid var(--rule)", borderRadius: var(--radius-md)`)
  riskCard: {
    borderWidth: 1,
    borderColor: COLORS.rule,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 6,
  },
  riskCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  riskName: {
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLORS.ink,
    fontWeight: 500,
    flex: 1,
  },
  riskMitigation: {
    fontFamily: FONT.body,
    fontSize: 9,
    color: COLORS.mid,
    marginLeft: 10,
  },

  // Modal-spec (TechSpec): borderLeft tint + category Badge + item + meta
  // (modal uses no border-radius on these borderLeft-only cards)
  specCard: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.rule,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 6,
  },
  specCardRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  specCategory: {
    fontFamily: FONT.body,
    fontSize: 7,
    fontWeight: 700,
    color: COLORS.mid,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginRight: 8,
  },
  specItem: {
    fontFamily: FONT.body,
    fontSize: 10,
    fontWeight: 600,
    color: COLORS.ink,
  },
  specMeta: {
    fontFamily: FONT.body,
    fontSize: 9,
    color: COLORS.mid,
    marginTop: 3,
    marginLeft: 10,
  },

  // Modal-hitos (Milestone): just icon-glyph + name + date (no card wrapper)
  milestoneRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  milestoneBullet: {
    fontFamily: FONT.body,
    fontSize: 9,
    color: COLORS.mid,
    width: 14,
  },
  milestoneName: {
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLORS.ink,
    fontWeight: 500,
  },
  milestoneDate: {
    fontFamily: FONT.body,
    fontSize: 9,
    color: COLORS.mid,
    marginLeft: 6,
  },

  // ── Restrained pill (replaces traffic-light badges) ──────────────────
  pill: {
    fontFamily: FONT.body,
    fontSize: 7,
    color: COLORS.mid,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 4,
    borderWidth: 0.5,
    borderColor: COLORS.rule,
    borderRadius: 2,
  },

  // ── Stakeholder table (hairline rows, no header line) ────────────────
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.rule,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.rule,
  },
  tableRowLast: { flexDirection: "row", paddingVertical: 6 },
  cellName: { width: "32%" },
  cellRole: { width: "22%" },
  cellOrg: { width: "26%" },
  cellEng: { width: "20%" },
  cellLabel: {
    fontFamily: FONT.body,
    fontSize: 7,
    fontWeight: 700,
    color: COLORS.mid,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  cellValue: {
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLORS.ink2,
  },
  cellValueStrong: {
    fontFamily: FONT.bodyBold,
    fontSize: 10,
    color: COLORS.ink,
  },

  // ── Inline metadata block (presupuesto / fechas / cliente) ───────────
  metaRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  metaLabel: {
    fontFamily: FONT.body,
    fontSize: 8,
    color: COLORS.mid,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    width: "22%",
  },
  metaValue: {
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLORS.ink2,
    width: "78%",
  },

  // ── Footer (qaizn-style: hairline above, mid color, small) ───────────
  footer: {
    position: "absolute",
    bottom: 28,
    left: 56,
    right: 56,
    fontFamily: FONT.body,
    fontSize: 7,
    color: COLORS.mid,
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

function RiskMeta({ prob, imp }: { prob?: string; imp?: string }) {
  if (!prob && !imp) return null;
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {prob ? <Text style={pdfStyles.pill}>P: {prob}</Text> : null}
      {imp ? <Text style={pdfStyles.pill}>I: {imp}</Text> : null}
    </View>
  );
}

function EyebrowSection({
  numeral,
  title,
  children,
}: {
  numeral?: string | number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={pdfStyles.section}>
      {numeral !== undefined ? (
        <View style={pdfStyles.eyebrowWithNumeral}>
          <Text style={pdfStyles.numeral}>{String(numeral).padStart(2, "0")}</Text>
          <Text style={pdfStyles.eyebrow}>{title}</Text>
        </View>
      ) : (
        <Text style={pdfStyles.eyebrow}>{title}</Text>
      )}
      {children}
    </View>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((it, i) => (
        <View key={i} style={pdfStyles.bulletRow}>
          <Text style={pdfStyles.bulletDot}>·</Text>
          <Text style={pdfStyles.bulletBody}>{it}</Text>
        </View>
      ))}
    </View>
  );
}

export function CharterPDF({ row }: { row: Record<string, unknown> }) {
  const projectName = String(row.project_name ?? "Charter");
  const offerSummary = row.offer_summary ? String(row.offer_summary) : "";
  const totalBudget = row.total_budget ? String(row.total_budget) : "";
  const startDate = row.start_date ? String(row.start_date) : "";
  const endDate = row.end_date ? String(row.end_date) : "";

  const milestones = parseJsonField<Array<any>>(row.milestones, []);
  const tasks = parseJsonField<Array<any>>(row.tasks, []);
  const deliverables = parseJsonField<string[]>(row.deliverables, []);
  const stakeholders = parseJsonField<Array<any>>(row.stakeholders, []);
  const risks = parseJsonField<Array<any>>(row.risks, []);
  const assumptions = parseJsonField<string[]>(row.assumptions, []);
  const constraints = parseJsonField<string[]>(row.constraints, []);
  const technical_specs = parseJsonField<Array<any>>(row.technical_specs, []);
  const objectives = parseJsonField<string[]>(row.objectives, []);
  const success_criteria = parseJsonField<string[]>(row.success_criteria, []);
  const validation_tests = parseJsonField<string[]>(row.validation_tests, []);
  const client = parseJsonField<any>(row.client_json, {});
  const manufacturer = parseJsonField<any>(row.manufacturer_json, {});

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Brand mark */}
        <Text style={pdfStyles.brand}>Charter SaaS · charter.dosas.org</Text>

        {/* Title block */}
        <View style={pdfStyles.titleRow}>
          <Text style={pdfStyles.title}>{projectName}</Text>
        </View>
        <Text style={pdfStyles.meta}>
          {`Generado el ${new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}`}
        </Text>

        <View style={pdfStyles.hairline} />

        {/* 1. Resumen */}
        {offerSummary && (
          <EyebrowSection title="Resumen del proyecto">
            <Text style={pdfStyles.body}>{offerSummary}</Text>
          </EyebrowSection>
        )}

        {/* 2. Presupuesto */}
        {totalBudget && (
          <EyebrowSection title="Presupuesto">
            <Text style={pdfStyles.displayPrice}>{totalBudget}</Text>
          </EyebrowSection>
        )}

        {/* 3. Fechas */}
        {(startDate || endDate) && (
          <EyebrowSection title="Fechas">
            <Text style={pdfStyles.body}>
              Inicio: <Text style={pdfStyles.cellValueStrong}>{startDate || "—"}</Text>
              {"    "}Fin: <Text style={pdfStyles.cellValueStrong}>{endDate || "—"}</Text>
            </Text>
          </EyebrowSection>
        )}

        {/* 4. Cliente / Proveedor */}
        {(client?.name || manufacturer?.name) && (
          <EyebrowSection title="Cliente y proveedor">
            {client?.name && (
              <View style={pdfStyles.metaRow}>
                <Text style={pdfStyles.metaLabel}>Cliente</Text>
                <Text style={pdfStyles.metaValue}>
                  <Text style={pdfStyles.cellValueStrong}>{String(client.name)}</Text>
                  {client.contact ? `  ·  ${String(client.contact)}` : ""}
                </Text>
              </View>
            )}
            {manufacturer?.name && (
              <View style={pdfStyles.metaRow}>
                <Text style={pdfStyles.metaLabel}>Proveedor</Text>
                <Text style={pdfStyles.metaValue}>
                  <Text style={pdfStyles.cellValueStrong}>{String(manufacturer.name)}</Text>
                  {manufacturer.contact ? `  ·  ${String(manufacturer.contact)}` : ""}
                </Text>
              </View>
            )}
          </EyebrowSection>
        )}

        {/* 5. Objetivos */}
        {objectives.length > 0 && (
          <EyebrowSection title="Objetivos">
            <Bullets items={objectives} />
          </EyebrowSection>
        )}

        {/* 6. Especificaciones Técnicas (mirrors modal <Technical Specs>) */}
        {technical_specs.length > 0 && (
          <EyebrowSection
            numeral={1}
            title={`Especificaciones técnicas · ${technical_specs.length}`}
          >
            {technical_specs.map((s, i) => (
              <View key={`spec-${i}`} style={pdfStyles.specCard}>
                <View style={pdfStyles.specCardRow}>
                  <Text style={pdfStyles.specCategory}>{s.category ?? "Otro"}</Text>
                  <Text style={pdfStyles.specItem}>{s.item ?? ""}</Text>
                </View>
                {(s.brand_model || s.quantity) && (
                  <Text style={pdfStyles.specMeta}>
                    {s.quantity ? `${s.quantity}` : ""}
                    {s.brand_model && s.quantity ? "  ·  " : ""}
                    {s.brand_model && !/no especificado/i.test(String(s.brand_model))
                      ? `${s.brand_model}`
                      : ""}
                  </Text>
                )}
              </View>
            ))}
          </EyebrowSection>
        )}

        {/* 7. Hitos (mirrors modal <Hitos>: bullet-glyph + name + due_date) */}
        {milestones.length > 0 && (
          <EyebrowSection numeral={2} title={`Hitos · ${milestones.length}`}>
            {milestones.map((m, i) => (
              <View key={`ms-${i}`} style={pdfStyles.milestoneRow}>
                <Text style={pdfStyles.milestoneBullet}>●</Text>
                <Text style={pdfStyles.milestoneName}>{m.name}</Text>
                {m.due_date && (
                  <Text style={pdfStyles.milestoneDate}>{m.due_date}</Text>
                )}
              </View>
            ))}
          </EyebrowSection>
        )}

        {/* 8. Riesgos (mirrors modal <Risks>: bordered card + AlertCircle-like header) */}
        {risks.length > 0 && (
          <EyebrowSection numeral={3} title={`Riesgos · ${risks.length}`}>
            {risks.map((r, i) => (
              <View key={`risk-${i}`} style={pdfStyles.riskCard}>
                <View style={pdfStyles.riskCardHeader}>
                  <Text style={pdfStyles.riskName}>{r.name}</Text>
                  <RiskMeta prob={r.probability} imp={r.impact} />
                </View>
                {r.mitigation && (
                  <Text style={pdfStyles.riskMitigation}>
                    <Text style={{ fontFamily: FONT.body, fontWeight: 700 }}>Mitigación:</Text>{" "}
                    {r.mitigation}
                  </Text>
                )}
              </View>
            ))}
          </EyebrowSection>
        )}

        {/* 9. Suposiciones */}
        {assumptions.length > 0 && (
          <EyebrowSection title="Suposiciones">
            <Bullets items={assumptions} />
          </EyebrowSection>
        )}

        {/* 10. Restricciones */}
        {constraints.length > 0 && (
          <EyebrowSection title="Restricciones">
            <Bullets items={constraints} />
          </EyebrowSection>
        )}

        {/* 11. Tareas (mirrors modal <Tasks>: borderLeft card + chips + description) */}
        {tasks.length > 0 && (
          <EyebrowSection numeral={4} title={`Tareas · ${tasks.length}`}>
            {tasks.map((t, i) => (
              <View key={`task-${i}`} style={pdfStyles.taskCard}>
                <View style={pdfStyles.taskCardHeader}>
                  <Text style={pdfStyles.taskCardTitle}>{t.name}</Text>
                  {t.phase && <Text style={pdfStyles.pill}>{t.phase}</Text>}
                  {t.duration_days && (
                    <Text style={pdfStyles.pill}>{`${t.duration_days} días`}</Text>
                  )}
                  {t.start_week && <Text style={pdfStyles.pill}>{`· ${t.start_week}`}</Text>}
                </View>
                {t.description && (
                  <Text style={pdfStyles.taskDescription}>{t.description}</Text>
                )}
              </View>
            ))}
          </EyebrowSection>
        )}

        {/* 12. Entregables */}
        {deliverables.length > 0 && (
          <EyebrowSection numeral={5} title={`Entregables · ${deliverables.length}`}>
            {deliverables.map((d, i) => (
              <View key={`dlv-${i}`} style={pdfStyles.bulletRow}>
                <Text style={pdfStyles.bulletDot}>·</Text>
                <Text style={pdfStyles.bulletBody}>{d}</Text>
              </View>
            ))}
          </EyebrowSection>
        )}

        {/* 13. Stakeholders (table with hairlines) */}
        {stakeholders.length > 0 && (
          <EyebrowSection numeral={6} title={`Stakeholders · ${stakeholders.length}`}>
            <View style={pdfStyles.tableHeader}>
              <Text style={[pdfStyles.cellName, pdfStyles.cellLabel]}>Nombre</Text>
              <Text style={[pdfStyles.cellRole, pdfStyles.cellLabel]}>Rol</Text>
              <Text style={[pdfStyles.cellOrg, pdfStyles.cellLabel]}>Organización</Text>
              <Text style={[pdfStyles.cellEng, pdfStyles.cellLabel]}>Engagement</Text>
            </View>
            {stakeholders.map((s, i) => {
              const isLast = i === stakeholders.length - 1;
              return (
                <View key={`stk-${i}`} style={isLast ? pdfStyles.tableRowLast : pdfStyles.tableRow}>
                  <View style={pdfStyles.cellName}>
                    <Text style={pdfStyles.cellValueStrong}>{s.name}</Text>
                    {s.email && <Text style={pdfStyles.bodyMuted}>{s.email}</Text>}
                  </View>
                  <Text style={[pdfStyles.cellRole, pdfStyles.cellValue]}>{s.role ?? "—"}</Text>
                  <Text style={[pdfStyles.cellOrg, pdfStyles.cellValue]}>
                    {s.organization ?? "—"}
                  </Text>
                  <Text style={[pdfStyles.cellEng, pdfStyles.cellValue, { color: COLORS.mid }]}>
                    {s.engagement ?? "—"}
                  </Text>
                </View>
              );
            })}
          </EyebrowSection>
        )}

        {/* 14. Criterios de éxito */}
        {success_criteria.length > 0 && (
          <EyebrowSection title="Criterios de éxito">
            <Bullets items={success_criteria} />
          </EyebrowSection>
        )}

        {/* 15. Pruebas de validación */}
        {validation_tests.length > 0 && (
          <EyebrowSection title="Pruebas de validación">
            <Bullets items={validation_tests} />
          </EyebrowSection>
        )}

        <Text
          style={pdfStyles.footer}
          render={({ pageNumber, totalPages }) =>
            `Charter SaaS · charter.dosas.org · ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
