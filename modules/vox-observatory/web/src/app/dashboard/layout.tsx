import { AuthProvider } from "@/components/auth/auth-provider";
import { Sidebar } from "@/components/dashboard/sidebar";
import { QueryProvider } from "@/components/providers/query-provider";
import { GlobalSpinner } from "@/components/ui/global-spinner";
import { Toaster } from "@shared/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AuthProvider>
        <div className="flex min-h-screen bg-background text-foreground">
          <Sidebar />

          <main className="h-screen min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-background">
            {children}
          </main>
        </div>

        <GlobalSpinner />

        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            className: "rounded-xl border shadow-lg",
          }}
        />
      </AuthProvider>
    </QueryProvider>
  );
}
