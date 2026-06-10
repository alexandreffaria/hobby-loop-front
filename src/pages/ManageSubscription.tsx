import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { deleteSubscription, getSubscription } from '../services/subscription.service'
import { queryClient } from '../lib/queryClient'
import { formatCurrency } from '../lib/formatters'

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
    ? axios.isAxiosError(deleteMutation.error)
      ? (deleteMutation.error.response?.data?.error ?? 'Erro ao excluir.')
      : 'Erro ao excluir.'
    : null

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

      {isError && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">Não foi possível carregar a assinatura.</p>
        </div>
      )}

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

      <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-8 text-center">
        <p className="text-sm text-gray-500">
          Assinantes aparecem aqui quando alguém se inscrever neste plano.
        </p>
      </div>

      {deleteError && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">{deleteError}</p>
        </div>
      )}

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
