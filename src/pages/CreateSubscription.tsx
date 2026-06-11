import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { getApiErrorMessage } from '../lib/apiError'
import { createSubscription } from '../services/subscription.service'
import type { CreateSubscriptionRequest } from '../services/subscription.service'
import { queryClient } from '../lib/queryClient'
import { SubscriptionForm } from '../components/SubscriptionForm'

export function CreateSubscription() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (vars: CreateSubscriptionRequest) => createSubscription(vars),
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
          Nova assinatura
        </h1>
      </div>

      <SubscriptionForm
        isPending={mutation.isPending}
        serverError={serverError}
        submitLabel="Salvar assinatura →"
        pendingLabel="Salvando..."
        onSubmit={(values) => mutation.mutate(values)}
      />
    </div>
  )
}
