import { QRCodePlaceholder } from "./QRCodePlaceholder";

interface SubscriptionCardProps {
  title: string;
  items: string;
  price: string;
  duration: string;
  link: string;
  isEmpty?: boolean; // To handle that empty dark card in your design
}

export function SubscriptionCard({
  title,
  items,
  price,
  duration,
  link,
  isEmpty,
}: SubscriptionCardProps) {
  // If it's the empty placeholder card
  if (isEmpty) {
    return (
      <div className="bg-brand-input/50 h-96 w-full rounded-[40px] border border-white/5 shadow-xl" />
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 1. The Main Ticket Body */}
      <div className="bg-brand-input relative flex w-full flex-col overflow-hidden rounded-[40px] border border-white/10 p-4 shadow-2xl">
        {/* White Inner Card */}
        <div className="text-brand-bg flex flex-col items-center rounded-[30px] bg-white p-4 text-center">
          <h3 className="text-[10px] font-bold tracking-tighter uppercase opacity-70">
            {title}
          </h3>
          <p className="mb-4 text-[8px]">{items}</p>

          {/* Mock Product Image */}
          <div className="mb-4 flex h-24 w-full items-center justify-center rounded-lg bg-gray-100">
            <span className="text-[10px] text-gray-400">Image Preview</span>
          </div>

          <p className="text-[10px] leading-tight">
            Receba <span className="font-bold">Mensalmente</span>
          </p>
          <p className="mb-2 text-sm">
            Por <span className="text-brand-pink font-black">{duration}</span>
          </p>

          {/* Price Banner */}
          <div className="w-full rounded-sm bg-gray-100 py-1">
            <p className="text-brand-bg text-[10px] font-bold">
              R$ {price} ao mes
            </p>
            <p className="text-brand-pink text-[7px] font-bold tracking-widest uppercase">
              Receba em casa
            </p>
          </div>

          {/* QR Code Placeholder */}
          <div className="border-brand-bg/10 text-brand-bg mt-4 flex h-20 w-20 items-center justify-center rounded-lg border-2 p-2">
            <QRCodePlaceholder />
          </div>
        </div>

        {/* Link Footer */}
        <span className="text-brand-blue mt-3 truncate text-center font-mono text-[7px]">
          {link}
        </span>
      </div>

      {/* 2. Share Button */}
      <button className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-2 text-xs font-bold text-white shadow-lg transition-transform active:scale-95">
        Compartilhar
        <span className="text-[10px]">✈</span>
      </button>
    </div>
  );
}
