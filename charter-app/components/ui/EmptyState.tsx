import React from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "var(--space-10) var(--space-4)",
        color: "var(--mid)",
      }}
    >
      {Icon && (
        <Icon
          size={32}
          strokeWidth={1.4}
          style={{ marginBottom: "var(--space-3)", opacity: 0.7 }}
          aria-hidden="true"
        />
      )}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "1.25rem",
          marginBottom: "var(--space-2)",
          color: "var(--ink)",
        }}
      >
        {title}
      </h3>
      {description && (
        <p style={{ maxWidth: 420, margin: "0 auto var(--space-4)", color: "var(--mid)" }}>
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
