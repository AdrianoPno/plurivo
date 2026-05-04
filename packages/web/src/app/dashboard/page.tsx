"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    Cookies.remove("session");
    setUser(null);
    router.replace("/login");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold italic">Vox Observatory</h1>
          <p className="text-sm text-muted-foreground">
            Explorador: {user?.email}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Encerrar Sessão
        </Button>
      </div>

      <main className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Foco em Descobertas e Acervo */}
        <div className="p-6 border rounded-xl bg-card shadow-sm">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Total de Descobertas
          </h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="p-6 border rounded-xl bg-card shadow-sm">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Documentos no Acervo
          </h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="p-6 border rounded-xl bg-card shadow-sm">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Pesquisas Recentes
          </h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </main>

      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Ações do Repositório</h2>
        <div className="flex gap-4">
          <Button>Nova Descoberta</Button>
          <Button variant="secondary">Explorar Biblioteca</Button>
        </div>
      </section>
    </div>
  );
}
