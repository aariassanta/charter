import React from "react";

/**
 * Eyebrow label with optional serif numeral (qaizn-style "01", "02").
 * Use on landing-page sections, modal section headers, and major groupings.
 */
export function SectionLabel({
  numeral,
  children,
  style,
}: {
  numeral?: string | number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span className="section-label" style={style}>
      {numeral !== undefined && (
        <span className="section-label__numeral">
          {String(numeral).padStart(2, "0")}
        </span>
      )}
      {children}
    </span>
  );
}
