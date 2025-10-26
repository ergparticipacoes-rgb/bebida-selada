export default function CTASection() {
  return (
    <section className="bg-primary text-white text-center py-20 px-6">
      <h2 className="text-3xl font-bold mb-6">Participe do movimento que está mudando o mercado de bebidas no Brasil.</h2>
      <div className="space-x-4">
        <a href="/auth/register" className="px-6 py-3 bg-accent rounded-lg font-semibold hover:bg-white hover:text-primary transition">Cadastrar meu estabelecimento</a>
        <a href="/consulta" className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-primary transition">Consultar autenticidade</a>
      </div>
    </section>
  );
}