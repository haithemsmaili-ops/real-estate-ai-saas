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
  { key: "properties" as const, icon: Building2, href: "/properties" },
  { key: "leads" as const, icon: Users, href: "/leads" },
];

export function DashboardSidebar({ dict, locale }: DashboardSidebarProps) {
  const pathname = usePathname();
  const basePath = `/${locale}/dashboard`;

  // ضمان استخراج اللغة من المسار الحقيقي لتجنب مشاكل التوجيه
  const currentLang = locale || pathname.split("/")[1] || "ar";
  const homeUrl = `/${currentLang}`;

  return (
    <aside className="flex w-64 flex-col border-e border-surface-200 bg-white">
      {/* قسم الشعار واسم الموقع المحدث */}
      <div className="flex h-16 items-center border-b border-surface-200 px-6">
        <Link
          href={homeUrl}
          className="group flex items-center gap-2.5 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title="العودة للصفحة الرئيسية"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm transition-colors group-hover:bg-brand-700">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-bold text-surface-900 group-hover:text-brand-600 transition-colors">
            {siteConfig.name}
          </span>
        </Link>
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