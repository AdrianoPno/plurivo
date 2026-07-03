"use client";

import { ReactNode } from "react";

import { Sidebar } from "@/components/Sidebar";
import { SsoTokenHandoff } from "@/components/SsoTokenHandoff";
import { AuthProvider, PrivateRoute } from "@shared/auth";
import { MODULE_URLS } from "@shared/constants/modules";
import { TenantProvider } from "@shared/tenant";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SsoTokenHandoff>
      <AuthProvider profileUrl={`${MODULE_URLS.coopManager.api}/auth/me`}>
        <TenantProvider tenantUrl={`${MODULE_URLS.platformShell.api}/tenants/current`}>
        <PrivateRoute redirectTo={`${MODULE_URLS.platformShell.web}/login`}>
          <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="h-screen min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-background">
              <div className="p-6 sm:p-10">{children}</div>
            </main>
          </div>
        </PrivateRoute>
        </TenantProvider>
      </AuthProvider>
    </SsoTokenHandoff>
  );
}
