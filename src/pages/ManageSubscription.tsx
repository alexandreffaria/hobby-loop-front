import { useState } from "react";
import { SubscriptionCard } from "../components/SubscriptionCard";

// 1. Strict Typing for the Statuses
type DeliveryStatus = "Em preparação" | "Enviado" | "Entregue";

interface Subscriber {
  id: string;
  name: string;
  duration: string;
  frequency: string;
  status: DeliveryStatus;
  address: string;
}

// 2. The Row Component (Molecule)
// Extracting this keeps the main page clean and allows easy mapping.
function SubscriberRow({ data }: { data: Subscriber }) {
  const statusSteps: DeliveryStatus[] = [
    "Em preparação",
    "Enviado",
    "Entregue",
  ];

  return (
    <div className="flex w-full items-start justify-between border-b border-gray-800 py-6 last:border-0">
      {/* Left Column: Subscriber Info */}
      <div className="flex flex-col justify-center">
        <p className="mb-3 text-sm font-bold tracking-wide text-white uppercase">
          {data.name}
        </p>
        <p className="text-xs font-bold text-white">{data.duration}</p>
        <p className="text-xs font-bold text-white">{data.frequency}</p>
      </div>

      {/* Right Column: Status & Address */}
      <div className="flex flex-col items-end">
        {/* Status Tracker Dots */}
        <div className="mb-4 flex gap-4">
          {statusSteps.map((step) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <span className="text-[8px] font-medium text-white">{step}</span>
              <div
                className={`h-5 w-5 rounded-full shadow-inner ${
                  data.status === step ? "bg-brand-pink" : "bg-[#d9d9d9]"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Address Block */}
        <div className="text-right">
          <p className="mb-1 text-[8px] font-bold tracking-widest text-white uppercase">
            Endereço de entrega
          </p>
          {/* Using whitespace-pre-line to respect the line breaks in the address string */}
          <p className="text-brand-blue max-w-40 text-[10px] leading-relaxed whitespace-pre-line">
            {data.address}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ManageSubscription() {
  // Mock Data
  const [subscribers] = useState<Subscriber[]>([
    {
      id: "1",
      name: "NOME DO ASSINANTE",
      duration: "Por 1 ano",
      frequency: "Mensalmente",
      status: "Enviado",
      address: "Rua Flor de lotus\nN-456 CEP 93893899 FLN",
    },
    {
      id: "2",
      name: "NOME DO ASSINANTE",
      duration: "Por 1 ano",
      frequency: "Mensalmente",
      status: "Entregue",
      address: "Rua Flor de lotus\nN-456 CEP 93893899 FLN",
    },
    {
      id: "3",
      name: "NOME DO ASSINANTE",
      duration: "Por 1 ano",
      frequency: "Mensalmente",
      status: "Em preparação",
      address: "Rua Flor de lotus\nN-456 CEP 93893899 FLN",
    },
  ]);

  return (
    <div className="bg-brand-bg flex min-h-screen w-full flex-col items-center pb-10">
      {/* 1. Header Section */}
      <div className="flex w-full flex-col items-center px-6 pt-10 pb-6">
        <h1 className="text-brand-gradient text-xl font-bold">
          Assinatura kit higiene
        </h1>
        <p className="text-brand-pink mt-1 text-sm font-bold">
          Entrega Mensal- Plano anual
        </p>

        {/* Reusing the Card as a visual anchor */}
        <div className="mt-8 w-full max-w-60">
          <SubscriptionCard
            title="Kit Higiene"
            items="1 Desodorante 1 sabonete 1 hidratante"
            price="78,00"
            duration="1 ano"
            link="www.meulink de assinantes.com.br"
            hideAction={true} // Hides the share button
          />
        </div>
      </div>

      {/* 2. List Header */}
      <div className="flex w-full max-w-md items-center justify-between bg-[#13151b] px-6 py-4">
        <h2 className="text-brand-blue text-lg font-bold">38 assinantes</h2>
        <h2 className="text-brand-blue text-lg font-bold">Entregas</h2>
      </div>

      {/* 3. Subscribers List */}
      <div className="w-full max-w-md bg-[#13151b] px-6">
        {subscribers.map((sub) => (
          <SubscriberRow key={sub.id} data={sub} />
        ))}
      </div>
    </div>
  );
}
