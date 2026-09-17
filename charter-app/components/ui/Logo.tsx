import React from "react";

export function Logo({
  size = 28,
  showMark = true,
}: {
  size?: number;
  showMark?: boolean;
}) {
  // Plain wordmark + geometric mark. qaizn-style: serif numeral/mark + sans wordmark.
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontWeight: 700,
        fontFamily: "var(--font-body)",
        fontSize: "1.0625rem",
        color: "var(--ink)",
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      {showMark && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      )}
      <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
        Charter
      </span>
    </span>
  );
}
