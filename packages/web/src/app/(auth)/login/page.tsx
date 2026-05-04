import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Vox Observatory",
  description: "Acesse sua conta para gerenciar pesquisas.",
};

export default function LoginPage() {
  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Vox Observatory</h1>
        <p className="text-sm text-muted-foreground">
          Entre com seu e-mail e senha abaixo
        </p>
      </div>

      <LoginForm />
    </main>
  );
}
