import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getApiErrorMessage } from '../lib/apiError'
import { getSubscription, updateSubscription, type UpdateSubscriptionRequest } from '../services/subscription.service'
import { queryClient } from '../lib/queryClient'
import { ErrorBanner } from '../components/ErrorBanner'
import { SubscriptionForm } from '../components/SubscriptionForm'

export function EditSubscription() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: subscription, isPending, isError } = useQuery({
    queryKey: ['subscriptions', id],
    queryFn: () => getSubscription(id!),
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: (vars: UpdateSubscriptionRequest) => updateSubscription(id!, vars),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      navigate('/subscriptions')
    },
  })

  const serverError = mutation.isError
    ? getApiErrorMessage(mutation.error, 'Erro ao salvar assinatura.')
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
          Editar assinatura
        </h1>
      </div>

      {isPending && (
        <div className="bg-brand-input h-72 w-full animate-pulse rounded-2xl border border-white/5" />
      )}

      {isError && <ErrorBanner message="Não foi possível carregar a assinatura." />}

      {subscription && (
        <SubscriptionForm
          key={subscription.id}
          initial={subscription}
          isPending={mutation.isPending}
          serverError={serverError}
          submitLabel="Salvar alterações →"
          pendingLabel="Salvando..."
          onSubmit={(values) => mutation.mutate(values)}
        />
      )}
    </div>
  )
}
