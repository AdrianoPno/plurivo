import "@/app/globals.css";

import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext.js"; // Já estava correto, apenas para confirmar

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
