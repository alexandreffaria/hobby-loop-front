import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getApiErrorMessage } from '../lib/apiError'
import { deleteSubscription, getSubscription } from '../services/subscription.service'
import {
  getDeliveries,
  setDeliveryStatus,
  type Deliveries,
  type DeliveryStatus,
  type DeliverySubscriber,
} from '../services/delivery.service'
import { queryClient } from '../lib/queryClient'
import { ErrorBanner } from '../components/ErrorBanner'
import { StatusSelector } from '../components/StatusSelector'
import { PeriodNavigator } from '../components/PeriodNavigator'
import { formatCurrency } from '../lib/formatters'

const subscriberCountLabel = (n: number) => `${n} ${n === 1 ? 'assinante' : 'assinantes'}`

function formatPeriodLabel(start: string): string {
  const d = new Date(start + 'T00:00:00')
  const month = d.toLocaleString('pt-BR', { month: 'long' })
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${d.getFullYear()}`
}

function DeliveryRow({
  subscriber,
  disabled,
  onChange,
}: {
  subscriber: DeliverySubscriber
  disabled: boolean
  onChange: (status: DeliveryStatus) => void
}) {
  return (
    <div className="bg-brand-input rounded-2xl border border-white/10 px-5 py-4 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-white">{subscriber.name}</p>
          <p className="text-xs text-gray-500">Mensalmente</p>
        </div>
        <div className="shrink-0">
          <StatusSelector value={subscriber.delivery_status} onChange={onChange} disabled={disabled} />
        </div>
      </div>

      <div className="mt-3 border-t border-white/5 pt-3">
        <p className="mb-1 text-[10px] font-medium tracking-widest text-gray-500 uppercase">
          Endereço de entrega
        </p>
        <p className="text-brand-blue text-sm leading-snug">
          {subscriber.address}
          {subscriber.complement ? ` — ${subscriber.complement}` : ''}
        </p>
        <p className="text-brand-blue/80 text-sm leading-snug">CEP {subscriber.cep}</p>
      </div>
    </div>
  )
}

export function ManageSubscription() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [offset, setOffset] = useState(0)

  const { data: subscription, isPending, isError } = useQuery({
    queryKey: ['subscriptions', id],
    queryFn: () => getSubscription(id!),
    enabled: !!id,
  })

  const deliveriesKey = ['subscriptions', id, 'deliveries', offset]
  const {
    data: deliveries,
    isPending: deliveriesPending,
    isError: deliveriesError,
  } = useQuery({
    queryKey: deliveriesKey,
    queryFn: () => getDeliveries(id!, offset),
    enabled: !!id,
  })

  const statusMutation = useMutation({
    mutationFn: setDeliveryStatus,
    onMutate: async (vars) => {
      const key = ['subscriptions', id, 'deliveries', offset]
      await queryClient.cancelQueries({ queryKey: key })
      const prev = queryClient.getQueryData<Deliveries>(key)
      if (prev) {
        queryClient.setQueryData<Deliveries>(key, {
          ...prev,
          subscribers: prev.subscribers.map((s) =>
            s.id === vars.subscriberId ? { ...s, delivery_status: vars.status } : s,
          ),
        })
      }
      return { prev, key }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(context.key, context.prev)
    },
    onSettled: (_data, _err, _vars, context) => {
      if (context?.key) queryClient.invalidateQueries({ queryKey: context.key })
    },
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

  const period = deliveries?.period
  const isFuture = period?.is_future ?? false

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-10 pb-16 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/subscriptions"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Voltar"
        >
          ←
        </Link>
        <h1 className="text-brand-gradient flex-1 truncate text-xl font-bold tracking-tight">
          {isPending ? 'Carregando...' : (subscription?.name ?? 'Assinatura')}
        </h1>
        {id && (
          <Link
            to={`/edit/${id}`}
            className="rounded-full px-3 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            Editar
          </Link>
        )}
      </div>

      {isError && <ErrorBanner message="Não foi possível carregar a assinatura." className="mb-6" />}

      {subscription && (
        <div className="bg-brand-input flex items-center justify-between rounded-2xl border border-white/10 px-5 py-4 shadow-2xl">
          <div>
            <p className="text-[11px] font-medium tracking-widest text-gray-500 uppercase">
              Entrega mensal
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              R$ {formatCurrency(subscription.price_cents)}
              <span className="ml-1 text-sm font-normal text-gray-500">ao mês</span>
            </p>
          </div>
          <span className="text-brand-blue text-sm font-semibold">
            {subscriberCountLabel(subscription.active_subscribers)}
          </span>
        </div>
      )}

      <div className="mt-8 mb-3 flex items-end justify-between">
        <p className="text-brand-blue text-lg font-bold">Entregas</p>
        {period && (
          <span className="text-[11px] tracking-wide text-gray-500 uppercase">
            {isFuture ? 'Período futuro · somente leitura' : period.offset === 0 ? 'Período atual' : 'Período anterior'}
          </span>
        )}
      </div>

      <PeriodNavigator
        label={period ? formatPeriodLabel(period.start) : 'Carregando...'}
        onPrev={() => setOffset((o) => o - 1)}
        onNext={() => setOffset((o) => o + 1)}
        canPrev={period?.has_previous ?? false}
        loading={deliveriesPending}
      />

      <div key={offset} className="animate-page-enter mt-4 space-y-3">
        {deliveriesPending ? (
          <>
            <div className="bg-brand-input h-28 w-full animate-pulse rounded-2xl border border-white/5" />
            <div className="bg-brand-input h-28 w-full animate-pulse rounded-2xl border border-white/5" />
          </>
        ) : deliveriesError ? (
          <ErrorBanner message="Não foi possível carregar as entregas." />
        ) : deliveries && deliveries.subscribers.length > 0 ? (
          deliveries.subscribers.map((s) => (
            <DeliveryRow
              key={s.id}
              subscriber={s}
              disabled={
                isFuture || (statusMutation.isPending && statusMutation.variables?.subscriberId === s.id)
              }
              onChange={(status) =>
                statusMutation.mutate({
                  subscriptionId: id!,
                  subscriberId: s.id,
                  periodStart: deliveries.period.start,
                  status,
                })
              }
            />
          ))
        ) : (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-10 text-center">
            <p className="text-sm text-gray-500">Nenhum assinante ativo neste período.</p>
          </div>
        )}
      </div>

      {deleteError && <ErrorBanner message={deleteError} className="mt-6" />}

      <button
        onClick={handleDelete}
        disabled={deleteMutation.isPending || isPending}
        className="mt-8 w-full rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleteMutation.isPending ? 'Excluindo...' : 'Excluir assinatura'}
      </button>
    </div>
  )
}
