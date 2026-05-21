"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth as auth } from "@shared/firebase/auth";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { toast } from "sonner";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast.success("Login realizado com sucesso.");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível entrar. Verifique suas credenciais.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100 sm:px-10">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_auto] lg:items-center">
          <div className="space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400 text-slate-950 shadow-lg shadow-black/20">
              <Building2 className="size-8" />
            </div>

            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">
                Coop Manager
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Acesse sua conta
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-400">
                Entre no painel de gestão de cooperados, unidades e usuários com
                o mesmo padrão monorepo do Vox, mas com identidade visual
                própria.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-8 shadow-lg shadow-black/20 backdrop-blur-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-200"
                >
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", { required: true })}
                  className="mt-2 h-12 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-emerald-400"
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-200"
                >
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password", { required: true })}
                  className="mt-2 h-12 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-emerald-400"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 rounded-2xl bg-emerald-400 text-slate-950 shadow-lg shadow-black/20 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
