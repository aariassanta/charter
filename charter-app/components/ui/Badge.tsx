import React from "react";

type BadgeVariant = "plain" | "accent" | "muted";

export function Badge({
  variant = "plain",
  icon,
  children,
  style,
}: {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`badge badge--${variant}`} style={style}>
      {icon}
      {children}
    </span>
  );
}
