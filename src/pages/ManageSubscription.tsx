import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getApiErrorMessage } from '../lib/apiError'
import { cancelSubscription, getSubscription } from '../services/subscription.service'
import {
  getDeliveries,
  setDeliveryStatus,
  bulkSetDeliveryStatus,
  type Deliveries,
  type DeliveryStatus,
  type DeliverySubscriber,
} from '../services/delivery.service'
import {
  updateSubscriber,
  cancelSubscriber,
  type UpdateSubscriberRequest,
} from '../services/subscriber.service'
import { buildShippingCsv, downloadTextFile } from '../lib/shippingCsv'
import { queryClient } from '../lib/queryClient'
import { ErrorBanner } from '../components/ErrorBanner'
import { StatusSelector } from '../components/StatusSelector'
import { PeriodNavigator } from '../components/PeriodNavigator'
import { SubscriberEditModal } from '../components/SubscriberEditModal'
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
  onEdit,
  onCancel,
}: {
  subscriber: DeliverySubscriber
  disabled: boolean
  onChange: (status: DeliveryStatus) => void
  onEdit: () => void
  onCancel: () => void
}) {
  const canceled = subscriber.status === 'canceled'
  return (
    <div className="bg-brand-input rounded-2xl border border-white/10 px-5 py-4 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-semibold text-white">{subscriber.name}</p>
            {canceled && (
              <span className="shrink-0 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-red-400 uppercase">
                Cancelado
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">Mensalmente</p>
        </div>
        <div className="shrink-0">
          <StatusSelector value={subscriber.delivery_status} onChange={onChange} disabled={disabled} />
        </div>
      </div>

      <div className="mt-3 border-t border-white/5 pt-3">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-[10px] font-medium tracking-widest text-gray-500 uppercase">
            Endereço de entrega
          </p>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-md px-2 py-0.5 text-[11px] font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Editar
            </button>
            {!canceled && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md px-2 py-0.5 text-[11px] font-medium text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
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
  const [editing, setEditing] = useState<DeliverySubscriber | null>(null)

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

  const bulkMutation = useMutation({
    mutationFn: (status: DeliveryStatus) =>
      bulkSetDeliveryStatus({ subscriptionId: id!, periodStart: deliveries!.period.start, status }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['subscriptions', id, 'deliveries', offset] }),
  })

  const handleBulk = (status: DeliveryStatus, label: string) => {
    if (!deliveries) return
    if (!window.confirm(`Marcar todos os assinantes deste período como "${label}"?`)) return
    bulkMutation.mutate(status)
  }

  const handleExportCsv = () => {
    if (!deliveries || !subscription) return
    const csv = buildShippingCsv(
      deliveries.subscribers,
      subscription.products.map((p) => p.name),
      formatPeriodLabel(deliveries.period.start),
    )
    const slug =
      subscription.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'plano'
    downloadTextFile(`entregas-${slug}-${deliveries.period.start.slice(0, 7)}.csv`, csv)
  }

  const updateMutation = useMutation({
    mutationFn: (vars: { subscriberId: string; values: UpdateSubscriberRequest }) =>
      updateSubscriber(id!, vars.subscriberId, vars.values),
    onSuccess: async () => {
      setEditing(null)
      await queryClient.invalidateQueries({ queryKey: ['subscriptions', id, 'deliveries', offset] })
    },
  })
  const updateError = updateMutation.isError
    ? getApiErrorMessage(updateMutation.error, 'Erro ao salvar.')
    : null

  const cancelSubscriberMutation = useMutation({
    mutationFn: (subscriberId: string) => cancelSubscriber(id!, subscriberId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['subscriptions', id, 'deliveries', offset] }),
  })

  const handleEdit = (s: DeliverySubscriber) => {
    updateMutation.reset() // drop any stale error from a previous edit
    setEditing(s)
  }

  const handleCancelSubscriber = (s: DeliverySubscriber) => {
    if (!window.confirm(`Cancelar o assinante ${s.name}? Ele deixará de receber novas entregas.`)) return
    cancelSubscriberMutation.mutate(s.id)
  }

  const cancelMutation = useMutation({
    mutationFn: () => cancelSubscription(id!),
    onSuccess: async (result) => {
      if (result.archived) {
        // The plan stays so the owner keeps fulfilling deliveries; refetch both
        // this plan and the list so its "Encerrada" badge shows immediately.
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['subscriptions', id] }),
          queryClient.invalidateQueries({ queryKey: ['subscriptions'], exact: true }),
        ])
        return
      }
      queryClient.removeQueries({ queryKey: ['subscriptions', id] })
      await queryClient.invalidateQueries({ queryKey: ['subscriptions'], exact: true })
      navigate('/subscriptions')
    },
  })

  const handleCancel = () => {
    // An open plan with active subscribers archives; everything else (open with
    // none, or an already-archived plan) deletes.
    const willArchive = !subscription?.archived && (subscription?.active_subscribers ?? 0) > 0
    const message = willArchive
      ? 'Esta assinatura será encerrada: nenhum novo assinante poderá entrar, mas você continuará gerenciando as entregas dos assinantes atuais. Continuar?'
      : 'Tem certeza que deseja excluir esta assinatura? Esta ação não pode ser desfeita.'
    if (!window.confirm(message)) return
    cancelMutation.mutate()
  }

  const cancelError = cancelMutation.isError
    ? getApiErrorMessage(cancelMutation.error, 'Erro ao cancelar.')
    : null

  const period = deliveries?.period
  const isFuture = period?.is_future ?? false

  // An archived plan is already closed; its only remaining destructive action is
  // deletion, allowed once no active subscribers still need fulfilling.
  const archived = subscription?.archived ?? false
  const removeBlocked = archived && (subscription?.active_subscribers ?? 0) > 0
  const removeLabel = archived ? 'Excluir assinatura' : 'Cancelar assinatura'

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

      {subscription?.archived && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm text-amber-300">
          Assinatura encerrada — não aceita novos assinantes. Continue gerenciando as entregas abaixo.
        </div>
      )}

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

      {deliveries && deliveries.subscribers.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-200 transition-colors hover:bg-white/10"
          >
            Exportar lista (CSV)
          </button>
          <div className="grow" />
          <button
            type="button"
            onClick={() => handleBulk('shipped', 'enviado')}
            disabled={isFuture || bulkMutation.isPending}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Marcar todos como enviado
          </button>
          <button
            type="button"
            onClick={() => handleBulk('delivered', 'entregue')}
            disabled={isFuture || bulkMutation.isPending}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Marcar todos como entregue
          </button>
        </div>
      )}

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
              onEdit={() => handleEdit(s)}
              onCancel={() => handleCancelSubscriber(s)}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-10 text-center">
            <p className="text-sm text-gray-500">Nenhum assinante ativo neste período.</p>
          </div>
        )}
      </div>

      {cancelError && <ErrorBanner message={cancelError} className="mt-6" />}

      <button
        onClick={handleCancel}
        disabled={cancelMutation.isPending || isPending || removeBlocked}
        className="mt-8 w-full rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {cancelMutation.isPending ? 'Processando...' : removeLabel}
      </button>
      {removeBlocked && (
        <p className="mt-2 text-center text-xs text-gray-500">
          Conclua as entregas dos assinantes ativos para poder excluir esta assinatura.
        </p>
      )}

      {editing && (
        <SubscriberEditModal
          subscriberName={editing.name}
          initial={{
            name: editing.name,
            phone: editing.phone,
            address: editing.address,
            cep: editing.cep,
            complement: editing.complement,
          }}
          isPending={updateMutation.isPending}
          serverError={updateError}
          onSubmit={(values) => updateMutation.mutate({ subscriberId: editing.id, values })}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
