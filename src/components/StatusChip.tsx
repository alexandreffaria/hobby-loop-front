import type { Subscriber } from '../services/subscriber.service'

// Exhaustive by type: adding a status to the Subscriber union forces an
// entry here, keeping every chip in the app consistent.
const chips: Record<Subscriber['status'], { label: string; className: string }> = {
  active: { label: 'Ativa', className: 'border-brand-pink bg-brand-pink/15 text-brand-pink' },
  pending_payment: {
    label: 'Aguardando pagamento',
    className: 'border-white/10 bg-white/5 text-gray-400',
  },
  canceled: { label: 'Cancelada', className: 'border-red-500/30 bg-red-500/10 text-red-400' },
}

export function StatusChip({ status }: { status: Subscriber['status'] }) {
  const chip = chips[status]
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${chip.className}`}
    >
      {chip.label}
    </span>
  )
}
