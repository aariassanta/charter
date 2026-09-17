interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={`text-xs font-semibold text-slate-400 uppercase tracking-wider ${className ?? ""}`}
    >
      {children}
    </p>
  );
}
