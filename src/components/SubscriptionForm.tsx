import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listProducts } from '../services/product.service'
import type { CreateSubscriptionRequest, Subscription } from '../services/subscription.service'
import { parsePriceCents, formatPriceStr } from '../lib/formatters'

interface SubscriptionFormProps {
  /** When provided, the form starts pre-filled (edit mode). Remount with a
      `key` when the subscription changes so the initial state is re-read. */
  initial?: Subscription
  isPending: boolean
  serverError: string | null
  submitLabel: string
  pendingLabel: string
  onSubmit: (values: CreateSubscriptionRequest) => void
}

export function SubscriptionForm({
  initial,
  isPending,
  serverError,
  submitLabel,
  pendingLabel,
  onSubmit,
}: SubscriptionFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => initial?.products.map((p) => p.id) ?? [],
  )
  const [description, setDescription] = useState(initial?.description ?? '')
  const [priceStr, setPriceStr] = useState(initial ? formatPriceStr(initial.price_cents) : '')
  const [clientError, setClientError] = useState('')

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: listProducts,
  })

  const toggleProduct = (pid: string) => {
    setSelectedIds((prev) =>
      prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid],
    )
  }

  const handleSubmit = () => {
    setClientError('')

    if (name.trim() === '') {
      setClientError('Nome é obrigatório.')
      return
    }
    if (selectedIds.length === 0) {
      setClientError('Selecione ao menos um produto.')
      return
    }
    const priceCents = parsePriceCents(priceStr)
    if (isNaN(priceCents) || priceCents <= 0) {
      setClientError('Informe um valor válido.')
      return
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price_cents: priceCents,
      product_ids: selectedIds,
    })
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
      <div className="bg-brand-input overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <div className="border-b border-white/5 px-5 py-4">
          <label htmlFor="subscription-name" className="mb-1.5 block text-[11px] font-medium tracking-widest text-gray-500 uppercase">
            Nome da assinatura
          </label>
          <input
            id="subscription-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Kit higiene mensal"
            className="w-full bg-transparent text-sm text-white placeholder-gray-600 outline-none"
          />
        </div>

        <div className="border-b border-white/5 px-5 py-4">
          <label className="mb-3 block text-[11px] font-medium tracking-widest text-gray-500 uppercase">
            Produtos incluídos
          </label>
          <div className="flex flex-wrap gap-2">
            {products.map((p) => {
              const selected = selectedIds.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProduct(p.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                    selected
                      ? 'border-brand-pink bg-brand-pink/15 text-brand-pink'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-gray-300'
                  }`}
                >
                  {selected && <span className="mr-1">✓</span>}
                  {p.name}
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-b border-white/5 px-5 py-4">
          <label htmlFor="subscription-description" className="mb-1.5 block text-[11px] font-medium tracking-widest text-gray-500 uppercase">
            Descrição
          </label>
          <textarea
            id="subscription-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva brevemente os produtos desta caixa..."
            className="w-full resize-none bg-transparent text-sm text-white placeholder-gray-600 outline-none"
          />
        </div>

        <div className="px-5 py-4">
          <label htmlFor="subscription-price" className="mb-1.5 block text-[11px] font-medium tracking-widest text-gray-500 uppercase">
            Valor da assinatura
          </label>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-500">R$</span>
            <input
              id="subscription-price"
              type="text"
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              placeholder="0,00"
              className="w-full bg-transparent text-2xl font-semibold text-white placeholder-gray-700 outline-none"
            />
          </div>
        </div>
      </div>

      {(clientError || serverError) && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">{clientError || serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="from-brand-pink to-brand-blue mt-6 w-full rounded-xl bg-linear-to-r py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? pendingLabel : submitLabel}
      </button>
    </form>
  )
}
