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
        className="flex items-center gap-1 rounded-xl border border-surface-200 bg-white p-1 shadow-sm hover:bg-surface-50"
        aria-haspopup="true"
        aria-expanded={open}
        type="button"
      >
        <Globe className="h-4 w-4 text-surface-400" aria-hidden />
        <span className="text-sm font-medium text-surface-600">{locale.toUpperCase()}</span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          ref={dropdownRef}
          className={
            "absolute " +
            (isRTL ? "left-0 " : "right-0 ") +
            "mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          }
          onMouseLeave={closeMenu}
        >
          <div className="py-1">
            {(Object.keys(localeNames) as Locale[]).map((loc) => (
              <Link
                key={loc}
                href={switchLocale(loc)}
                onClick={closeMenu}
                className={cn(
                  "block px-4 py-2 text-sm",
                  loc === locale ? "bg-brand-600 text-white" : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
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
