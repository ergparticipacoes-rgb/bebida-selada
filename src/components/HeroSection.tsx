export default function HeroSection() {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-primary to-blue-900 text-white px-6">
      <h1 className="text-4xl md:text-5xl font-bold max-w-3xl mb-4">
        O primeiro sistema nacional de certificação, rastreabilidade e confiança no setor de bebidas.
      </h1>
      <p className="text-lg md:text-xl mb-8 italic">
        A tecnologia que protege criptomoedas agora protege o que você serve.
      </p>
      <div className="space-x-4">
        <a href="/auth/register" className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition">Verificar meu estabelecimento</a>
        <a href="#como-funciona" className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-primary transition">Saiba mais</a>
      </div>
    </section>
  );
}