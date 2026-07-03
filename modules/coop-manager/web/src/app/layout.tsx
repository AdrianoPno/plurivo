import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pessoas e Unidades",
  description: "Gestao de pessoas, cargos, vagas e unidades operacionais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} bg-background text-foreground`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
