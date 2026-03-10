import { SubscriptionCard } from "../components/SubscriptionCard";

export function MySubscriptions() {
  // 1. Mock Data: This represents what your Go backend will eventually return
  const subscriptions = [
    {
      id: 1,
      title: "Kit Higiene",
      items: "1 Desodorante | 1 sabonete | 1 hidratante",
      price: "78,00",
      duration: "1 ano",
      link: "www.meulink.de.assinantes.com.br",
    },
    {
      id: 2,
      title: "Kit Higiene",
      items: "1 Desodorante | 1 sabonete | 1 hidratante",
      price: "78,00",
      duration: "1 ano",
      link: "www.meulink.de.assinantes.com.br",
    },
    {
      id: 3,
      title: "Kit Higiene",
      items: "1 Desodorante | 1 sabonete | 1 hidratante",
      price: "78,00",
      duration: "1 ano",
      link: "www.meulink.de.assinantes.com.br",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-brand-gradient mb-10 text-xl font-bold">
        Minhas assinaturas
      </h1>

      {/* 2. Scalable Grid Layout (2 columns on mobile) */}
      <div className="grid w-full max-w-md grid-cols-2 gap-x-4 gap-y-10">
        {subscriptions.map((sub) => (
          <SubscriptionCard
            key={sub.id}
            title={sub.title}
            items={sub.items}
            price={sub.price}
            duration={sub.duration}
            link={sub.link}
          />
        ))}

        {/* Placeholder for the empty slot in your design */}
        <SubscriptionCard
          title=""
          items=""
          price=""
          duration=""
          link=""
          isEmpty
        />
      </div>
    </div>
  );
}
