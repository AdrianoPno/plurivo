import { AuthProvider } from "@/components/auth/auth-provider";
import { Sidebar } from "@/components/dashboard/sidebar";
import { QueryProvider } from "@/components/providers/query-provider";
import { GlobalSpinner } from "@/components/ui/global-spinner";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AuthProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar />

          <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
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
