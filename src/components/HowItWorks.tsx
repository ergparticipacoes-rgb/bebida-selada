export default function HowItWorks() {
  const steps = [
    {
      title: "Envie suas notas fiscais",
      desc: "O sistema valida automaticamente via SEFAZ e blockchain."
    },
    {
      title: "Receba o Selo de Confiança Nacional",
      desc: "Digital e físico, com QR code autenticado."
    },
    {
      title: "Apareça no Mapa Nacional da Confiança",
      desc: "Ganhe credibilidade e novos clientes."
    }
  ];

  return (
    <section id="como-funciona" className="max-w-6xl mx-auto py-20 px-6 text-center">
      <h2 className="text-3xl font-bold text-primary mb-12">Como funciona</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <div key={i} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p className="text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}