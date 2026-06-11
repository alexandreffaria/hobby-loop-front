import { useState } from 'react'
import { QRCodePlaceholder } from './QRCodePlaceholder'
import { ProductBottlePlaceholder } from './ProductBottlePlaceholder'
import { formatCurrency } from '../lib/formatters'

interface PlanCardProps {
  id: string
  name: string
  description: string
  priceCents: number
  onEdit: () => void
  onManage: () => void
}

function PencilIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

export function PlanCard({ id, name, description, priceCents, onEdit, onManage }: PlanCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Outer dark shell */}
      <div
        className="bg-brand-input relative w-full overflow-hidden rounded-[40px] border border-white/10 shadow-2xl transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={onManage}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onManage()
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Edit button — fades in on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          aria-label="Editar assinatura"
          className={`absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-all duration-200 hover:scale-110 hover:bg-gray-50 ${
            hovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-1 pointer-events-none'
          }`}
        >
          <PencilIcon />
        </button>

        {/* White inner card */}
        <div className="mx-3 mt-3 flex flex-col items-center rounded-[30px] bg-white px-3 py-4 text-center shadow-sm">
          {/* Plan name */}
          <p className="font-bold text-sm uppercase tracking-wider text-gray-400 leading-tight">
            {name}
          </p>

          {/* Description */}
          <p className="mt-0.5 text-[11px] text-gray-400 leading-snug line-clamp-2">
            {description}
          </p>

          {/* Product image placeholder */}
          <div className="mt-3 mb-2 flex items-center justify-center">
            <ProductBottlePlaceholder />
          </div>

          {/* Receba / Por labels */}
          <p className="text-xs text-gray-500 leading-tight">
            Receba <strong className="text-gray-700">Mensalmente</strong>
          </p>
          <p className="text-xs leading-tight text-brand-pink">
            Por <strong>1 ano</strong>
          </p>

          {/* Price banner */}
          <div className="mt-2 w-full rounded-xl bg-gray-100 px-2 py-1.5">
            <p className="text-sm font-extrabold text-gray-800 leading-tight">
              R$ {formatCurrency(priceCents)}{' '}
              <span className="font-normal text-gray-500">ao mês</span>
            </p>
            <p className="text-[8px] font-bold tracking-[0.12em] text-brand-pink uppercase mt-0.5">
              Receba em casa
            </p>
          </div>

          {/* QR code placeholder */}
          <div className="mt-3 text-gray-400">
            <QRCodePlaceholder />
          </div>
        </div>

        {/* Link footer */}
        <p className="text-brand-blue px-4 py-3 text-center font-mono text-[9px] truncate">
          hobbyloop.app/{id}
        </p>
      </div>

      {/* Share button */}
      <button className="flex w-full items-center justify-center gap-1.5 rounded-full bg-blue-600 py-2 text-xs font-bold text-white shadow-lg transition-all duration-150 hover:bg-blue-700 active:scale-95">
        Compartilhar
        <span>✈</span>
      </button>
    </div>
  )
}
