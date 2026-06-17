import { useEffect, useRef, useState } from 'react'
import { ErrorBanner } from './ErrorBanner'
import { GradientButton } from './GradientButton'
import type { UpdateSubscriberRequest } from '../services/subscriber.service'

interface SubscriberEditModalProps {
  subscriberName: string
  initial: UpdateSubscriberRequest
  isPending: boolean
  serverError: string | null
  onSubmit: (values: UpdateSubscriberRequest) => void
  onClose: () => void
}

const FIELDS: { key: keyof UpdateSubscriberRequest; label: string; required: boolean }[] = [
  { key: 'name', label: 'Nome', required: true },
  { key: 'phone', label: 'Telefone', required: true },
  { key: 'address', label: 'Endereço', required: true },
  { key: 'complement', label: 'Complemento', required: false },
  { key: 'cep', label: 'CEP', required: true },
]

export function SubscriberEditModal({
  subscriberName,
  initial,
  isPending,
  serverError,
  onSubmit,
  onClose,
}: SubscriberEditModalProps) {
  const [values, setValues] = useState<UpdateSubscriberRequest>(initial)
  const [clientError, setClientError] = useState('')
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstFieldRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isPending, onClose])

  const set = (key: keyof UpdateSubscriberRequest, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }))

  const handleSubmit = () => {
    setClientError('')
    const trimmed: UpdateSubscriberRequest = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      cep: values.cep.trim(),
      complement: values.complement.trim(),
    }
    const missing = FIELDS.find((f) => f.required && trimmed[f.key] === '')
    if (missing) {
      setClientError(`${missing.label} é obrigatório.`)
      return
    }
    onSubmit(trimmed)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-subscriber-title"
        className="bg-brand-input animate-page-enter w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="min-w-0">
            <h2 id="edit-subscriber-title" className="text-brand-gradient text-base font-bold tracking-tight">
              Editar assinante
            </h2>
            <p className="truncate text-xs text-gray-500">{subscriberName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="px-5 py-4"
        >
          <div className="space-y-3">
            {FIELDS.map((f, i) => (
              <div key={f.key}>
                <label
                  htmlFor={`sub-${f.key}`}
                  className="mb-1 block text-[10px] font-medium tracking-widest text-gray-500 uppercase"
                >
                  {f.label}
                  {!f.required && <span className="ml-1 text-gray-600 normal-case">(opcional)</span>}
                </label>
                <input
                  ref={i === 0 ? firstFieldRef : undefined}
                  id={`sub-${f.key}`}
                  type="text"
                  value={values[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-brand-pink/60"
                />
              </div>
            ))}
          </div>

          {(clientError || serverError) && (
            <ErrorBanner message={clientError || serverError || ''} className="mt-4" />
          )}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50"
            >
              Cancelar
            </button>
            <GradientButton type="submit" disabled={isPending} className="flex-1">
              {isPending ? 'Salvando...' : 'Salvar'}
            </GradientButton>
          </div>
        </form>
      </div>
    </div>
  )
}
