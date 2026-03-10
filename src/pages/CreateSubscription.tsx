import { useState } from "react";
import { FormField } from "../components/FormField";
import { ProductList } from "../components/ProductList";

export function CreateSubscription() {
  // 1. Centralized State: Scalable for future API integration
  const [formData, setFormData] = useState({
    name: "Kit higiene",
    products: ["Desodorante", "Sabonete liquido", "Óleo hidratante"],
    description: "",
    frequency: "Mensal",
    shippingCost: "R$ 30,00",
    value: "R$ 80,00",
    duration: "1 ano",
  });

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-brand-pink mb-8 text-xl font-bold">
        Crie suas assinatura
      </h1>

      <div className="border-brand-pink/60 bg-brand-input flex w-full flex-col divide-y divide-gray-800 overflow-hidden rounded-xl border shadow-2xl">
        {/* Name Field */}
        <FormField label="Nome da assinatura?">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="text-brand-pink w-full bg-transparent outline-none"
          />
        </FormField>

        {/* Dynamic Product List */}
        <ProductList
          products={formData.products}
          setProducts={(newItems) =>
            setFormData({ ...formData, products: newItems })
          }
        />

        {/* Image Placeholder */}
        <div className="flex flex-col items-center justify-center bg-black/20 py-12">
          <div className="mb-2 flex h-8 w-12 items-center justify-center rounded bg-gray-700">
            <div className="bg-brand-pink h-2 w-2 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-400">Foto dos produtos</span>
        </div>

        {/* Description Field */}
        <FormField label="Descrição breve dos produtos">
          <input
            type="text"
            placeholder="Ex: Kit Higiene com tudo o que você..."
            className="w-full bg-transparent text-sm placeholder-gray-500 outline-none"
          />
        </FormField>

        {/* Frequency Select */}
        <FormField label="Frequências de envio" isSelect>
          <div className="flex w-full items-center justify-between">
            <span>{formData.frequency}</span>
            <span className="text-brand-blue text-[10px]">▼</span>
          </div>
        </FormField>

        {/* Shipping Cost */}
        <FormField label="Custo padrão frete">
          <span className="text-brand-pink">{formData.shippingCost}</span>
        </FormField>

        {/* Subscription Value */}
        <FormField label="Valor da assinatura">
          <span className="text-brand-pink">{formData.value}</span>
        </FormField>

        {/* Duration Select */}
        <FormField
          label="Por quanto tempo deseja entrega esta assinatura?"
          isSelect
        >
          <div className="flex w-full items-center justify-between">
            <span>{formData.duration}</span>
            <span className="text-brand-blue text-[10px]">▼</span>
          </div>
        </FormField>
      </div>
    </div>
  );
}
