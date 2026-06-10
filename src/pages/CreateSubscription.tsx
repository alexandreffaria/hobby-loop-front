import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { listProducts } from '../services/product.service'
import { createSubscription } from '../services/subscription.service'
import type { CreateSubscriptionRequest } from '../services/subscription.service'
import { queryClient } from '../lib/queryClient'
import { parsePriceCents } from '../lib/formatters'

export function CreateSubscription() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [priceStr, setPriceStr] = useState('')
  const [clientError, setClientError] = useState('')

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: listProducts,
  })

  const mutation = useMutation({
    mutationFn: (vars: CreateSubscriptionRequest) => createSubscription(vars),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      navigate('/subscriptions')
    },
  })

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
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

    mutation.mutate({
      name: name.trim(),
      description: description.trim(),
      price_cents: priceCents,
      product_ids: selectedIds,
    })
  }

  const serverError = mutation.isError
    ? axios.isAxiosError(mutation.error)
      ? (mutation.error.response?.data?.error ?? 'Erro ao salvar assinatura.')
      : 'Erro ao salvar assinatura.'
    : null

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-16 pt-10 sm:px-6">
      {/* Header */}
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

      {/* Form card */}
      <div className="bg-brand-input overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        {/* Name */}
        <div className="border-b border-white/5 px-5 py-4">
          <label className="mb-1.5 block text-[11px] font-medium tracking-widest text-gray-500 uppercase">
            Nome da assinatura
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Kit higiene mensal"
            className="w-full bg-transparent text-sm text-white placeholder-gray-600 outline-none"
          />
        </div>

        {/* Products */}
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

        {/* Description */}
        <div className="border-b border-white/5 px-5 py-4">
          <label className="mb-1.5 block text-[11px] font-medium tracking-widest text-gray-500 uppercase">
            Descrição
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva brevemente os produtos desta caixa..."
            className="w-full resize-none bg-transparent text-sm text-white placeholder-gray-600 outline-none"
          />
        </div>

        {/* Price */}
        <div className="px-5 py-4">
          <label className="mb-1.5 block text-[11px] font-medium tracking-widest text-gray-500 uppercase">
            Valor da assinatura
          </label>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-500">R$</span>
            <input
              type="text"
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              placeholder="0,00"
              className="w-full bg-transparent text-2xl font-semibold text-white placeholder-gray-700 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Errors */}
      {(clientError || serverError) && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">{clientError || serverError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={mutation.isPending}
        className="from-brand-pink to-brand-blue mt-6 w-full rounded-xl bg-linear-to-r py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? 'Salvando...' : 'Salvar assinatura →'}
      </button>
    </div>
  )
}
