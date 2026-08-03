import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { LanguageToggle } from "@/components/landing/LanguageToggle";
import { Bell } from "lucide-react";

interface DashboardHeaderProps {
  dict: Dictionary;
  locale: Locale;
}

export function DashboardHeader({ dict, locale }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-surface-900">
          {dict.dashboard.title}
        </h1>
        <p className="text-sm text-surface-500">{dict.dashboard.welcome}</p>
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
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          AG
        </div>
      </div>
    </header>
  );
}
