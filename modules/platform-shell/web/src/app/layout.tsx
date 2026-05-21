import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <-- CERTIFIQUE-SE DE QUE ESTA LINHA EXISTE

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recicleiros Platform",
  description: "Shell de autenticação e orquestração",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
