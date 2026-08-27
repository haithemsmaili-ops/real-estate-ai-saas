"use client";

import { useState, useEffect } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import {
  Check,
  Zap,
  Crown,
  Building2,
  Sparkles,
  X,
  Info,
  ShieldCheck,
  Gift,
  Tag,
} from "lucide-react";

interface PricingProps {
  dict: Dictionary;
  locale: Locale;
}

export function PricingSection({ dict, locale }: PricingProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const isRTL = locale === "ar";

  const plans = [
    {
      key: "basic",
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      popular: false,
    },
    {
      key: "growth",
      icon: <Crown className="w-6 h-6 text-amber-400" />,
      popular: true,
    },
    {
      key: "premium",
      icon: <Building2 className="w-6 h-6 text-cyan-400" />,
      popular: false,
    },
    {
      key: "enterprise",
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      popular: false,
    },
  ];

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPlan(null);
      }
    };
    if (selectedPlan) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPlan]);

  const getSelectedPlanData = () => {
    if (!selectedPlan) return null;
    const plan = plans.find((p) => p.key === selectedPlan);
    const planData = dict?.pricing?.plans?.[selectedPlan];
    return planData ? { ...plan, ...planData } : null;
  };

  const activePlan = getSelectedPlanData();

  const defaultInfoMsg =
    locale === "ar"
      ? "تم اختيار الخطة! سيقوم فريقنا الفني بإعداد وكالتك وتهيئة نظام الذكاء الاصطناعي المخصص لك خلال 3 أيام عمل عقب الاتفاق في الجلسة التوضيحية."
      : "Plan selected! Our technical team will onboard your agency and configure your custom AI system within 3 business days following your demo agreement.";

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-surface-950 relative overflow-hidden">
      {/* Background Mesh & Floating Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[650px] rounded-full bg-emerald-500/15 blur-[140px] animate-ambient-float" />
        <div className="absolute bottom-10 end-10 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px] animate-ambient-float-slow" />
        <div className="absolute top-10 start-10 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px] animate-ambient-float-reverse" />
        <div className="absolute inset-0 bg-grid-mesh opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4 animate-pulse-ring">
            <Tag className="w-3.5 h-3.5" />
            <span>{dict?.pricing?.saveBadge || (isRTL ? "خصومات الإطلاق المباشرة" : "Launch Discount Showcase")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-300 to-white bg-clip-text text-transparent">
            {dict?.pricing?.title || "Select Your Agency's AI Growth Plan"}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-surface-400">
            {dict?.pricing?.subtitle || "Flexible B2B pricing packages with anchor discounts, performance guarantees, and exclusive bonuses."}
          </p>
        </div>

        {/* 4-Column Grid for Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch justify-center">
          {plans.map(({ key, icon, popular }) => {
            const planData = dict?.pricing?.plans?.[key];
            if (!planData) return null;

            return (
              <div
                key={key}
                className={`relative bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer ${
                  popular
                    ? "border-emerald-500/80 ring-2 ring-emerald-500/40 lg:-translate-y-3 shadow-emerald-500/20 bg-white/[0.07]"
                    : "border-white/10 hover:border-emerald-500/40 hover:shadow-emerald-500/10 hover:bg-white/[0.06]"
                }`}
                onClick={() => setSelectedPlan(key)}
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-emerald-500/30 whitespace-nowrap animate-pulse-ring">
                    {planData.badge || (isRTL ? "الأكثر إقبالاً 🚀" : "Most Popular 🚀")}
                  </div>
                )}

                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-extrabold text-white">{planData.name}</h3>
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-2xl">{icon}</div>
                  </div>

                  {/* Struck-through Anchor Pricing & Launch Price Box */}
                  <div className="my-4 p-4 rounded-2xl bg-gradient-to-br from-white/[0.04] to-emerald-950/20 border border-white/10">
                    {/* Setup Fee */}
                    <div className="flex flex-col mb-2.5 pb-2.5 border-b border-white/10">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-surface-400">
                        {dict?.pricing?.setupLabel || (isRTL ? "رسوم إعداد" : "Setup Fee")}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                          {planData.setupPrice}
                        </span>
                        {planData.anchorSetup && (
                          <span className="line-through decoration-red-400 decoration-2 text-xs font-medium text-surface-400">
                            {planData.anchorSetup}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Monthly Retainer Fee */}
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-surface-400">
                        {dict?.pricing?.monthlyLabel || (isRTL ? "اشتراك شهري" : "Monthly Retainer")}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xl font-bold text-white">
                          {planData.monthlyPrice}
                        </span>
                        {planData.anchorMonthly && (
                          <span className="line-through decoration-red-400 decoration-2 text-xs font-medium text-surface-400">
                            {planData.anchorMonthly}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Guarantees Badge if exists */}
                  {planData.guarantee && (
                    <div className="mb-3.5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-start gap-2.5 shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{planData.guarantee}</span>
                    </div>
                  )}

                  {/* Free Bonuses if exist */}
                  {planData.bonuses && planData.bonuses.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {planData.bonuses.map((bonus: string, bIdx: number) => (
                        <div
                          key={bIdx}
                          className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-start gap-2.5 shadow-sm"
                        >
                          <Gift className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{bonus}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 pt-3 border-t border-white/10 mb-6">
                    {planData.valueStack?.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-surface-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(key);
                  }}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-center transition-all cursor-pointer ${
                    popular
                      ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-emerald-500/40"
                  }`}
                >
                  {planData.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal with Obsidian Glass Styling */}
      {selectedPlan && activePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
            onClick={() => setSelectedPlan(null)}
          />

          <div className="relative bg-surface-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.7)] w-full max-w-2xl overflow-y-auto max-h-[90vh] animate-fade-in-scale z-10 my-auto border border-white/15">
            {/* Ambient inner glow */}
            <div className="pointer-events-none absolute -top-20 end-0 h-64 w-64 rounded-full bg-emerald-500/20 blur-[90px]" />

            {/* Close Button */}
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 end-4 p-2 text-surface-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 sm:p-10 relative">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">{activePlan.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-white">{activePlan.name}</h3>
                    {activePlan.badge && (
                      <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                        {activePlan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-surface-400 mt-0.5">
                    {dict?.pricing?.modalSubtitle || (isRTL ? "تفاصيل الخطة لتقديم عروض المبيعات" : "Full feature details for sales presentation")}
                  </p>
                </div>
              </div>

              {/* Price breakdown box with Anchor Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-5 bg-gradient-to-br from-white/[0.04] to-emerald-950/30 rounded-2xl border border-emerald-500/20">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 block mb-1">
                    {dict?.pricing?.setupLabel || (isRTL ? "رسوم الإعداد (مرة واحدة)" : "One-Time Setup Fee")}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                      {activePlan.setupPrice}
                    </span>
                    {activePlan.anchorSetup && (
                      <span className="line-through decoration-red-400 decoration-2 text-sm font-medium text-surface-400">
                        {activePlan.anchorSetup}
                      </span>
                    )}
                  </div>
                </div>

                <div className="sm:border-s sm:border-white/10 sm:ps-6 pt-3 sm:pt-0 border-t border-white/10">
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 block mb-1">
                    {dict?.pricing?.monthlyLabel || (isRTL ? "الاشتراك الشهري" : "Monthly Retainer")}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">
                      {activePlan.monthlyPrice}
                    </span>
                    {activePlan.anchorMonthly && (
                      <span className="line-through decoration-red-400 decoration-2 text-xs font-medium text-surface-400">
                        {activePlan.anchorMonthly}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Guarantees Box in Modal if present */}
              {activePlan.guarantee && (
                <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-sm font-medium flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{activePlan.guarantee}</p>
                </div>
              )}

              {/* Free Bonuses Stack in Modal if present */}
              {activePlan.bonuses && activePlan.bonuses.length > 0 && (
                <div className="mb-6 space-y-2">
                  {activePlan.bonuses.map((bonus: string, bIdx: number) => (
                    <div
                      key={bIdx}
                      className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-sm font-bold flex items-start gap-3"
                    >
                      <Gift className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{bonus}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Feature Value Stack */}
              <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                {dict?.pricing?.modalTitle || (isRTL ? "ماذا تتضمن هذه الخطة؟" : "Included Features & Value Stack")}
              </h4>
              <ul className="space-y-3 p-4 bg-white/[0.03] rounded-2xl border border-white/10 mb-6 max-h-52 overflow-y-auto">
                {activePlan.valueStack?.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-surface-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Informational B2B Message Box */}
              <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 mb-6">
                <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-amber-200 leading-relaxed">
                  {dict?.pricing?.infoMessage || defaultInfoMsg}
                </p>
              </div>

              {/* Confirm / Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 cursor-pointer text-center"
              >
                {dict?.pricing?.confirmButton || (isRTL ? "تأكيد الاختيار وإغلاق المعاينة" : "Confirm Selection & Close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}