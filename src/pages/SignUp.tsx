export function SignUp() {
  // A simple array so we don't repeat the <input> code 6 times manually!
  const formFields = [
    { name: "name", placeholder: "Seu nome", type: "text" },
    { name: "company", placeholder: "Sua empresa", type: "text" },
    { name: "cnpj", placeholder: "CNPJ", type: "text" },
    { name: "phone", placeholder: "Telefone", type: "text" },
    { name: "email", placeholder: "E-mail", type: "email" },
    { name: "address", placeholder: "Endereço", type: "text" },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="mb-12 flex flex-col items-center">
        <div className="from-brand-pink to-brand-blue mb-2 h-10 w-10 rounded-full bg-linear-to-tr shadow-lg"></div>
        <span className="text-xs font-bold tracking-widest text-white">
          Hoby Loop
        </span>
      </div>

      <h1 className="text-brand-gradient mb-8 text-xl font-bold">
        Crie sua conta
      </h1>

      {/* divide-y and divide-gray-799 automatically put lines *between* the inputs, but not on the outside */}
      <div className="border-brand-pink/60 bg-brand-input flex w-full flex-col divide-y divide-gray-800 overflow-hidden rounded-xl border shadow-2xl">
        {formFields.map((field) => (
          <input
            key={field.name}
            type={field.type}
            placeholder={field.placeholder}
            // focus:bg-white/5 gives a subtle highlight when the user clicks an input
            className="w-full bg-transparent p-4 text-sm text-gray-200 placeholder-gray-400 transition-colors outline-none focus:bg-white/5"
          />
        ))}
      </div>

      <button className="from-brand-pink to-brand-blue shadow-brand-pink/20 hover:shadow-brand-pink/40 mt-6 w-full rounded-xl bg-linear-to-r py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
        Criar conta
      </button>

      <div className="mt-10">
        <button className="text-brand-blue text-sm transition-all hover:underline">
          Entrar com a conta Google
        </button>
      </div>
    </div>
  );
}
