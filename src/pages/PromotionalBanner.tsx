import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getSubscription } from '../services/subscription.service'
import { BannerArtboard } from '../components/BannerArtboard'
import { BANNER_FORMATS, type BannerFormat } from '../lib/bannerFormats'
import { downloadBanner } from '../lib/downloadBanner'

const PREVIEW_MAX_WIDTH = 420
const PREVIEW_MAX_HEIGHT = 560

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

export function PromotionalBanner() {
  const { id } = useParams<{ id: string }>()
  const bannerRef = useRef<HTMLDivElement>(null)
  const [format, setFormat] = useState<BannerFormat>(BANNER_FORMATS[0])
  const [downloading, setDownloading] = useState(false)
  const [downloadFailed, setDownloadFailed] = useState(false)

  const {
    data: plan,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['subscriptions', id],
    queryFn: () => getSubscription(id!),
    enabled: Boolean(id),
  })

  const previewScale = Math.min(
    PREVIEW_MAX_WIDTH / format.width,
    PREVIEW_MAX_HEIGHT / format.height,
  )

  const handleDownload = async () => {
    if (!bannerRef.current || !plan) return
    setDownloading(true)
    setDownloadFailed(false)
    try {
      await downloadBanner(bannerRef.current, plan.name, format)
    } catch {
      setDownloadFailed(true)
    } finally {
      setDownloading(false)
    }
  }

  if (isPending) {
    return (
      <p className="animate-page-enter py-20 text-center text-sm text-gray-400">
        Carregando banner…
      </p>
    )
  }

  if (isError || !plan) {
    return (
      <div className="animate-page-enter flex flex-col items-center gap-4 py-20">
        <p className="text-sm text-gray-400">Não foi possível carregar o plano.</p>
        <Link to="/subscriptions" className="text-brand-blue text-sm font-bold">
          Voltar para assinaturas
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-page-enter mx-auto flex max-w-3xl flex-col items-center px-6 py-10">
      <h1 className="text-brand-gradient text-center text-3xl font-bold">
        Divulgue seu plano
      </h1>
      <p className="mt-2 text-center text-sm text-gray-400">
        Baixe o banner de <strong className="text-white">{plan.name}</strong> e
        compartilhe onde quiser.
      </p>

      {/* Format chips */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {BANNER_FORMATS.map((f) => (
          <button
            key={f.id}
            aria-pressed={format.id === f.id}
            onClick={() => setFormat(f)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-150 ${
              format.id === f.id
                ? 'bg-brand-pink text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Scaled live preview — the artboard renders at full export size;
          html-to-image captures the inner node, unaffected by this scale */}
      <div
        className="mt-8 overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        style={{
          width: format.width * previewScale,
          height: format.height * previewScale,
        }}
      >
        <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top left' }}>
          <BannerArtboard ref={bannerRef} plan={plan} format={format} />
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="from-brand-pink to-brand-blue mt-8 flex items-center gap-2 rounded-full bg-linear-to-r px-8 py-3 text-sm font-bold text-white shadow-lg transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-50"
      >
        <DownloadIcon />
        {downloading ? 'Gerando imagem…' : 'Baixar banner (PNG)'}
      </button>
      {downloadFailed && (
        <p className="mt-3 text-xs text-red-400">
          Falha ao gerar a imagem. Tente novamente.
        </p>
      )}

      <Link
        to="/subscriptions"
        className="mt-6 text-xs font-bold text-gray-500 hover:text-gray-300"
      >
        ← Voltar para assinaturas
      </Link>
    </div>
  )
}
