import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@shared/auth/auth-provider.js";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plataforma Recicleiros",
  description: "Portal de acesso aos módulos da plataforma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
