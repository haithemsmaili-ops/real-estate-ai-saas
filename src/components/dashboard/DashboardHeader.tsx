"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { LanguageToggle } from "@/components/landing/LanguageToggle";
import { UserMenu } from "@/components/UserMenu";
import { Bell, Building2 } from "lucide-react";

interface DashboardHeaderProps {
  dict: Dictionary;
  locale: Locale;
}

export function DashboardHeader({ dict, locale }: DashboardHeaderProps) {
  const pathname = usePathname();

  // تحديد اللغة الحالية بدقة لضمان تحويل صحيح للصفحة الرئيسية
  const currentLang = (locale || pathname.split("/")[1] || "ar") as Locale;
  const homePath = `/${currentLang}`;

  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-200 bg-white px-6">
      <div className="flex items-center gap-6">
        {/* رابط اللوجو والاسم للعودة للصفحة الرئيسية */}
        <Link
          href={homePath}
          className="flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer group"
          title="العودة للصفحة الرئيسية"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm transition-colors group-hover:bg-brand-700">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-surface-900 transition-colors group-hover:text-brand-600">
            {siteConfig.name}
          </span>
        </Link>

        <div className="h-6 w-px bg-surface-200 hidden sm:block" />

        <div>
          <h1 className="text-lg font-semibold text-surface-900">
            {dict.dashboard.title}
          </h1>
          <p className="text-xs text-surface-500">{dict.dashboard.welcome}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageToggle locale={locale} />
        <button
          type="button"
          className="relative rounded-xl p-2 text-surface-500 transition-colors hover:bg-surface-50 hover:text-surface-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>

        {/* قائمة حساب المستخدم والرمز التعبيري الديناميكي بدلاً من AG */}
        <UserMenu locale={currentLang} />
      </div>
    </header>
  );
}