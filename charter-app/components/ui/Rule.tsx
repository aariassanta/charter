interface RuleProps {
  className?: string;
}

export function Rule({ className }: RuleProps) {
  return (
    <hr className={`border-slate-200 ${className ?? "my-4"}`} />
  );
}
