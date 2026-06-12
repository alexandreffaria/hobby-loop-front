import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  cancelSubscriberPortal,
  getSubscriberPortal,
  type SubscriberPortal as SubscriberPortalData,
} from '../services/subscriber.service'
import { ErrorBanner } from '../components/ErrorBanner'
import { formatCurrency } from '../lib/formatters'
import { getApiErrorMessage } from '../lib/apiError'

const statusChip: Record<string, { label: string; className: string }> = {
  active: { label: 'Ativa', className: 'border-brand-pink bg-brand-pink/15 text-brand-pink' },
  pending_payment: {
    label: 'Aguardando pagamento',
    className: 'border-white/10 bg-white/5 text-gray-400',
  },
  canceled: { label: 'Cancelada', className: 'border-red-500/30 bg-red-500/10 text-red-400' },
}

export function SubscriberPortal() {
  const { token } = useParams<{ token: string }>()
  const queryClient = useQueryClient()

  const {
    data: portal,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['subscriber-portal', token],
    queryFn: () => getSubscriberPortal(token!),
    enabled: !!token,
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelSubscriberPortal(token!),
    onSuccess: (subscriber) => {
      queryClient.setQueryData<SubscriberPortalData>(
        ['subscriber-portal', token],
        (old) => old && { ...old, subscriber },
      )
    },
  })

  const handleCancel = () => {
    if (!window.confirm('Tem certeza que deseja cancelar sua assinatura?')) return
    cancelMutation.mutate()
  }

  if (isPending) {
    return (
      <p className="animate-page-enter py-20 text-center text-sm text-gray-400">
        Carregando sua assinatura…
      </p>
    )
  }

  if (isError || !portal) {
    return (
      <div className="animate-page-enter flex flex-col items-center gap-2 py-20">
        <p className="text-sm text-gray-400">Assinatura não encontrada.</p>
        <p className="text-xs text-gray-600">Confira o link do seu e-mail de confirmação.</p>
      </div>
    )
  }

  const { subscriber, plan } = portal
  const chip = statusChip[subscriber.status] ?? statusChip.pending_payment
  const canceled = subscriber.status === 'canceled'

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center px-6 py-10 pb-20">
      <h1 className="text-brand-gradient mb-6 text-center text-xl font-black uppercase">
        Minha assinatura
      </h1>

      <div className="bg-brand-input w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">{plan.name}</h2>
            <p className="text-xs text-gray-400">
              {plan.products.map((p) => p.name).join(' · ')}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${chip.className}`}
          >
            {chip.label}
          </span>
        </div>

        <div className="border-b border-white/5 px-5 py-4">
          <p className="mb-1 text-[11px] font-medium tracking-widest text-gray-500 uppercase">
            Valor
          </p>
          <p className="text-2xl font-semibold text-white">
            R$ {formatCurrency(plan.price_cents)}
            <span className="ml-1 text-sm font-normal text-gray-500">ao mês</span>
          </p>
        </div>

        <div className="px-5 py-4">
          <p className="mb-1 text-[11px] font-medium tracking-widest text-gray-500 uppercase">
            Assinante
          </p>
          <p className="text-sm font-medium text-white">{subscriber.name}</p>
          <p className="text-xs text-gray-500">{subscriber.email}</p>
          <p className="mt-1 text-[10px] text-gray-500">
            Desde {new Date(subscriber.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      {canceled ? (
        <p className="mt-6 text-center text-sm text-gray-400">Sua assinatura foi cancelada.</p>
      ) : (
        <button
          onClick={handleCancel}
          disabled={cancelMutation.isPending}
          className="mt-6 w-full rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar assinatura'}
        </button>
      )}

      {cancelMutation.isError && (
        <ErrorBanner
          message={getApiErrorMessage(cancelMutation.error, 'Não foi possível cancelar. Tente novamente.')}
          className="mt-4 w-full"
        />
      )}
    </div>
  )
}
