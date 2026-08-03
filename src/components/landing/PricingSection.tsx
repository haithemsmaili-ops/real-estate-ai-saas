"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { Check, Zap, Crown, ShieldCheck, X, CreditCard } from "lucide-react";

interface PricingProps {
  dict: Dictionary;
  locale: Locale;
}

export function PricingSection({ dict, locale }: PricingProps) {
  // حالة لحفظ الخطة التي ضغط عليها العميل
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      key: "starter",
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      popular: false,
      
    },
    {
      key: "growth",
      icon: <Crown className="w-6 h-6 text-amber-500" />,
      popular: true,
    },
  ];

  // دالة لجلب بيانات الخطة المحددة
  const getSelectedPlanData = () => {
    if (!selectedPlan) return null;
    const plan = plans.find((p) => p.key === selectedPlan);
    const planData = (dict.pricing.plans as any)[selectedPlan];
    return { ...plan, ...planData };
  };

  const activePlan = getSelectedPlanData();

  return (
    <section id="pricing" className="py-24 bg-gray-50/50 dir-rtl relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* الترويسة */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {dict.pricing.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {dict.pricing.subtitle}
          </p>
        </div>

        {/* شبكة الخطط */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch justify-center">
          {plans.filter(p => p.key !== "enterprise").map(({ key, icon, popular }) => {
            const planData = (dict.pricing.plans as any)[key];
            return (
              <div
                key={key}
                className={`relative bg-white glass-bg animate-fade-in-up rounded-3xl p-8 shadow-sm border flex flex-col justify-between transition-all hover:shadow-xl hover:scale-105 transition-transform cursor-pointer ${
                  popular
                    ? "border-blue-600 ring-2 ring-blue-600/20 lg:-translate-y-2"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedPlan(key)} // عند الضغط يتم تفعيل النافذة المنبثقة
              >
                {popular && (
                  <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap">
                    {planData.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{planData.name}</h3>
                    <div className="p-3 bg-gray-50 rounded-2xl">{icon}</div>
                  </div>

                  <div className="flex flex-col gap-2 my-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-gray-950">{planData.setupPrice}</span>
                      <span className="text-gray-500 text-sm font-medium">/ {dict.pricing.setupLabel}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-200">
                      <span className="text-xl font-bold text-blue-600">+{planData.monthlyPrice}</span>
                      <span className="text-gray-600 text-sm">{dict.pricing.monthlyLabel}</span>
                    </div>
                  </div>

                  <ul className="space-y-3.5 pt-4 border-t border-gray-100 mb-8">
                    {planData.valueStack.slice(0, 4).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold text-center transition-all ${
                    popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  {planData.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* النافذة المنبثقة (Modal) مع تأثير Blur */}
      {selectedPlan && activePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* خلفية ضبابية تغطي الشاشة بالكامل */}
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedPlan(null)} // إغلاق عند الضغط على الخلفية
          ></div>

          {/* محتوى النافذة المنبثقة */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* زر الإغلاق */}
            <button 
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-2xl">{activePlan.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{activePlan.name}</h3>
                  {activePlan.badge && (
                    <span className="text-blue-600 text-sm font-semibold">{activePlan.badge}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-blue-900">{activePlan.setupPrice}</span>
                  <span className="text-blue-700 font-medium">/ {dict.pricing.setupLabel}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-blue-100/50">
                  <span className="text-xl font-bold text-blue-600">+{activePlan.monthlyPrice}</span>
                  <span className="text-blue-700 text-sm">{dict.pricing.monthlyLabel}</span>
                </div>
              </div>

              <h4 className="text-lg font-bold text-gray-900 mb-4">ماذا تتضمن هذه الخطة؟</h4>
              <ul className="space-y-3.5 pt-4 border-t border-gray-100 mb-8">
                {activePlan.valueStack.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              {/* Total market value strikethrough */}
              {dict.pricing.marketValue && (
                <p className="text-sm text-gray-400 line-through text-center mb-4">
                  {dict.pricing.marketValue[selectedPlan as keyof typeof dict.pricing.marketValue]}
                </p>
              )}

              {/* زر الدفع النهائي */}
              <button 
                onClick={() => alert("سيتم توجيه العميل لبوابة الدفع هنا...")}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-lg transition-colors shadow-lg"
              >
                <CreditCard className="w-6 h-6" />
                المتابعة لإتمام الدفع الآمن
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}