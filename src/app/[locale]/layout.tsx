import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  isValidLocale,
  localeDirection,
  type Locale,
} from "@/lib/i18n/config";
import "../globals.css";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: "PropAI - Real Estate AI SaaS",
  description: "AI-powered SaaS and chatbot service system for real estate agencies",
};

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
    <html lang={locale} dir={dir} className="h-full">
      <body className="h-full bg-surface-50 text-surface-900 antialiased font-sans">
        <div className="flex min-h-full flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}