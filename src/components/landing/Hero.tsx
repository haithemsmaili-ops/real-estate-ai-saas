import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  dict: Dictionary;
  locale: Locale;
}

export function Hero({ dict, locale }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 via-white to-white pt-16 pb-24 sm:pt-24 sm:pb-32 glass-bg animate-fade-in-up">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 end-0 h-[500px] w-[500px] rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute -bottom-20 start-0 h-[400px] w-[400px] rounded-full bg-accent-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="brand" className="mb-6 px-4 py-1.5 text-sm">
            <Sparkles className="me-1.5 h-3.5 w-3.5" />
            {dict.hero.badge}
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-surface-900 sm:text-6xl sm:leading-[1.1]">
            {dict.hero.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-surface-600 sm:text-xl">
            {dict.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={`/${locale}#demo`}>
              <Button size="lg" className="min-w-[200px]">
                {dict.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard`}>
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                {dict.hero.ctaSecondary}
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-surface-200 pt-10">
            {Object.entries(dict.hero.stats).map(([key, stat]) => (
              <div key={key}>
                <p className="text-2xl font-bold text-brand-600 sm:text-3xl">
                  {stat}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
