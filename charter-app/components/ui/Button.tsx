"use client";

import React from "react";

type ButtonVariant = "filled" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    as?: "button";
  };

type LinkProps = CommonProps & {
  as: "a";
  href: string;
  target?: string;
  rel?: string;
};

type AnchorButtonProps = CommonProps & {
  as?: "button";
};

function classes(variant: ButtonVariant, size: ButtonSize, extra?: string) {
  const cn = `btn btn--${variant} btn--${size}`;
  return extra ? `${cn} ${extra}` : cn;
}

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "filled", size = "md", icon, children, className = "", style } = props;
  const cn = classes(variant, size, className);

  if ("as" in props && props.as === "a") {
    const { as: _a, variant: _v, size: _s, icon: _i, className: _c, style: _s2, href, target, rel, children: _ch, ...rest } = props as LinkProps;
    void _a; void _v; void _s; void _i; void _c; void _s2; void _ch;
    return (
      <a href={href} target={target} rel={rel} className={cn} style={style} {...rest}>
        {icon}
        {children}
      </a>
    );
  }

  const btnProps = props as ButtonProps;
  const { as: _a, variant: _v, size: _s, icon: _i, className: _c, style: _s2, children: _ch, ...rest } = btnProps;
  void _a; void _v; void _s; void _i; void _c; void _s2; void _ch;
  return (
    <button {...rest} className={cn} style={style}>
      {icon}
      {children}
    </button>
  );
}
