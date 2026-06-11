import React, { useState } from "react";

export function PaymentDetails() {
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-brand-gradient mb-10 text-center text-xl leading-tight font-bold">
        Cobrança da <br /> assinatura
      </h1>

      {/* Main Glass Card Container */}
      <div className="bg-brand-input/80 relative w-full overflow-hidden rounded-[40px] border border-white/10 p-8 shadow-2xl backdrop-blur-md">
        {/* Price Highlight Section */}
        <div className="mb-10 flex flex-col items-center">
          {/* Signatures Badge */}
          <div className="text-brand-bg mb-6 flex flex-col items-center rounded-2xl bg-white p-4 shadow-xl">
            <span className="text-xs font-bold tracking-wider uppercase">
              Até
            </span>
            <span className="text-7xl leading-none font-black italic">4</span>
            <span className="text-xs font-bold">assinaturas</span>
          </div>

          {/* Large Price Display */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">R$</span>
            <span className="text-7xl font-bold tracking-tighter text-white">
              49,90
            </span>
          </div>
        </div>

        {/* Payment Details Form */}
        <div className="space-y-4">
          <h2 className="ml-1 text-sm font-semibold text-gray-300">
            Detalhes do Pagamento
          </h2>

          {/* Card Number */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-1">
            <input
              name="number"
              value={cardData.number}
              placeholder="Número do Cartão"
              className="w-full bg-transparent p-3 text-sm text-white outline-none placeholder:text-gray-500"
              onChange={handleInputChange}
            />
          </div>

          {/* Expiry and CVC Row */}
          <div className="flex gap-3">
            <div className="flex-2 rounded-xl border border-white/10 bg-white/5 p-1">
              <input
                name="expiry"
                value={cardData.expiry}
                placeholder="Validade MM/AA"
                className="w-full bg-transparent p-3 text-sm text-white outline-none placeholder:text-gray-500"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-1">
              <input
                name="cvc"
                value={cardData.cvc}
                placeholder="CVC"
                className="w-full bg-transparent p-3 text-sm text-white outline-none placeholder:text-gray-500"
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* CTA Button — prototype: payment processing not implemented yet.
              Never log card data, even in prototypes. */}
          <button
            type="button"
            className="mt-4 w-full rounded-2xl bg-linear-to-r from-[#e93fc1] to-[#f053cc] py-4 text-base font-bold text-white shadow-[0_0_20px_rgba(233,63,193,0.3)] transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Realizar pagamento
          </button>
        </div>

        {/* Background Glow Effect */}
        <div className="bg-brand-blue/20 absolute -bottom-20 -left-20 h-40 w-40 rounded-full blur-[80px]" />
      </div>
    </div>
  );
}
