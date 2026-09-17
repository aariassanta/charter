interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 13h2v3H9zM9 8h2v2H9z" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-red-700 font-medium">Error</p>
        <p className="text-sm text-red-600 mt-0.5 break-all">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-red-700 font-medium hover:underline flex-shrink-0"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
