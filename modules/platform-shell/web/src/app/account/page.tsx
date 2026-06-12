"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import { ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";

import { PrivateRoute } from "@shared/auth/private-route.js";
import { useAuth } from "@shared/auth/auth-context.js";
import { firebaseAuth } from "@shared/firebase/auth.js";
import {
  AppContainer,
  AppGradient,
  AppHeader,
  AppHeaderInner,
  AppSection,
  AppShell,
} from "@shared/ui/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";

const TOKEN_KEY = "platform-token";

function getPasswordErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password"
    ) {
      return "Senha atual incorreta.";
    }

    if (error.code === "auth/weak-password") {
      return "A nova senha e muito fraca. Use pelo menos 6 caracteres.";
    }

    if (error.code === "auth/too-many-requests") {
      return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";
    }

    if (error.code === "auth/requires-recent-login") {
      return "Por seguranca, entre novamente na plataforma e tente trocar a senha.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel alterar a senha.";
}

function AccountPageContent() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!user?.email) {
      setErrorMessage("Seu perfil nao tem e-mail cadastrado.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("A confirmacao nao confere com a nova senha.");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage("A nova senha precisa ser diferente da senha atual.");
      return;
    }

    setIsSubmitting(true);

    try {
      const authUser =
        firebaseAuth.currentUser?.email === user.email
          ? firebaseAuth.currentUser
          : (
              await signInWithEmailAndPassword(
                firebaseAuth,
                user.email,
                currentPassword,
              )
            ).user;

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );

      await reauthenticateWithCredential(authUser, credential);
      await updatePassword(authUser, newPassword);

      const nextToken = await authUser.getIdToken(true);
      localStorage.setItem(TOKEN_KEY, nextToken);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("Senha alterada com sucesso.");
    } catch (error) {
      setErrorMessage(getPasswordErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell>
      <AppHeader>
        <AppHeaderInner>
          <div className="flex items-center gap-4">
            <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm md:flex">
              <KeyRound className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Minha conta
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Altere sua senha de acesso a plataforma.
              </p>
            </div>
          </div>

          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </AppHeaderInner>
      </AppHeader>

      <AppSection>
        <AppGradient />

        <AppContainer>
          <div className="max-w-2xl">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Alterar senha</CardTitle>
                <CardDescription>
                  Informe a senha atual e defina uma nova senha para continuar
                  acessando todos os modulos pelo login central.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova senha</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        minLength={6}
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirmar nova senha
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        minLength={6}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {errorMessage}
                    </div>
                  )}

                  {successMessage && (
                    <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                      {successMessage}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Alterando..." : "Alterar senha"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </AppContainer>
      </AppSection>
    </AppShell>
  );
}

export default function AccountPage() {
  return (
    <PrivateRoute>
      <AccountPageContent />
    </PrivateRoute>
  );
}
