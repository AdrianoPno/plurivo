"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { cn } from "../utils/cn";

type ServiceState = "checking" | "online" | "offline";

const stateConfig = {
  checking: {
    label: "Verificando",
    icon: LoaderCircle,
    className: "border-border bg-muted text-muted-foreground",
    iconClassName: "animate-spin",
  },
  online: {
    label: "Operacional",
    icon: CircleCheck,
    className: "border-success/25 bg-success/10 text-success",
    iconClassName: "",
  },
  offline: {
    label: "Indisponivel",
    icon: CircleX,
    className: "border-destructive/25 bg-destructive/10 text-destructive",
    iconClassName: "",
  },
} as const;

export function ServiceStatus({
  healthUrl,
  serviceName,
  compact = false,
}: {
  healthUrl: string;
  serviceName: string;
  compact?: boolean;
}) {
  const [state, setState] = useState<ServiceState>("checking");

  const checkHealth = useCallback(async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(healthUrl, {
        cache: "no-store",
        signal: controller.signal,
      });
      setState(response.ok ? "online" : "offline");
    } catch {
      setState("offline");
    } finally {
      window.clearTimeout(timeout);
    }
  }, [healthUrl]);

  useEffect(() => {
    setState("checking");
    void checkHealth();

    const interval = window.setInterval(checkHealth, 60_000);
    window.addEventListener("online", checkHealth);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("online", checkHealth);
    };
  }, [checkHealth]);

  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <span
      role="status"
      title={`${serviceName}: ${config.label}`}
      aria-label={`${serviceName}: ${config.label}`}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold",
        config.className,
      )}
    >
      <Icon className={cn("size-3.5", config.iconClassName)} />
      {!compact && <span>{config.label}</span>}
    </span>
  );
}
