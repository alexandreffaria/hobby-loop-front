import React, { useState } from "react";

// 1. FIXED: Moved InputGroup OUTSIDE the main component so it doesn't get recreated on every render.
const InputGroup = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6 w-full max-w-sm">
    <h3 className="mb-2 text-center text-sm font-medium text-gray-300">
      {title}
    </h3>
    <div className="border-brand-pink/50 bg-brand-input flex flex-col divide-y divide-gray-800 overflow-hidden rounded-xl border shadow-lg">
      {children}
    </div>
  </div>
);

export function SubscriberCheckout() {
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    zipCode: "",
    complement: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    console.log("Processing Checkout Payload:", checkoutData);
    alert("Pagamento realizado com sucesso!");
  };

  return (
    <div className="bg-brand-bg flex min-h-screen flex-col items-center px-6 py-10 pb-20">
      {/* Header / Product Summary */}
      <h1 className="text-brand-gradient mb-6 text-center text-xl font-black uppercase md:text-2xl">
        Assine e receba
        <br />o ano todo!
      </h1>

      <div className="mb-8 flex w-full max-w-sm flex-col items-center rounded-3xl bg-white p-6 text-center shadow-xl">
        <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Kit Higiene
        </h2>
        <p className="mb-4 text-xs font-bold text-slate-800">
          1 Desodorante 1 sabonete 1 hidratante
        </p>

        <div className="mb-4 flex h-24 w-32 items-center justify-center rounded-xl bg-slate-100">
          <span className="text-3xl">🧴</span>
        </div>

        <p className="text-sm text-gray-500">
          Receba <span className="font-bold text-slate-800">Mensalmente</span>
        </p>
        <p className="text-lg font-medium text-gray-400">
          Por <span className="text-brand-pink font-black">1 ano</span>
        </p>
      </div>

      {/* Personal Information */}
      <InputGroup title="Suas informações">
        {/* 2. FIXED: Added value={checkoutData.name} to make it a Controlled Component */}
        <input
          name="name"
          value={checkoutData.name}
          placeholder="Seu nome"
          onChange={handleInputChange}
          className="w-full bg-transparent p-4 text-sm text-white outline-none placeholder:text-gray-500 focus:bg-white/5"
        />
        <input
          name="phone"
          value={checkoutData.phone}
          placeholder="Telefone"
          onChange={handleInputChange}
          className="w-full bg-transparent p-4 text-sm text-white outline-none placeholder:text-gray-500 focus:bg-white/5"
        />
        <input
          name="email"
          value={checkoutData.email}
          type="email"
          placeholder="E-mail"
          onChange={handleInputChange}
          className="w-full bg-transparent p-4 text-sm text-white outline-none placeholder:text-gray-500 focus:bg-white/5"
        />
      </InputGroup>

      {/* Delivery Address */}
      <InputGroup title="Endereço de recebimento">
        <input
          name="address"
          value={checkoutData.address}
          placeholder="Endereço"
          onChange={handleInputChange}
          className="w-full bg-transparent p-4 text-sm text-white outline-none placeholder:text-gray-500 focus:bg-white/5"
        />
        <input
          name="zipCode"
          value={checkoutData.zipCode}
          placeholder="CEP"
          onChange={handleInputChange}
          className="w-full bg-transparent p-4 text-sm text-white outline-none placeholder:text-gray-500 focus:bg-white/5"
        />
        <input
          name="complement"
          value={checkoutData.complement}
          placeholder="Complemento"
          onChange={handleInputChange}
          className="w-full bg-transparent p-4 text-sm text-white outline-none placeholder:text-gray-500 focus:bg-white/5"
        />
      </InputGroup>

      {/* Plan Summary */}
      <div className="border-brand-pink/60 from-brand-pink/10 hover:bg-brand-pink/20 mb-6 flex w-full max-w-sm cursor-pointer items-center justify-between rounded-xl border bg-linear-to-br to-transparent p-5 shadow-[0_0_20px_rgba(217,59,140,0.15)] transition-all">
        <div>
          <h3 className="text-lg font-bold text-white">Plano Mensal</h3>
          <p className="text-xs text-gray-400">Cobrança mensal.</p>
          <p className="text-xs text-gray-400">Cancele a qualquer momento</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-white">
            R$ 124,00
            <span className="text-xs font-normal text-gray-400">/mês</span>
          </span>
          <span className="text-brand-pink">▼</span>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-8 w-full max-w-sm rounded-xl border border-white/10 bg-[#1a1b22] p-5 shadow-2xl">
        <h3 className="mb-4 text-sm font-bold text-gray-300">
          Detalhes do Pagamento
        </h3>

        <div className="space-y-3">
          <input
            name="cardNumber"
            value={checkoutData.cardNumber}
            placeholder="Número do Cartão"
            onChange={handleInputChange}
            className="focus:border-brand-pink/50 w-full rounded-lg border border-white/5 bg-white/5 p-3 text-sm text-white outline-none placeholder:text-gray-500"
          />

          <div className="flex gap-3">
            <input
              name="cardExpiry"
              value={checkoutData.cardExpiry}
              placeholder="Validade MM/AA"
              onChange={handleInputChange}
              className="focus:border-brand-pink/50 w-full flex-2 rounded-lg border border-white/5 bg-white/5 p-3 text-sm text-white outline-none placeholder:text-gray-500"
            />
            <input
              name="cardCvc"
              value={checkoutData.cardCvc}
              placeholder="CVC"
              onChange={handleInputChange}
              className="focus:border-brand-pink/50 w-full flex-1 rounded-lg border border-white/5 bg-white/5 p-3 text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="bg-brand-pink mt-6 w-full rounded-xl py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(217,59,140,0.4)] transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Realizar pagamento
        </button>
      </div>
    </div>
  );
}
