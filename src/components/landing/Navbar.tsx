"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "@/components/ui/Button";
import { Building2, Menu, X, LayoutDashboard, Sparkles, DollarSign, ArrowLeft, ArrowRight } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

interface NavbarProps {
  dict: Dictionary;
  locale: Locale;
  showPricing?: boolean;
}

export function Navbar({ dict, locale, showPricing = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRtl = locale === "ar";

  // Lock body scroll when mobile menu drawer is open
  useScrollLock(mobileMenuOpen);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-950/80 backdrop-blur-2xl shadow-[0_1px_30px_rgba(0,0,0,0.15)]">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand Name */}
        <Link
          href={`/${locale}`}
          onClick={closeMenu}
          className="flex min-h-[44px] items-center gap-2.5 group cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 transition-shadow group-hover:shadow-emerald-500/40">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
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

        {/* Language, User Menu / Sign In, Request Demo, & Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle locale={locale} />

          {/* User Menu / Sign In Button */}
          <UserMenu locale={locale} />

          <Link href={`/${locale}#demo`} className="hidden sm:block">
            <Button
              size="sm"
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/20 border-0 min-h-[44px] px-4"
            >
              {dict.nav.requestDemo}
            </Button>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-surface-300 transition-colors hover:bg-white/10 hover:text-white md:hidden active:scale-95 cursor-pointer"
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-over Drawer Backdrop & Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={closeMenu}
          />

          {/* Mobile Drawer Panel */}
          <div
            className={`relative z-10 flex w-full flex-col bg-surface-950/95 border-b border-white/15 p-6 shadow-2xl transition-all ${
              isRtl ? "text-right dir-rtl" : "text-left"
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <Link
                href={`/${locale}`}
                onClick={closeMenu}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 text-white">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="font-bold text-white text-lg">{siteConfig.name}</span>
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-white/5 p-2 text-surface-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 py-6">
              <Link
                href={`/${locale}#features`}
                onClick={closeMenu}
                className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-base font-semibold text-surface-200 transition-colors hover:bg-white/10 hover:text-emerald-400"
              >
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <span>{dict.nav.features}</span>
              </Link>

              <Link
                href={showPricing ? `/${locale}#pricing` : `/${locale}/dashboard`}
                onClick={closeMenu}
                className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-base font-semibold text-surface-200 transition-colors hover:bg-white/10 hover:text-emerald-400"
              >
                <DollarSign className="h-5 w-5 text-teal-400" />
                <span>{dict.nav.pricing}</span>
              </Link>

              <Link
                href={`/${locale}/dashboard`}
                onClick={closeMenu}
                className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-base font-semibold text-surface-200 transition-colors hover:bg-white/10 hover:text-emerald-400"
              >
                <LayoutDashboard className="h-5 w-5 text-cyan-400" />
                <span>{dict.nav.dashboard}</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-3">
              <Link
                href={`/${locale}#demo`}
                onClick={closeMenu}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-emerald-500/25 active:scale-98"
              >
                <span>{dict.nav.requestDemo}</span>
                {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}