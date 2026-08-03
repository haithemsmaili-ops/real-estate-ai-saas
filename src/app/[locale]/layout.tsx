import { notFound } from "next/navigation";
import {
  isValidLocale,
  localeDirection,
  type Locale,
} from "@/lib/i18n/config";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dir = localeDirection[locale as Locale];

  return (
    <div lang={locale} dir={dir} className="flex min-h-full flex-1 flex-col">
      {children}
    </div>
  );
}
