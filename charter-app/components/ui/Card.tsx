import React from "react";

export function Card({
  hover = false,
  as: Tag = "div",
  style,
  children,
  ...props
}: {
  hover?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return React.createElement(
    Tag,
    {
      ...props,
      className: `surface ${hover ? "surface--hover" : ""}`.trim(),
      style,
    },
    children
  );
}
