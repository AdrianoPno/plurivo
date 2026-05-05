"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, BarChart3, Settings, BotMessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Biblioteca", href: "/dashboard", icon: Library },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
      <div className="mb-8 flex items-center gap-2">
        <BotMessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold">Vox Observatory</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
