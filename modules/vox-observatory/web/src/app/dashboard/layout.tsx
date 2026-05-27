import { Sidebar } from "@/components/dashboard/sidebar";
import { SsoTokenHandoff } from "@/components/auth/sso-token-handoff";
import { QueryProvider } from "@/components/providers/query-provider";
import { GlobalSpinner } from "@/components/ui/global-spinner";
import { MODULE_URLS } from "@shared/constants/modules";
import { AuthProvider, PrivateRoute } from "@shared/auth";
import { Toaster } from "@shared/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <SsoTokenHandoff>
        <AuthProvider profileUrl={`${MODULE_URLS.voxObservatory.api}/users/me`}>
          <PrivateRoute redirectTo={`${MODULE_URLS.platformShell.web}/login`}>
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
          </PrivateRoute>
        </AuthProvider>
      </SsoTokenHandoff>
    </QueryProvider>
  );
}
