import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { ProductBottlePlaceholder } from './ProductBottlePlaceholder'
import { formatCurrency } from '../lib/formatters'
import { buildPublicLink, displayPublicLink } from '../lib/publicLink'

const subscriberCountLabel = (n: number) =>
  `${n} ${n === 1 ? 'assinante ativo' : 'assinantes ativos'}`

interface PlanCardProps {
  id: string
  name: string
  description: string
  priceCents: number
  activeSubscribers: number
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

export function PlanCard({
  id,
  name,
  description,
  priceCents,
  activeSubscribers,
  onEdit,
  onManage,
}: PlanCardProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Outer dark shell */}
      <div
        className="group bg-brand-input relative w-full overflow-hidden rounded-[40px] border border-white/10 shadow-2xl transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`Gerenciar ${name}`}
        onClick={onManage}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onManage()
          }
        }}
      >
        {/* Active subscriber count — overlays the white inner card, so it
            needs a solid dark pill to stay legible */}
        <span
          aria-label={subscriberCountLabel(activeSubscribers)}
          title={subscriberCountLabel(activeSubscribers)}
          className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-gray-900/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-md"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5z" />
          </svg>
          {activeSubscribers}
        </span>

        {/* Edit button — revealed on card hover or keyboard focus, so it is
            never an invisible tab stop */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          aria-label="Editar assinatura"
          className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-all duration-200 hover:scale-110 hover:bg-gray-50 opacity-0 -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto focus-visible:opacity-100 focus-visible:translate-y-0 focus-visible:pointer-events-auto"
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

          {/* Scannable link to the public subscribe page */}
          <div className="mt-3">
            <QRCodeSVG value={buildPublicLink(id)} size={64} marginSize={1} />
          </div>
        </div>

        {/* Link footer */}
        <p className="text-brand-blue px-4 py-3 text-center font-mono text-[9px] truncate">
          {displayPublicLink(id)}
        </p>
      </div>

      {/* Share button */}
      <Link
        to={`/banner/${id}`}
        className="flex w-full items-center justify-center gap-1.5 rounded-full bg-blue-600 py-2 text-xs font-bold text-white shadow-lg transition-all duration-150 hover:bg-blue-700 active:scale-95"
      >
        Compartilhar
        <span aria-hidden="true">✈</span>
      </Link>
    </div>
  )
}
