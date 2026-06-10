import { useState } from "react";

interface ProductListProps {
  products: string[];
  setProducts: (newProducts: string[]) => void;
}

export function ProductList({ products, setProducts }: ProductListProps) {
  const [newProduct, setNewProduct] = useState("");

  const handleAddProduct = () => {
    if (newProduct.trim() !== "") {
      // Industry Standard: Create a NEW array. Never use .push() on state!
      setProducts([...products, newProduct]);
      setNewProduct(""); // Clear the input
    }
  };

  return (
    <div className="flex flex-col p-4">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs text-gray-400">
          Quais produtos serão oferecidos?
        </label>

        {/* The Blue Plus Button */}
        <button
          onClick={handleAddProduct}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-lg transition-transform active:scale-95"
        >
          +
        </button>
      </div>

      {/* The Bulleted List */}
      <ul className="mb-4 space-y-1">
        {products.map((item) => (
          <li key={item} className="text-brand-pink flex items-center text-sm">
            <span className="mr-2 text-blue-400">•</span>
            {item}
          </li>
        ))}
      </ul>

      {/* Input for new items */}
      <input
        type="text"
        placeholder="Adicionar item..."
        value={newProduct}
        onChange={(e) => setNewProduct(e.target.value)}
        // UX: Allow pressing 'Enter' to add
        onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
        className="focus:border-brand-blue w-full border-b border-gray-800 bg-transparent pb-1 text-sm text-gray-300 placeholder-gray-600 transition-colors outline-none"
      />
    </div>
  );
}
