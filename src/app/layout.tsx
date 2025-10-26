import "./globals.css";

export const metadata = {
  title: "Bebida Selada",
  description:
    "O primeiro sistema nacional de certificação, rastreabilidade e confiança no setor de bebidas."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}