import { useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements } from '@stripe/react-stripe-js'
import { getPublicSubscription, paySubscriberCheckout } from '../services/subscriber.service'
import { GradientButton } from '../components/GradientButton'
import { formatCurrency } from '../lib/formatters'
import { getApiErrorMessage } from '../lib/apiError'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
// Without a publishable key the Stripe UI cannot load; the page falls back
// to a demo button that exercises the same (mocked) payment endpoint.
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

interface PayMutation {
  mutate: () => void
  mutateAsync: () => Promise<unknown>
  isPending: boolean
}

function StripeCheckoutForm({ payMutation }: { payMutation: PayMutation }) {
  const elements = useElements()
  const [formError, setFormError] = useState('')
  // Set synchronously before the await below: isPending only flips after
  // mutate() runs, so without this a double-click fires two payments.
  const inFlight = useRef(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!elements || inFlight.current) return
    inFlight.current = true
    setFormError('')

    try {
      const { error } = await elements.submit() // Stripe-side field validation
      if (error) {
        setFormError(error.message ?? 'Verifique os dados do cartão.')
        return
      }
      // MOCK PAYMENT SEAM — with real Stripe this becomes stripe.confirmPayment
      // against a PaymentIntent created by the payments API.
      // Awaited so the in-flight guard covers the whole payment; the
      // mutation's own error state renders the failure message.
      await payMutation.mutateAsync().catch(() => {})
    } finally {
      inFlight.current = false
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement />
      {formError && <p className="mt-3 text-center text-sm text-red-400">{formError}</p>}
      <GradientButton type="submit" disabled={!elements || payMutation.isPending} className="mt-6">
        {payMutation.isPending ? 'Processando...' : 'Realizar pagamento'}
      </GradientButton>
    </form>
  )
}

export function SubscribePayment() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const subscriberId = (location.state as { subscriberId?: string } | null)?.subscriberId

  const {
    data: plan,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['public-subscription', id],
    queryFn: () => getPublicSubscription(id!),
    enabled: !!id,
  })

  const payMutation = useMutation({
    mutationFn: () => paySubscriberCheckout(subscriberId!),
    onSuccess: () => navigate(`/s/${id}/sucesso`, { replace: true }),
  })

  // Refresh/deep link loses the subscriber created on the previous step —
  // send the visitor back to the info form.
  if (!subscriberId) {
    return <Navigate to={`/s/${id}`} replace />
  }

  if (isPending) {
    return (
      <p className="animate-page-enter py-20 text-center text-sm text-gray-400">
        Carregando pagamento…
      </p>
    )
  }

  if (isError || !plan) {
    return (
      <div className="animate-page-enter flex flex-col items-center gap-2 py-20">
        <p className="text-sm text-gray-400">Plano não encontrado.</p>
      </div>
    )
  }

  const payError = payMutation.isError
    ? axios.isAxiosError(payMutation.error) && payMutation.error.response?.status === 409
      ? 'Este e-mail já possui uma assinatura ativa deste plano.'
      : getApiErrorMessage(payMutation.error, 'Não foi possível processar o pagamento. Tente novamente.')
    : null

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center px-6 py-10 pb-20">
      <h1 className="text-brand-gradient mb-6 text-center text-xl font-black uppercase">
        Pagamento
      </h1>

      {/* Plan summary */}
      <div className="border-brand-pink/60 from-brand-pink/10 mb-8 flex w-full items-center justify-between rounded-xl border bg-linear-to-br to-transparent p-5 shadow-[0_0_20px_rgba(217,59,140,0.15)]">
        <div>
          <h2 className="text-lg font-bold text-white">{plan.name}</h2>
          <p className="text-xs text-gray-400">Cobrança mensal.</p>
          <p className="text-xs text-gray-400">Cancele a qualquer momento</p>
        </div>
        <span className="text-xl font-bold text-white">
          R$ {formatCurrency(plan.price_cents)}
          <span className="text-xs font-normal text-gray-400">/mês</span>
        </span>
      </div>

      <div className="mb-4 w-full rounded-xl border border-white/10 bg-[#1a1b22] p-5 shadow-2xl">
        <h3 className="mb-4 text-sm font-bold text-gray-300">Detalhes do Pagamento</h3>

        {stripePromise ? (
          <Elements
            stripe={stripePromise}
            options={{
              mode: 'payment',
              amount: plan.price_cents,
              currency: 'brl',
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#d93b8c',
                  colorBackground: '#1d212a',
                  colorText: '#e5e7eb',
                  borderRadius: '12px',
                },
              },
            }}
          >
            <StripeCheckoutForm payMutation={payMutation} />
          </Elements>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-center text-xs text-gray-500">
              Formulário de cartão indisponível — modo demonstração.
            </p>
            <GradientButton
              onClick={() => payMutation.mutate()}
              disabled={payMutation.isPending}
              className="mt-6"
            >
              {payMutation.isPending ? 'Processando...' : 'Pagar (demonstração)'}
            </GradientButton>
          </div>
        )}

        {payError && <p className="mt-3 text-center text-sm text-red-400">{payError}</p>}
      </div>
    </div>
  )
}
