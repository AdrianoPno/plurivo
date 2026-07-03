"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../auth/auth-context";
import { TENANT_THEME_PRESETS } from "../design/tenant-themes";
import type { Tenant } from "../types/tenant";
import { TenantContext } from "./tenant-context";

export function TenantProvider({ children, tenantUrl }: { children: ReactNode; tenantUrl: string }) {
  const { user, token } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !token || !user.tenantId) {
      setTenant(null);
      return;
    }

    setIsLoading(true);
    fetch(tenantUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Falha ao carregar organizacao.");
        const result = await response.json();
        setTenant(result.data ?? null);
      })
      .catch(() => setTenant(null))
      .finally(() => setIsLoading(false));
  }, [tenantUrl, token, user]);

  useEffect(() => {
    const root = document.documentElement;
    if (!tenant) {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--ring");
      return;
    }

    const preset = TENANT_THEME_PRESETS[tenant.branding.themePreset];
    root.style.setProperty("--primary", preset.primary);
    root.style.setProperty("--accent", preset.accent);
    root.style.setProperty("--ring", preset.ring);
    document.title = tenant.branding.displayName;
  }, [tenant]);

  return <TenantContext.Provider value={{ tenant, isLoading }}>{children}</TenantContext.Provider>;
}
