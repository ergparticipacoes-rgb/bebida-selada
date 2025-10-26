export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-center py-8 mt-16">
      <h4 className="font-semibold text-white mb-2">Bebida Selada</h4>
      <p className="text-sm">Confiança que você pode brindar.</p>
      <div className="mt-4 space-x-4 text-sm">
        <a href="#" className="hover:underline">Política de Privacidade</a>
        <a href="#" className="hover:underline">Termos de Uso</a>
        <a href="#" className="hover:underline">Contato</a>
      </div>
      <p className="text-xs mt-6">© 2025 Bebida Selada LTDA. Todos os direitos reservados.</p>
    </footer>
  );
}