import { AuthProvider } from "@/components/auth/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Sidebar } from "@/components/dashboard/sidebar";
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
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
        <GlobalSpinner />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryProvider>
  );
}
