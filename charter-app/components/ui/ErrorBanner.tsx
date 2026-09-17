"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * Inline notification strip. Restrained: single accent border, no red wash.
 * Replaces the duplicate red-bordered divs in login/register.
 */
export function ErrorBanner({
  children,
  variant = "error",
  icon: Icon = AlertCircle,
}: {
  children: React.ReactNode;
  variant?: "error" | "success" | "info";
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean | "true" | "false" }>;
}) {
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        padding: "var(--space-3) var(--space-4)",
        borderLeft: `2px solid var(--accent)`,
        background: "var(--tint)",
        borderRadius: "var(--radius-sm)",
        color: "var(--ink)",
        fontSize: "0.875rem",
        lineHeight: 1.5,
      }}
    >
      <Icon size={16} strokeWidth={1.6} aria-hidden={true} />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
