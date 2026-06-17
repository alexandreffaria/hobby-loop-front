import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDashboard, type DashboardMetrics } from '../services/dashboard.service'
import { formatCurrency } from '../lib/formatters'
import { ErrorBanner } from '../components/ErrorBanner'

function formatMonth(ym: string): string {
  const d = new Date(ym + '-01T00:00:00')
  const month = d.toLocaleString('pt-BR', { month: 'long' })
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${d.getFullYear()}`
}

function KpiCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-brand-input rounded-2xl border border-white/10 px-5 py-4 shadow-lg">
      <p className="text-[11px] font-medium tracking-widest text-gray-500 uppercase">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent ? 'text-brand-gradient' : 'text-white'}`}>
        {value}
      </p>
    </div>
  )
}

const SEGMENTS = [
  { key: 'preparing', label: 'Em preparação', dot: 'bg-white/30', bar: 'bg-white/25' },
  { key: 'shipped', label: 'Enviado', dot: 'bg-brand-pink', bar: 'bg-brand-pink' },
  { key: 'delivered', label: 'Entregue', dot: 'bg-brand-blue', bar: 'bg-brand-blue' },
] as const

function DeliveriesCard({ metrics }: { metrics: DashboardMetrics }) {
  const d = metrics.deliveries_this_month
  const counts = { preparing: d.preparing, shipped: d.shipped, delivered: d.delivered }
  return (
    <div className="bg-brand-input rounded-2xl border border-white/10 px-5 py-5 shadow-lg">
      <div className="mb-4 flex items-baseline justify-between">
        <p className="text-[11px] font-medium tracking-widest text-gray-500 uppercase">
          Entregas · {formatMonth(metrics.month)}
        </p>
        <span className="text-sm text-gray-400">
          {d.total} {d.total === 1 ? 'entrega' : 'entregas'}
        </span>
      </div>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/5">
        {d.total > 0 &&
          SEGMENTS.map((s) => {
            const pct = (counts[s.key] / d.total) * 100
            return pct > 0 ? (
              <div key={s.key} className={s.bar} style={{ width: `${pct}%` }} aria-hidden="true" />
            ) : null
          })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {SEGMENTS.map((s) => (
          <div key={s.key} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} aria-hidden="true" />
            <span className="text-sm text-gray-300">{s.label}</span>
            <span className="text-sm font-semibold text-white tabular-nums">{counts[s.key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function KpiSkeleton() {
  return <div className="bg-brand-input h-24 w-full animate-pulse rounded-2xl border border-white/5" />
}

export function Dashboard() {
  const {
    data: metrics,
    isPending,
    isError,
  } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard })

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <h1 className="text-brand-gradient text-2xl font-bold tracking-tight">Visão geral</h1>
        {metrics && (
          <span className="text-xs tracking-wide text-gray-500 uppercase">{formatMonth(metrics.month)}</span>
        )}
      </div>

      {isError && <ErrorBanner message="Não foi possível carregar os indicadores." className="mb-6" />}

      <div className="animate-page-enter grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isPending || !metrics ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
            <KpiCard label="Assinantes ativos" value={String(metrics.active_subscribers)} />
            <KpiCard label="Receita mensal" value={`R$ ${formatCurrency(metrics.mrr_cents)}`} accent />
            <KpiCard label="Planos ativos" value={String(metrics.active_plans)} />
          </>
        )}
      </div>

      {metrics && (
        <div className="animate-page-enter mt-4">
          <DeliveriesCard metrics={metrics} />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/subscriptions"
          className="bg-brand-input flex flex-1 items-center justify-between rounded-2xl border border-white/10 px-5 py-4 shadow-lg transition-colors hover:border-white/25"
        >
          <span className="font-semibold text-white">Ver planos</span>
          <span className="text-brand-blue text-sm">→</span>
        </Link>
        <Link
          to="/subscriptions/new"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 px-5 py-4 text-sm text-gray-400 transition-colors hover:border-white/30 hover:text-white"
        >
          <span className="text-brand-pink text-lg leading-none">+</span> Novo plano
        </Link>
      </div>
    </div>
  )
}
