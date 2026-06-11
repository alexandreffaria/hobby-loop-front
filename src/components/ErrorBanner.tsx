export function ErrorBanner({ message, className = '' }: { message: string; className?: string }) {
  return (
    <div className={`rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 ${className}`}>
      <p className="text-sm text-red-400">{message}</p>
    </div>
  )
}
