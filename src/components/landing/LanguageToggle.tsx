"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  locale: Locale;
}

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isRTL = locale === "ar";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (target: Locale) => {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  };

  return (
    <div className="relative inline-block text-left">
      {/* Button showing globe and current locale code */}
      <button
        ref={buttonRef}
        onClick={toggleOpen}
        className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-2.5 py-1.5 shadow-sm hover:bg-white/10 transition-all"
        aria-haspopup="true"
        aria-expanded={open}
        type="button"
      >
        <Globe className="h-4 w-4 text-emerald-400" aria-hidden />
        <span className="text-sm font-medium text-surface-300">{locale.toUpperCase()}</span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          ref={dropdownRef}
          className={
            "absolute " +
            (isRTL ? "left-0 " : "right-0 ") +
            "mt-2 w-36 origin-top-right rounded-xl bg-surface-900/95 backdrop-blur-xl shadow-2xl border border-white/10 ring-1 ring-emerald-500/10 focus:outline-none z-10"
          }
          onMouseLeave={closeMenu}
        >
          <div className="py-1.5">
            {(Object.keys(localeNames) as Locale[]).map((loc) => (
              <Link
                key={loc}
                href={switchLocale(loc)}
                onClick={closeMenu}
                className={cn(
                  "block px-4 py-2.5 text-sm font-medium transition-all",
                  loc === locale
                    ? "bg-gradient-to-r from-emerald-600/80 to-teal-600/80 text-white"
                    : "text-surface-400 hover:bg-white/5 hover:text-emerald-400"
                )}
                aria-current={loc === locale ? "page" : undefined}
              >
                {localeNames[loc]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
