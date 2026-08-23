import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "@/components/ui/Button";
import { Building2 } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";

interface NavbarProps {
  dict: Dictionary;
  locale: Locale;
  showPricing?: boolean;
}

export function Navbar({ dict, locale, showPricing = true }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-950/80 backdrop-blur-2xl shadow-[0_1px_30px_rgba(0,0,0,0.15)]">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo & Brand Name */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 transition-shadow group-hover:shadow-emerald-500/40">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            {siteConfig.name}
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href={`/${locale}#features`}
            className="text-sm font-medium text-surface-400 transition-colors hover:text-emerald-400"
          >
            {dict.nav.features}
          </Link>

          <Link
            href={showPricing ? `/${locale}#pricing` : `/${locale}/dashboard`}
            className="text-sm font-medium text-surface-400 transition-colors hover:text-emerald-400"
          >
            {dict.nav.pricing}
          </Link>

          <Link
            href={`/${locale}/dashboard`}
            className="text-sm font-medium text-surface-400 transition-colors hover:text-emerald-400"
          >
            {dict.nav.dashboard}
          </Link>
        </div>

        {/* Language, User Menu, CTA */}
        <div className="flex items-center gap-3">
          <LanguageToggle locale={locale} />

          {/* User Menu / Sign In Button */}
          <UserMenu locale={locale} />

          <Link href={`/${locale}#demo`} className="hidden sm:block">
            <Button size="sm" className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/20 border-0">
              {dict.nav.requestDemo}
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}