"use client";

import { useState, useEffect } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { Check, Zap, Crown, Building2, Sparkles, X, Info, ShieldCheck } from "lucide-react";

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
      icon: <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      popular: false,
    },
    {
      key: "growth",
      icon: <Crown className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      popular: true,
    },
    {
      key: "premium",
      icon: <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      popular: false,
    },
    {
      key: "enterprise",
      icon: <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
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
    <section id="pricing" className="py-24 bg-surface-50/50 dark:bg-surface-900/50 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
            {dict?.pricing?.title || "Choose Your Agency's Growth Plan"}
          </h2>
          <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
            {dict?.pricing?.subtitle || "Flexible B2B packages tailored for high-performing real estate agencies."}
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
                className={`relative bg-white dark:bg-surface-800 rounded-3xl p-6 shadow-sm border flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                  popular
                    ? "border-brand-600 ring-2 ring-brand-600/20 dark:ring-brand-500/30 lg:-translate-y-2"
                    : "border-surface-200 dark:border-surface-700"
                }`}
                onClick={() => setSelectedPlan(key)}
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap">
                    {planData.badge || (isRTL ? "الأكثر إقبالاً 🚀" : "Most Popular 🚀")}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white">{planData.name}</h3>
                    <div className="p-2.5 bg-surface-100 dark:bg-surface-700/60 rounded-2xl">{icon}</div>
                  </div>

                  <div className="flex flex-col gap-1.5 my-4 p-4 bg-surface-50 dark:bg-surface-900/60 rounded-2xl border border-surface-100 dark:border-surface-700/50">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-surface-950 dark:text-white">
                        {planData.setupPrice}
                      </span>
                      <span className="text-surface-500 dark:text-surface-400 text-xs font-medium">
                        / {dict?.pricing?.setupLabel || (isRTL ? "رسوم إعداد" : "Setup Fee")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 pt-2 border-t border-surface-200 dark:border-surface-700/80">
                      <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                        +{planData.monthlyPrice}
                      </span>
                      <span className="text-surface-600 dark:text-surface-400 text-xs">
                        {dict?.pricing?.monthlyLabel || (isRTL ? "اشتراك شهري" : "Monthly Retainer")}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 pt-3 border-t border-surface-100 dark:border-surface-700/50 mb-6">
                    {planData.valueStack?.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-surface-700 dark:text-surface-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-center transition-all cursor-pointer ${
                    popular
                      ? "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/20"
                      : "bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-900 dark:text-white"
                  }`}
                >
                  {planData.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedPlan && activePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-surface-950/60 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedPlan(null)}
          />

          <div className="relative bg-white dark:bg-surface-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10 my-8">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 end-4 p-2 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full transition-colors cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 sm:p-10">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3.5 bg-surface-100 dark:bg-surface-700 rounded-2xl">{activePlan.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-white">{activePlan.name}</h3>
                    {activePlan.badge && (
                      <span className="bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 text-xs font-bold px-2.5 py-1 rounded-full">
                        {activePlan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
                    {dict?.pricing?.modalSubtitle || (isRTL ? "تفاصيل الخطة لتقديم عروض المبيعات" : "Full feature details for sales presentation")}
                  </p>
                </div>
              </div>

              {/* Price breakdown box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-5 bg-brand-50/60 dark:bg-brand-950/40 rounded-2xl border border-brand-100 dark:border-brand-900/60">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-brand-600 dark:text-brand-400 block mb-1">
                    {dict?.pricing?.setupLabel || (isRTL ? "رسوم الإعداد (مرة واحدة)" : "One-Time Setup Fee")}
                  </span>
                  <span className="text-3xl font-extrabold text-brand-950 dark:text-white">
                    {activePlan.setupPrice}
                  </span>
                </div>
                <div className="sm:border-s sm:border-brand-200 dark:sm:border-brand-800 sm:ps-6 pt-3 sm:pt-0 border-t border-brand-200 dark:border-brand-800/60">
                  <span className="text-xs uppercase tracking-wider font-semibold text-brand-600 dark:text-brand-400 block mb-1">
                    {dict?.pricing?.monthlyLabel || (isRTL ? "الاشتراك الشهري" : "Monthly Retainer")}
                  </span>
                  <span className="text-2xl font-bold text-brand-700 dark:text-brand-300">
                    {activePlan.monthlyPrice}
                  </span>
                </div>
              </div>

              {/* Feature Value Stack */}
              <h4 className="text-base font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                {dict?.pricing?.modalTitle || (isRTL ? "ماذا تتضمن هذه الخطة؟" : "Included Features & Value Stack")}
              </h4>
              <ul className="space-y-3 p-4 bg-surface-50 dark:bg-surface-900/50 rounded-2xl border border-surface-100 dark:border-surface-700/50 mb-6 max-h-56 overflow-y-auto">
                {activePlan.valueStack?.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-surface-700 dark:text-surface-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Informational B2B Message Box */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 mb-6">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                  {dict?.pricing?.infoMessage || defaultInfoMsg}
                </p>
              </div>

              {/* Confirm / Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-base transition-colors shadow-lg shadow-brand-600/20 cursor-pointer text-center"
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