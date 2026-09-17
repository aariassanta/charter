"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Modal — Restrained shell with backdrop blur, scale-in entrance,
 * sticky footer with action buttons, Escape-to-close, and focus management.
 * Replaces both DetailModal and ImproveModal shells.
 */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  size = "md",
  footer,
  closeOnBackdrop = true,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  size?: "md" | "wide";
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-shell ${size === "wide" ? "modal-shell--wide" : ""}`.trim()}>
        {(title || subtitle) && (
          <header className="modal-header">
            <div>
              {title && (
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "var(--ink)",
                  }}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--mid)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="btn btn--ghost btn--sm"
              style={{ padding: 0, width: 32, height: 32 }}
            >
              <X size={16} />
            </button>
          </header>
        )}
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </div>
    </div>
  );
}
