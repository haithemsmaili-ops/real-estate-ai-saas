"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";
import {
  Building2,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

interface DashboardSidebarProps {
  dict: Dictionary;
  locale: Locale;
}

const navItems = [
  { key: "overview" as const, icon: LayoutDashboard, href: "" },
  { key: "leads" as const, icon: Users, href: "/leads" },
  { key: "channels" as const, icon: MessageSquare, href: "/channels" },
  { key: "catalog" as const, icon: FileText, href: "/catalog" },
  { key: "documents" as const, icon: FileText, href: "/documents" },
  { key: "settings" as const, icon: Settings, href: "/settings" },
];

export function DashboardSidebar({ dict, locale }: DashboardSidebarProps) {
  const pathname = usePathname();
  const basePath = `/${locale}/dashboard`;

  return (
    <aside className="flex w-64 flex-col border-e border-surface-200 bg-white">
      <div className="flex h-16 items-center gap-2.5 border-b border-surface-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Building2 className="h-4 w-4" />
        </div>
        <span className="font-bold text-surface-900">{siteConfig.name}</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ key, icon: Icon, href }) => {
          const fullHref = `${basePath}${href}`;
          const isActive =
            href === ""
              ? pathname === basePath
              : pathname.startsWith(fullHref);

          return (
            <Link
              key={key}
              href={fullHref}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {dict.dashboard[key]}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
