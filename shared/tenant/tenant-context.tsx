"use client";

import { createContext, useContext } from "react";
import type { Tenant } from "../types/tenant";

interface TenantContextValue {
  tenant: Tenant | null;
  isLoading: boolean;
}

export const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenant deve ser usado dentro de TenantProvider.");
  return context;
}
