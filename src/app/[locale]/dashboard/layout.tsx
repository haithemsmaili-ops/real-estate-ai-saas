import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale } from "@/lib/i18n/config";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PaymentBanner } from "@/components/dashboard/PaymentBanner";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : "en";
  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-screen bg-surface-50">
      <DashboardSidebar dict={dict} locale={locale} />
      <div className="flex flex-1 flex-col">
        <PaymentBanner />
        <DashboardHeader dict={dict} locale={locale} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
