interface PeriodNavigatorProps {
  label: string
  caption?: string
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  loading?: boolean
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}

/**
 * Pill navigator that steps one delivery period at a time. "Previous" is
 * disabled at the earliest period (the one containing the subscription anchor);
 * "next" is always allowed, but future periods render as view-only upstream.
 */
export function PeriodNavigator({ label, caption, onPrev, onNext, canPrev, loading = false }: PeriodNavigatorProps) {
  return (
    <div className="bg-brand-input flex items-center justify-between gap-2 rounded-full border border-white/10 px-2 py-2 shadow-lg">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev || loading}
        aria-label="Período anterior"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Chevron dir="left" />
      </button>

      <div className="min-w-0 text-center">
        <p className="truncate text-sm font-semibold text-white tabular-nums">{label}</p>
        {caption && <p className="truncate text-[10px] tracking-wide text-gray-500 uppercase">{caption}</p>}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        aria-label="Próximo período"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Chevron dir="right" />
      </button>
    </div>
  )
}
