"use client";

import { useEffect } from "react";
import { Blocks } from "lucide-react";
import { useRouter } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { useAuth } from "@shared/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <main className="min-h-screen bg-background">
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_34rem),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.12),transparent_30rem)]" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_28rem]">
          <div className="max-w-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-sm">
              <Blocks className="h-7 w-7" />
            </div>

            <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Plurivo
            </h1>

            <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">
              Gestao modular que evolui com a sua operacao.
            </p>
          </div>

          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader>
              <CardTitle>Entrar</CardTitle>
              <CardDescription>
                Use suas credenciais da plataforma para continuar.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
