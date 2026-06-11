import type { Ref } from 'react'
import { QRCodePlaceholder } from './QRCodePlaceholder'
import { ProductBottlePlaceholder } from './ProductBottlePlaceholder'
import { formatCurrency } from '../lib/formatters'
import type { Subscription } from '../services/subscription.service'
import type { BannerFormat } from '../lib/bannerFormats'

// Compositions are designed at a fixed stage size and uniformly scaled
// to fill the requested format, so every export stays proportionate.
const PORTRAIT_STAGE = { width: 540, height: 960 }
const LANDSCAPE_STAGE = { width: 1200, height: 630 }

interface BannerArtboardProps {
  plan: Subscription
  format: BannerFormat
  ref?: Ref<HTMLDivElement>
}

function BannerHeadline() {
  return (
    <h2 className="text-brand-gradient text-center text-4xl leading-tight font-black tracking-tight">
      ASSINE E RECEBA
      <br />O ANO TODO!
    </h2>
  )
}

function BannerLink({ planId }: { planId: string }) {
  return (
    <p className="font-mono text-sm font-bold text-[#00d0ff]">hobbyloop.app/{planId}</p>
  )
}

function BannerCard({ plan }: { plan: Subscription }) {
  return (
    <div className="border-brand-pink relative w-[400px] rounded-3xl border-4 bg-white px-8 pt-8 pb-14 text-center shadow-2xl">
      <p className="text-xs font-bold tracking-[0.25em] text-gray-400 uppercase">{plan.name}</p>
      <p className="mt-1 text-sm font-bold text-[#1e2b6e]">
        {plan.products.map((p) => p.name).join(' · ')}
      </p>

      {/* Product trio, center bottle taller — echoes the mockup photo */}
      <div className="mt-12 mb-4 flex items-end justify-center gap-7">
        <span className="origin-bottom scale-110">
          <ProductBottlePlaceholder />
        </span>
        <span className="origin-bottom scale-150">
          <ProductBottlePlaceholder />
        </span>
        <span className="origin-bottom scale-110">
          <ProductBottlePlaceholder />
        </span>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Receba <strong className="text-gray-800">Mensalmente</strong>
      </p>
      <p className="text-2xl text-gray-500">
        Por <strong className="text-brand-pink font-black">1 ano</strong>
      </p>

      <div className="mt-4 w-full rounded-xl bg-[#edeaf3] py-3">
        <p className="text-2xl font-extrabold text-[#3d2e63]">
          R$ {formatCurrency(plan.price_cents)}{' '}
          <span className="text-lg font-bold">ao mês</span>
        </p>
      </div>
      <p className="text-brand-pink mt-2 text-xs font-bold">Receba em casa</p>

      {/* QR tile overlapping the card's bottom edge, as in the mockup */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-xl bg-white p-2 text-black shadow-xl">
        <QRCodePlaceholder />
      </div>
    </div>
  )
}

export function BannerArtboard({ plan, format, ref }: BannerArtboardProps) {
  const landscape = format.width > format.height
  const stage = landscape ? LANDSCAPE_STAGE : PORTRAIT_STAGE
  const scale = Math.min(format.width / stage.width, format.height / stage.height)

  return (
    <div
      ref={ref}
      style={{ width: format.width, height: format.height }}
      className="bg-brand-bg flex shrink-0 items-center justify-center overflow-hidden"
    >
      <div style={{ width: stage.width * scale, height: stage.height * scale }}>
        <div
          style={{
            width: stage.width,
            height: stage.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className={
            landscape
              ? 'flex items-center justify-center gap-16'
              : 'flex flex-col items-center justify-center'
          }
        >
          {landscape ? (
            <>
              <div className="flex flex-col items-center gap-10">
                <BannerHeadline />
                <BannerLink planId={plan.id} />
              </div>
              <div className="scale-[0.85]">
                <BannerCard plan={plan} />
              </div>
            </>
          ) : (
            <>
              <BannerHeadline />
              <div className="mt-10">
                <BannerCard plan={plan} />
              </div>
              <div className="mt-20">
                <BannerLink planId={plan.id} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
