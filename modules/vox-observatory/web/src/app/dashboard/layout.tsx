import { Sidebar } from "@/components/dashboard/sidebar";
import { SsoTokenHandoff } from "@/components/auth/sso-token-handoff";
import { QueryProvider } from "@/components/providers/query-provider";
import { GlobalSpinner } from "@/components/ui/global-spinner";
import { MODULE_URLS } from "@shared/constants/modules";
import { AuthProvider, PrivateRoute } from "@shared/auth";
import { Toaster } from "@shared/ui/sonner";
import { TenantProvider } from "@shared/tenant";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const voxApiUrl =
    process.env.NEXT_PUBLIC_VOX_OBSERVATORY_API_URL ||
    MODULE_URLS.voxObservatory.api;

  return (
    <QueryProvider>
      <SsoTokenHandoff>
        <AuthProvider profileUrl={`${voxApiUrl}/users/me`}>
          <TenantProvider tenantUrl={`${MODULE_URLS.platformShell.api}/tenants/current`}>
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
          </TenantProvider>
        </AuthProvider>
      </SsoTokenHandoff>
    </QueryProvider>
  );
}
