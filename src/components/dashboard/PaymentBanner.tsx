"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Clock, CheckCircle2 } from "lucide-react";

export function PaymentBanner() {
  const { data: session, status } = useSession();
  const [paymentInfo, setPaymentInfo] = useState<{
    hasPaid: boolean;
    paymentTimestamp: number | null;
  } | null>(null);
  const [timeLeftStr, setTimeLeftStr] = useState<string>("");
  const [visible, setVisible] = useState(false);

  // Fetch status on mount or session changes
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/payment-status")
        .then((res) => res.json())
        .then((data) => {
          setPaymentInfo(data);
        })
        .catch((err) => console.error("Error fetching payment status:", err));
    }
  }, [status, session]);

  // Tick the countdown
  useEffect(() => {
    if (!paymentInfo || !paymentInfo.hasPaid || !paymentInfo.paymentTimestamp) {
      setVisible(false);
      return;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - (paymentInfo.paymentTimestamp as number);
      const limit = 24 * 60 * 60 * 1000; // 24 hours in ms
      const remaining = limit - elapsed;

      if (remaining <= 0) {
        setVisible(false);
        clearInterval(timer);
      } else {
        setVisible(true);
        // Format time remaining as HH:MM:SS
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        const pad = (num: number) => String(num).padStart(2, "0");
        setTimeLeftStr(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentInfo]);

  if (!visible) return null;

  return (
    <div className="relative overflow-hidden w-full bg-gradient-to-r from-amber-500 via-brand-500 to-blue-600 p-4 text-white shadow-xl animate-pulse">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-white/10 opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold text-right" dir="rtl">
              سنتواصل معك خلال 24 ساعة القادمة لإكمال الإجراءات
            </p>
            <p className="text-xs text-white/80 text-right" dir="rtl">
              حسابك قيد الإعداد والتفعيل الفوري من قبل الإدارة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-sm font-semibold tracking-wider text-white backdrop-blur-md">
          <Clock className="h-4 w-4 text-amber-300 animate-spin" />
          <span dir="rtl" className="text-xs text-amber-200">الوقت المتبقي لتسليم المشروع:</span>
          <span className="font-mono text-amber-300">{timeLeftStr}</span>
        </div>
      </div>
    </div>
  );
}
