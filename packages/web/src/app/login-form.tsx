"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebase";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/use-auth-store";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    try {
      // 1. Autenticar com o Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      // 2. Obter o idToken do Firebase
      const idToken = await userCredential.user.getIdToken();

      // 3. Enviar o idToken para o nosso backend
      const response = await api.post("/sessions", { idToken });
      const { token: apiToken } = response.data;

      // 4. Armazenar o token da nossa API
      setToken(apiToken);

      // 5. Buscar o perfil do usuário no nosso backend
      const profileResponse = await api.get("/me");
      setUser(profileResponse.data);

      // 6. Redirecionar para o dashboard
      router.push("/dashboard"); // Vamos criar essa página depois
    } catch (err: any) {
      console.error("Falha no login:", err);
      // Melhora a mensagem de erro para o usuário
      if (err.code === "auth/invalid-credential") {
        setError("E-mail ou senha inválidos.");
      } else {
        setError("Ocorreu um erro ao tentar fazer login. Tente novamente.");
      }
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Acesse o painel do Vox Observatory com suas credenciais.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
