import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createSubscriber,
  getPublicSubscription,
  type CreateSubscriberRequest,
} from '../services/subscriber.service'
import { ProductBottlePlaceholder } from '../components/ProductBottlePlaceholder'
import { GradientButton } from '../components/GradientButton'
import { formatCurrency } from '../lib/formatters'
import { getApiErrorMessage } from '../lib/apiError'

const inputClass =
  'w-full bg-transparent p-4 text-sm text-white outline-none placeholder:text-gray-500 focus:bg-white/5'

function InputGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 w-full">
      <h3 className="mb-2 text-center text-sm font-medium text-gray-300">{title}</h3>
      <div className="border-brand-pink/50 bg-brand-input flex flex-col divide-y divide-gray-800 overflow-hidden rounded-xl border shadow-lg">
        {children}
      </div>
    </div>
  )
}

export function SubscribePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [cep, setCep] = useState('')
  const [complement, setComplement] = useState('')
  const [clientError, setClientError] = useState('')

  const {
    data: plan,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['public-subscription', id],
    queryFn: () => getPublicSubscription(id!),
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: (vars: CreateSubscriberRequest) => createSubscriber(id!, vars),
    onSuccess: (subscriber) =>
      navigate(`/s/${id}/pagamento`, { state: { subscriberId: subscriber.id } }),
  })

  const serverError = mutation.isError
    ? getApiErrorMessage(mutation.error, 'Erro ao enviar seus dados.')
    : null

  const handleSubmit = () => {
    setClientError('')
    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim() || !cep.trim()) {
      setClientError('Preencha todos os campos (complemento é opcional).')
      return
    }
    if (!/.+@.+\..+/.test(email.trim())) {
      setClientError('Informe um e-mail válido.')
      return
    }
    mutation.mutate({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      cep: cep.trim(),
      complement: complement.trim(),
    })
  }

  if (isPending) {
    return (
      <p className="animate-page-enter py-20 text-center text-sm text-gray-400">
        Carregando plano…
      </p>
    )
  }

  if (isError || !plan) {
    return (
      <div className="animate-page-enter flex flex-col items-center gap-2 py-20">
        <p className="text-sm text-gray-400">Plano não encontrado.</p>
        <p className="text-xs text-gray-600">Confira o link com quem compartilhou com você.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center px-6 py-10 pb-20">
      <h1 className="text-brand-gradient mb-6 text-center text-xl font-black uppercase md:text-2xl">
        Assine e receba
        <br />o ano todo!
      </h1>

      {/* Plan summary */}
      <div className="mb-8 flex w-full flex-col items-center rounded-3xl bg-white p-6 text-center shadow-xl">
        <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase">{plan.name}</h2>
        <p className="mb-4 text-xs font-bold text-slate-800">
          {plan.products.map((p) => p.name).join(' · ')}
        </p>

        <div className="mb-4 flex h-24 w-32 items-center justify-center rounded-xl bg-slate-100">
          <ProductBottlePlaceholder />
        </div>

        <p className="text-sm text-gray-500">
          Receba <span className="font-bold text-slate-800">Mensalmente</span>
        </p>
        <p className="text-lg font-medium text-gray-400">
          Por <span className="text-brand-pink font-black">1 ano</span>
        </p>
        <p className="mt-2 text-xl font-bold text-slate-800">
          R$ {formatCurrency(plan.price_cents)}
          <span className="text-xs font-normal text-gray-400">/mês</span>
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="flex w-full flex-col items-center"
      >
        <InputGroup title="Suas informações">
          <input
            value={name}
            placeholder="Seu nome"
            aria-label="Seu nome"
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
          <input
            value={phone}
            placeholder="Telefone"
            aria-label="Telefone"
            autoComplete="tel"
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
          <input
            value={email}
            type="email"
            placeholder="E-mail"
            aria-label="E-mail"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </InputGroup>

        <InputGroup title="Endereço de recebimento">
          <input
            value={address}
            placeholder="Endereço"
            aria-label="Endereço"
            autoComplete="street-address"
            onChange={(e) => setAddress(e.target.value)}
            className={inputClass}
          />
          <input
            value={cep}
            placeholder="CEP"
            aria-label="CEP"
            autoComplete="postal-code"
            onChange={(e) => setCep(e.target.value)}
            className={inputClass}
          />
          <input
            value={complement}
            placeholder="Complemento (opcional)"
            aria-label="Complemento"
            onChange={(e) => setComplement(e.target.value)}
            className={inputClass}
          />
        </InputGroup>

        {(clientError || serverError) && (
          <p className="mb-4 text-center text-sm text-red-400">{clientError || serverError}</p>
        )}

        <GradientButton type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Enviando...' : 'Continuar para pagamento →'}
        </GradientButton>
      </form>
    </div>
  )
}
