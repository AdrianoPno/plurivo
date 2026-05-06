import { Metadata } from "next";
import { BotMessageSquare } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | Vox Observatory",
  description: "Acesse sua conta para gerenciar pesquisas.",
};

export default function LoginPage() {
  return (
    <main className="rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
      <div className="space-y-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex size-16 items-center justify-center rounded-3xl bg-white text-[hsl(var(--primary))] shadow-2xl">
            <BotMessageSquare className="size-8" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Bem-vindo de volta
            </h1>

            <p className="text-sm leading-relaxed text-white/70">
              Entre com sua conta para acessar a plataforma Vox Observatory.
            </p>
          </div>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
