"use client";

import { ReactNode } from "react";

import { Sidebar } from "@/components/Sidebar";
import { SsoTokenHandoff } from "@/components/SsoTokenHandoff";
import { Topbar } from "@/components/Topbar";
import { AuthProvider, PrivateRoute } from "@shared/auth";
import { MODULE_URLS } from "@shared/constants/modules";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SsoTokenHandoff>
      <AuthProvider profileUrl={`${MODULE_URLS.coopManager.api}/auth/me`}>
        <PrivateRoute redirectTo={`${MODULE_URLS.platformShell.web}/login`}>
          <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
              <Sidebar />
              <div className="flex min-h-screen flex-col border-l border-slate-800 bg-slate-950/90">
                <Topbar />
                <main className="flex-1 p-6 sm:p-10">{children}</main>
              </div>
            </div>
          </div>
        </PrivateRoute>
      </AuthProvider>
    </SsoTokenHandoff>
  );
}
