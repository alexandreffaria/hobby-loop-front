import React, { useState, useRef } from "react";
import { FormField } from "../components/FormField";
import { ProductList } from "../components/ProductList";

export function CreateSubscription() {
  // 1. Centralized State: All fields are now "Controlled Components"
  const [formData, setFormData] = useState({
    name: "Kit higiene",
    products: ["Desodorante", "Sabonete liquido", "Óleo hidratante"],
    description: "",
    frequency: "Mensal",
    shippingCost: "30,00",
    value: "80,00",
    duration: "1 ano",
    image: null as File | null,
  });

  // 2. Refs for specialized interactions (like triggering hidden file inputs)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. Generic handler for standard text inputs
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Mock logic for dropdowns (cycling options for now)
  const toggleFrequency = () => {
    const options = ["Mensal", "Trimestral", "Semestral"];
    const currentIndex = options.indexOf(formData.frequency);
    const nextIndex = (currentIndex + 1) % options.length;
    setFormData((prev) => ({ ...prev, frequency: options[nextIndex] }));
  };

  const toggleDuration = () => {
    const options = ["6 meses", "1 ano", "2 anos"];
    const currentIndex = options.indexOf(formData.duration);
    const nextIndex = (currentIndex + 1) % options.length;
    setFormData((prev) => ({ ...prev, duration: options[nextIndex] }));
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-brand-gradient mb-8 text-xl font-bold">
        Crie suas assinatura
      </h1>

      <div className="border-brand-pink/60 bg-brand-input flex w-full flex-col divide-y divide-gray-800 overflow-hidden rounded-xl border shadow-2xl">
        {/* Name Field */}
        <FormField label="Nome da assinatura?">
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleTextChange}
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

        {/* 5. Image Upload: Hidden input triggered by the div click */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center bg-black/20 py-12 transition-colors hover:bg-black/40"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFormData((prev) => ({ ...prev, image: file }));
            }}
          />
          <div className="mb-2 flex h-8 w-12 items-center justify-center rounded bg-gray-700">
            <div
              className={`h-2 w-2 rounded-full ${formData.image ? "bg-green-500" : "bg-brand-pink"}`}
            ></div>
          </div>
          <span className="text-xs text-gray-400">
            {formData.image ? formData.image.name : "Foto dos produtos"}
          </span>
        </div>

        {/* Description Field */}
        <FormField label="Descrição breve dos produtos">
          <input
            name="description"
            type="text"
            placeholder="Ex: Kit Higiene com tudo o que você..."
            value={formData.description}
            onChange={handleTextChange}
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
          />
        </FormField>

        {/* Frequency Select (Now Interactive) */}
        <FormField
          label="Frequências de envio"
          isSelect
          onClick={toggleFrequency}
        >
          <div className="flex w-full items-center justify-between">
            <span>{formData.frequency}</span>
            <span className="text-brand-blue text-[10px]">▼</span>
          </div>
        </FormField>

        {/* Shipping Cost (Now Editable) */}
        <FormField label="Custo padrão frete">
          <div className="text-brand-pink flex items-center">
            <span className="mr-1 text-xs">R$</span>
            <input
              name="shippingCost"
              type="text"
              value={formData.shippingCost}
              onChange={handleTextChange}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </FormField>

        {/* Subscription Value (Now Editable) */}
        <FormField label="Valor da assinatura">
          <div className="text-brand-pink flex items-center">
            <span className="mr-1 text-xs">R$</span>
            <input
              name="value"
              type="text"
              value={formData.value}
              onChange={handleTextChange}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </FormField>

        {/* Duration Select (Now Interactive) */}
        <FormField
          label="Por quanto tempo deseja entrega esta assinatura?"
          isSelect
          onClick={toggleDuration}
        >
          <div className="flex w-full items-center justify-between">
            <span>{formData.duration}</span>
            <span className="text-brand-blue text-[10px]">▼</span>
          </div>
        </FormField>
      </div>

      {/* 6. Submit Button: For future Go backend integration */}
      <button
        onClick={() => console.log("Payload for Go backend:", formData)}
        className="from-brand-pink to-brand-blue mt-6 w-full rounded-xl bg-linear-to-r py-4 text-sm font-bold text-white shadow-lg active:scale-95"
      >
        Salvar Assinatura
      </button>
    </div>
  );
}
