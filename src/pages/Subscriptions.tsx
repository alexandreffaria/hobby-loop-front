import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { listSubscriptions } from '../services/subscription.service'
import { PlanCard } from '../components/PlanCard'

function SkeletonCard() {
  return (
    <div className="bg-brand-input h-[420px] w-full animate-pulse rounded-[40px] border border-white/5" />
  )
}

function AddSlotCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-brand-input/50 flex h-full min-h-[380px] w-full flex-col items-center justify-center gap-2 rounded-[40px] border border-white/10 transition-all duration-200 hover:scale-[1.02] hover:border-white/30 hover:bg-brand-input"
      aria-label="Adicionar nova assinatura"
    >
      <span className="text-brand-pink text-5xl font-thin leading-none">+</span>
      <span className="text-xs text-gray-500">Nova assinatura</span>
    </button>
  )
}

export function Subscriptions() {
  const navigate = useNavigate()
  const { data: subscriptions, isPending, isError, refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: listSubscriptions,
  })

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <h1 className="text-brand-gradient mb-10 text-center text-2xl font-bold tracking-tight">
        Minhas assinaturas
      </h1>

      {isError && (
        <div className="flex flex-col items-center gap-3 py-12">
          <p className="text-sm text-gray-400">Erro ao carregar assinaturas.</p>
          <button
            onClick={() => refetch()}
            className="text-brand-blue text-sm underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isError && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {isPending && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {subscriptions?.map((sub) => (
            <PlanCard
              key={sub.id}
              id={sub.id}
              name={sub.name}
              description={sub.description}
              priceCents={sub.price_cents}
              onEdit={() => navigate(`/manage/${sub.id}`)}
            />
          ))}

          {!isPending && (
            <AddSlotCard onClick={() => navigate('/create-subscription')} />
          )}
        </div>
      )}
    </div>
  )
}
