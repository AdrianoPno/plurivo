import { Settings } from "lucide-react";

import { ProfileForm } from "./profile-form";

export default function SettingsPage() {
  return (
    <main className="space-y-8 p-6 md:p-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[hsl(var(--primary))] p-8 text-white shadow-2xl shadow-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_35%)]" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm backdrop-blur-sm">
            <Settings className="size-4" />
            Configurações
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">
              Preferências da conta
            </h1>

            <p className="text-base leading-relaxed text-white/75">
              Gerencie seu perfil, permissões e preferências de uso do Vox
              Observatory.
            </p>
          </div>
        </div>
      </section>

      <ProfileForm />
    </main>
  );
}
