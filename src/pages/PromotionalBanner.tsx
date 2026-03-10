import { QRCodePlaceholder } from "../components/QRCodePlaceholder";

export function PromotionalBanner() {
  return (
    <div className="bg-brand-bg flex min-h-screen flex-col items-center justify-center p-6">
      {/* Outer Dark Container - Rounded Corners */}
      <h1 className="text-brand-gradient mb-12 text-center text-3xl font-bold">
        ASSINE E RECEBA O ANO TODO!
      </h1>
      <div className="relative flex w-full max-w-sm flex-col items-center rounded-[40px] bg-[#1a1b22] pt-4 pb-6 shadow-2xl">
        <div className="border-brand-pink mx-4 flex w-[calc(100%-2rem)] flex-col items-center rounded-[10px] border-2 bg-transparent px-6 py-8 text-center">
          {/* Title & Items */}
          <h2 className="mb-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Kit Higiene
          </h2>
          <p className="mb-8 text-sm font-bold text-gray-200">
            1 Desodorante 1 sabonete 1 hidratante
          </p>

          {/* Product Image Placeholder */}
          <div className="mb-8 flex h-48 w-full flex-col items-center justify-center rounded-2xl bg-white/5 shadow-inner">
            <span className="mb-3 text-5xl">🧴</span>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              Foto do Produto
            </span>
          </div>

          {/* Frequency & Duration */}
          <div className="mb-6">
            <p className="text-sm text-gray-400">
              Receba <span className="font-bold text-white">Mensalmente</span>
            </p>
            <p className="text-xl text-gray-400">
              Por <span className="text-brand-pink font-black">1 ano</span>
            </p>
          </div>

          {/* Price Tag */}
          {/* Using a subtle dark gray background for the price box */}
          <div className="mb-4 w-full rounded-xl bg-white/5 py-4 shadow-sm">
            <p className="text-xl font-bold text-[#d4c5b0]">R$ 78,00 ao mes</p>
          </div>

          {/* Delivery Note */}
          <p className="text-brand-pink mb-8 text-xs font-bold">
            Receba em casa
          </p>

          {/* Reusable QR Code */}
          <div className="mb-2 text-gray-400">
            <QRCodePlaceholder />
          </div>
        </div>

        {/* Link Footer - Outside the pink border! */}
        <div className="mt-6">
          <a
            href="#"
            className="text-xs font-bold text-[#00d0ff] transition-colors hover:text-white hover:underline"
          >
            www.meulink de assinantes.com.br
          </a>
        </div>
      </div>
    </div>
  );
}
