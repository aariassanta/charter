export function Logo({ className }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#2563eb" />
        <path
          d="M8 10h16M8 16h10M8 22h13"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-base font-bold text-slate-900">Charter PMO</span>
    </div>
  );
}
