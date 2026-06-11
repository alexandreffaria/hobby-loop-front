import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPublicSubscription } from '../services/subscriber.service'

export function SubscribeSuccess() {
  const { id } = useParams<{ id: string }>()

  const { data: plan } = useQuery({
    queryKey: ['public-subscription', id],
    queryFn: () => getPublicSubscription(id!),
    enabled: !!id,
  })

  return (
    <div className="animate-page-enter mx-auto flex w-full max-w-sm flex-col items-center px-6 py-20 text-center">
      <span className="mb-6 text-6xl" aria-hidden="true">
        🎉
      </span>
      <h1 className="text-brand-gradient mb-4 text-2xl font-black">Assinatura confirmada!</h1>
      {plan ? (
        <p className="text-sm text-gray-400">
          Você receberá <strong className="text-white">{plan.name}</strong> todo mês — fique de
          olho no seu e-mail.
        </p>
      ) : (
        <p className="text-sm text-gray-400">
          Sua assinatura está ativa — fique de olho no seu e-mail.
        </p>
      )}
    </div>
  )
}
