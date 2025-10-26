export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold text-primary">Bebida Selada</h1>
        <div className="space-x-6">
          <a href="#como-funciona" className="hover:text-primary">Como funciona</a>
          <a href="#planos" className="hover:text-primary">Planos</a>
          <a href="/auth/login" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition">Entrar</a>
        </div>
      </div>
    </nav>
  );
}