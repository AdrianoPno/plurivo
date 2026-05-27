import * as React from "react";

import { cn } from "@shared/lib/utils";

export function AppShell({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <main
      className={cn("min-h-screen bg-background text-foreground", className)}
      {...props}
    />
  );
}

export function AppHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

export function AppHeaderInner({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function AppSection({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("relative overflow-hidden", className)} {...props} />
  );
}

export function AppGradient() {
  return (
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_34rem),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.12),transparent_30rem)]" />
  );
}

export function AppContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto max-w-7xl px-6 py-12 md:py-16", className)}
      {...props}
    />
  );
}
