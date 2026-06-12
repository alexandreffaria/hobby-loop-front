import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getApiErrorMessage } from '../lib/apiError'
import { deleteSubscription, getSubscription } from '../services/subscription.service'
import { listSubscribers, type Subscriber } from '../services/subscriber.service'
import { queryClient } from '../lib/queryClient'
import { ErrorBanner } from '../components/ErrorBanner'
import { formatCurrency } from '../lib/formatters'

const subscriberChip: Record<Subscriber['status'], { label: string; className: string }> = {
  active: { label: 'Ativa', className: 'border-brand-pink bg-brand-pink/15 text-brand-pink' },
  pending_payment: {
    label: 'Aguardando pagamento',
    className: 'border-white/10 bg-white/5 text-gray-400',
  },
  canceled: { label: 'Cancelada', className: 'border-red-500/30 bg-red-500/10 text-red-400' },
}

function SubscriberRow({ subscriber }: { subscriber: Subscriber }) {
  const chip = subscriberChip[subscriber.status] ?? subscriberChip.pending_payment
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{subscriber.name}</p>
        <p className="truncate text-xs text-gray-500">{subscriber.email}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${chip.className}`}
        >
          {chip.label}
        </span>
        <span className="text-[10px] text-gray-500">
          {new Date(subscriber.created_at).toLocaleDateString('pt-BR')}
        </span>
      </div>
    </div>
  )
}

export function ManageSubscription() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: subscription, isPending, isError } = useQuery({
    queryKey: ['subscriptions', id],
    queryFn: () => getSubscription(id!),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteSubscription(id!),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ['subscriptions', id] })
      await queryClient.invalidateQueries({ queryKey: ['subscriptions'], exact: true })
      navigate('/subscriptions')
    },
  })

  const handleDelete = () => {
    if (!window.confirm('Tem certeza que deseja excluir esta assinatura?')) return
    deleteMutation.mutate()
  }

  const deleteError = deleteMutation.isError
    ? getApiErrorMessage(deleteMutation.error, 'Erro ao excluir.')
    : null

  const {
    data: subscribers,
    isPending: subscribersPending,
    isError: subscribersError,
  } = useQuery({
    queryKey: ['subscriptions', id, 'subscribers'],
    queryFn: () => listSubscribers(id!),
    enabled: !!id,
  })

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-16 pt-10 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <Link
          to="/subscriptions"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Voltar"
        >
          ←
        </Link>
        <h1 className="text-brand-gradient text-xl font-bold tracking-tight">
          {isPending ? 'Carregando...' : (subscription?.name ?? 'Assinatura')}
        </h1>
      </div>

      {isError && <ErrorBanner message="Não foi possível carregar a assinatura." className="mb-6" />}

      {subscription && (
        <div className="bg-brand-input overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
          <div className="border-b border-white/5 px-5 py-4">
            <p className="mb-1 text-[11px] font-medium tracking-widest text-gray-500 uppercase">Produtos</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {subscription.products.map((p) => (
                <span
                  key={p.id}
                  className="border-brand-pink bg-brand-pink/15 text-brand-pink rounded-full border px-3 py-1 text-xs font-medium"
                >
                  {p.name}
                </span>
              ))}
            </div>
          </div>
          <div className="px-5 py-4">
            <p className="mb-1 text-[11px] font-medium tracking-widest text-gray-500 uppercase">Valor</p>
            <p className="text-2xl font-semibold text-white">
              R$ {formatCurrency(subscription.price_cents)}
              <span className="ml-1 text-sm font-normal text-gray-500">ao mês</span>
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <p className="mb-2 text-[11px] font-medium tracking-widest text-gray-500 uppercase">
          Assinantes
        </p>
        {subscribersPending ? (
          <div className="bg-brand-input h-16 w-full animate-pulse rounded-2xl border border-white/5" />
        ) : subscribers && subscribers.length > 0 ? (
          <div className="bg-brand-input overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            {subscribers.map((s) => (
              <SubscriberRow key={s.id} subscriber={s} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-8 text-center">
            <p className="text-sm text-gray-500">
              {subscribersError
                ? 'Não foi possível carregar os assinantes.'
                : 'Assinantes aparecem aqui quando alguém se inscrever neste plano.'}
            </p>
          </div>
        )}
      </div>

      {deleteError && <ErrorBanner message={deleteError} className="mt-4" />}

      <button
        onClick={handleDelete}
        disabled={deleteMutation.isPending || isPending}
        className="mt-6 w-full rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleteMutation.isPending ? 'Excluindo...' : 'Excluir assinatura'}
      </button>
    </div>
  )
}
