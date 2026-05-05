import { AuthProvider } from "@/components/auth/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Sidebar } from "@/components/dashboard/sidebar";

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
      </AuthProvider>
    </QueryProvider>
  );
}
