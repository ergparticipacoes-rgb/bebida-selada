export default function Plans() {
  const plans = [
    { name: "Gratuito", price: "R$ 0", features: ["Validação básica de notas", "Consulta pública no mapa"] },
    { name: "Profissional", price: "R$ 97/mês", features: ["Análise avançada", "Selo físico e digital", "Relatórios de conformidade"] },
    { name: "Premium", price: "R$ 247/mês", features: ["Destaque no mapa", "Suporte prioritário", "Certificações adicionais"] }
  ];

  return (
    <section id="planos" className="bg-gray-100 py-20 px-6 text-center">
      <h2 className="text-3xl font-bold text-primary mb-12">Planos e Benefícios</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((p, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold mb-2 text-primary">{p.name}</h3>
              <p className="text-3xl font-bold mb-4">{p.price}</p>
              <ul className="text-left text-gray-600 mb-6 space-y-2">
                {p.features.map((f, j) => (
                  <li key={j}>• {f}</li>
                ))}
              </ul>
            </div>
            <a href="/auth/register" className="block mt-auto px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-accent transition">
              Escolher plano
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}