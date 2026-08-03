"use client";

import { useState, useEffect } from "react";
import { Check, X, Loader2 } from "lucide-react";

export interface LeadFormData {
  name: string;
  agency: string;
  phone: string;
  city: string;
  plan?: string;
}

export function LeadModal({
  open,
  onClose,
  selectedPlan,
}: {
  open: boolean;
  onClose: () => void;
  selectedPlan?: string;
}) {
  const [form, setForm] = useState<LeadFormData>({
    name: "",
    agency: "",
    phone: "",
    city: "",
    plan: selectedPlan || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        name: "",
        agency: "",
        phone: "",
        city: "",
        plan: selectedPlan || "",
      });
      setSuccess(false);
      setPhoneError("");
      setErrorMessage("");
    }
  }, [open, selectedPlan]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "phone" && phoneError) {
      setPhoneError("");
    }
  };

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, "");
    // Algerian phone numbers: starts with +213 or 0, followed by 5, 6, 7, 8, 9, then 8 digits
    const regex = /^(\+213|0)[5-9]\d{8}$/;
    return regex.test(cleanPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validatePhone(form.phone)) {
      setPhoneError("رقم الهاتف غير صالح. يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0550123456).");
      return;
    }

    setLoading(true);
    try {
      const webhookUrl =
        process.env.NEXT_PUBLIC_N8N_LEAD_WEBHOOK_URL ||
        "http://localhost:5678/webhook/lead";
      const payload = {
        ...form,
        phone: form.phone.replace(/\s+/g, ""),
        plan: selectedPlan || form.plan,
        timestamp: new Date().toISOString(),
      };

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMessage("خطأ في إرسال الطلب. يرجى المحاولة لاحقًا.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 text-right dir-rtl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              تم استلام طلبك بنجاح!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              سيتواصل معك فريقنا خلال 24 ساعة لبدء التجربة المجانية.
            </p>
            <button
              onClick={onClose}
              type="button"
              className="w-full py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
            >
              إغلاق
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                احجز تجربة مجانية
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                يرجى ملء المعلومات أدناه لبدء التجربة.
                {selectedPlan && (
                  <span className="block mt-1 font-semibold text-blue-600 dark:text-blue-400">
                    الخطة المحددة: {selectedPlan}
                  </span>
                )}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="الاسم الكامل"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  اسم الوكالة العقارية
                </label>
                <input
                  type="text"
                  name="agency"
                  required
                  placeholder="اسم الوكالة العقارية"
                  value={form.agency}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  رقم الهاتف (الجزائر)
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="رقم الهاتف (مثال: 0550123456)"
                  value={form.phone}
                  onChange={handleChange}
                  dir="ltr"
                  className={`w-full rounded-xl border ${
                    phoneError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                  } bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 text-right`}
                />
                {phoneError && (
                  <p className="mt-1 text-xs text-red-500">{phoneError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  الولاية / المدينة
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="الولاية"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {selectedPlan && (
                <input type="hidden" name="plan" value={selectedPlan} />
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    "إرسال"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
