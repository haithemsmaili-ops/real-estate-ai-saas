import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "@/components/ui/Button";
import { Building2 } from "lucide-react";

interface NavbarProps {
  dict: Dictionary;
  locale: Locale;
  showPricing?: boolean;
}

export function Navbar({ dict, locale, showPricing = true }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-200/80 bg-white/85 backdrop-blur-xl shadow-md glass-bg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* رابط الشعار واسم الموقع الذي يعيدك للصفحة الرئيسية حسب اللغة */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-surface-900">
            {siteConfig.name}
          </span>
        </Link>

        {/* روابط التصفح */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href={`/${locale}#features`}
            className="text-sm font-medium text-surface-600 transition-colors hover:text-brand-600"
          >
            {dict.nav.features}
          </Link>

          <Link
            href={showPricing ? `/${locale}#pricing` : `/${locale}/dashboard`}
            className="text-sm font-medium text-surface-600 transition-colors hover:text-brand-600"
          >
            {dict.nav.pricing}
          </Link>

          <Link
            href={`/${locale}/dashboard`}
            className="text-sm font-medium text-surface-600 transition-colors hover:text-brand-600"
          >
            {dict.nav.dashboard}
          </Link>
        </div>

        {/* أزرار اللغة والطلب والمصادقة */}
        <div className="flex items-center gap-3">
          <LanguageToggle locale={locale} />

          {/* تم تعديل الرابط هنا ليدعم اللغة الحالية ديناميكياً */}
          <Link href={`/${locale}/auth/signin`} className="hidden sm:block">
            <Button size="sm" variant="outline">Sign In</Button>
          </Link>

          <Link href={`/${locale}#demo`} className="hidden sm:block">
            <Button size="sm">{dict.nav.requestDemo}</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}