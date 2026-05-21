"use client";

import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { Button } from "@shared/ui/button";

export function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-4 sm:px-10 backdrop-blur-sm">
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
          <h2 className="text-lg font-semibold text-white">Dashboard</h2>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5 text-slate-400" />
            <span className="absolute right-1 top-1 size-2 rounded-full bg-emerald-400" />
          </Button>
        </div>
      </div>
    </header>
  );
}
