import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale } from "@/lib/i18n/config";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { PricingSection } from "@/components/landing/PricingSection";
import { RequestDemoCTA } from "@/components/landing/RequestDemoCTA";
import Footer from "@/components/landing/Footer";
import { ClientLandingWrapper } from "@/components/landing/ClientLandingWrapper";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : "ar";
  const dict = await getDictionary(locale);

  return (
    <ClientLandingWrapper>
      <Navbar dict={dict} locale={locale} showPricing={true} />
      <main className="flex-1">
        <Hero dict={dict} locale={locale} />
        <FeaturesGrid dict={dict} />
        {/* Showcase & Demo Platform Pricing Section */}
        <PricingSection dict={dict} locale={locale} />
        <RequestDemoCTA dict={dict} />
      </main>
      <Footer dict={dict} />
    </ClientLandingWrapper>
  );
}