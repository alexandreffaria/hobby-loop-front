import { useRef } from 'react'
import type { DeliveryStatus } from '../services/delivery.service'

const OPTIONS: { value: DeliveryStatus; label: string }[] = [
  { value: 'preparing', label: 'em preparação' },
  { value: 'shipped', label: 'enviado' },
  { value: 'delivered', label: 'entregue' },
]

interface StatusSelectorProps {
  value: DeliveryStatus
  onChange: (status: DeliveryStatus) => void
  disabled?: boolean
}

/**
 * Three-state manual delivery selector (the dots from the reference). Clicking
 * any option sets it directly — reversible. Implements the ARIA radiogroup
 * keyboard pattern: a single tab stop on the checked option, arrow keys move
 * (and select). Disabled for future periods (view only) or while a status
 * change is in flight.
 */
export function StatusSelector({ value, onChange, disabled = false }: StatusSelectorProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const selectedIndex = OPTIONS.findIndex((o) => o.value === value)

  const move = (delta: number) => {
    if (disabled) return
    const next = (selectedIndex + delta + OPTIONS.length) % OPTIONS.length
    onChange(OPTIONS[next].value)
    refs.current[next]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      move(1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      move(-1)
    }
  }

  return (
    <div role="radiogroup" aria-label="Status de entrega" className="flex items-start gap-3 sm:gap-4">
      {OPTIONS.map((opt, i) => {
        const selected = opt.value === value
        return (
          <div key={opt.value} className="flex w-16 flex-col items-center gap-1.5">
            <span
              className={`text-center text-[9px] leading-tight font-semibold tracking-wider uppercase ${
                selected ? 'text-brand-pink' : 'text-gray-500'
              }`}
            >
              {opt.label}
            </span>
            <button
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={opt.label}
              tabIndex={selected ? 0 : -1}
              disabled={disabled}
              onKeyDown={onKeyDown}
              onClick={() => {
                if (!selected) onChange(opt.value)
              }}
              className={[
                'h-7 w-7 rounded-full border-2 transition-all duration-200',
                selected
                  ? 'border-brand-pink bg-brand-pink shadow-[0_0_12px_-2px_rgba(217,59,140,0.8)]'
                  : 'border-white/20 bg-white/5',
                disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:border-white/40 hover:bg-white/10',
              ].join(' ')}
            />
          </div>
        )
      })}
    </div>
  )
}
