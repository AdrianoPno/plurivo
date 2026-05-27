"use client";

import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { Button } from "@shared/ui/button";

export function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 px-6 py-4 backdrop-blur-xl sm:px-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute right-1 top-1 size-2 rounded-full bg-primary" />
          </Button>
        </div>
      </div>
    </header>
  );
}
