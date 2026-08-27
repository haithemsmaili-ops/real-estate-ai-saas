import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  isValidLocale,
  localeDirection,
  type Locale,
} from "@/lib/i18n/config";
import { Providers } from "@/components/Providers";
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
    <html lang={locale} dir={dir} className="min-h-screen dark overflow-x-hidden">
      <body className="min-h-screen bg-surface-950 text-surface-100 antialiased font-sans overflow-x-hidden">
        <Providers>
          <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}