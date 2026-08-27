"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";
import {
  Building2,
  LayoutDashboard,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const basePath = `/${locale}/dashboard`;

  const currentLang = locale || pathname.split("/")[1] || "ar";
  const homeUrl = `/${currentLang}`;
  const isRtl = currentLang === "ar";

  useScrollLock(mobileOpen);

  return (
    <>
      {/* Mobile Floating Toggle Button */}
      <div className="md:hidden fixed bottom-4 start-4 z-40">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-2xl bg-brand-600 text-white shadow-xl hover:bg-brand-700 active:scale-95 transition-all p-3 cursor-pointer"
          aria-label="فتح القائمة الجانبية"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-e border-surface-200 bg-white shrink-0">
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
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
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

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          <div
            className={`relative z-10 flex w-72 flex-col bg-white shadow-2xl ${
              isRtl ? "text-right dir-rtl" : "text-left"
            }`}
          >
            <div className="flex h-16 items-center justify-between border-b border-surface-200 px-6">
              <Link
                href={homeUrl}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="font-bold text-surface-900">{siteConfig.name}</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 text-surface-400 hover:text-surface-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
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
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-colors min-h-[48px]",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-surface-700 hover:bg-surface-50"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {dict.dashboard[key]}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}