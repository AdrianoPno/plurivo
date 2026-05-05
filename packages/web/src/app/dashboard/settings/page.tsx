import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta e da aplicação.
        </p>
      </header>

      <Separator />

      <div className="grid gap-6">
        <ProfileForm />
      </div>
    </div>
  );
}
