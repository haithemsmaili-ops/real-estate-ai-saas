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
    <section className="relative overflow-hidden bg-surface-950 pt-20 pb-28 sm:pt-28 sm:pb-36">
      {/* Floating Ambient Glow Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 end-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[120px] animate-ambient-float" />
        <div className="absolute top-1/2 start-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px] animate-ambient-float-slow" />
        <div className="absolute -bottom-20 end-0 h-[350px] w-[350px] rounded-full bg-teal-500/10 blur-[90px] animate-ambient-float-reverse" />
        {/* Grid mesh overlay */}
        <div className="absolute inset-0 bg-grid-mesh opacity-50" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
          {/* Pulsing Badge */}
          <Badge variant="brand" className="mb-6 px-4 py-1.5 text-sm bg-emerald-500/10 text-emerald-400 ring-emerald-500/20 border border-emerald-500/20 animate-pulse-ring">
            <Sparkles className="me-1.5 h-3.5 w-3.5" />
            {dict.hero.badge}
          </Badge>

          {/* Gradient Hero Title */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.1] bg-gradient-to-r from-white via-emerald-300 to-white bg-clip-text text-transparent">
            {dict.hero.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-surface-400 sm:text-xl">
            {dict.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={`/${locale}#demo`}>
              <Button size="lg" className="min-w-[200px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-emerald-500/25 animate-glow-pulse">
                {dict.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard`}>
              <Button variant="secondary" size="lg" className="min-w-[200px] bg-white/5 border-white/10 text-surface-300 hover:bg-white/10 hover:text-white backdrop-blur-sm">
                {dict.hero.ctaSecondary}
              </Button>
            </Link>
          </div>

          {/* Stats Row with Gradient Numbers */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
            {Object.entries(dict.hero.stats as Record<string, string>).map(([key, stat]) => (
              <div key={key}>
                <p className="text-xl font-bold sm:text-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
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
