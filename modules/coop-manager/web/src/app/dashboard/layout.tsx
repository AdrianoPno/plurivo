"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { ProtectedLayout } from "@/components/ProtectedLayout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Sidebar />
          <div className="flex min-h-screen flex-col border-l border-slate-800 bg-slate-950/90">
            <Topbar />
            <main className="flex-1 p-6 sm:p-10">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
