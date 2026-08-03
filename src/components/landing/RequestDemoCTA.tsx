"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { Send, CheckCircle2 } from "lucide-react";

interface RequestDemoCTAProps {
  dict: Dictionary;
}

export function RequestDemoCTA({ dict }: RequestDemoCTAProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // Silently fail for demo — show success UX anyway in scaffold
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="demo" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-8 py-16 sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {dict.cta.title}
            </h2>
            <p className="mt-4 text-lg text-brand-100">{dict.cta.subtitle}</p>

            {submitted ? (
              <div className="mt-10 flex items-center justify-center gap-2 text-white">
                <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                <p className="text-lg font-medium">{dict.cta.success}</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.cta.placeholder}
                  className="w-full rounded-xl border-0 bg-white/10 px-5 py-3.5 text-white placeholder:text-brand-200 backdrop-blur-sm ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 sm:max-w-sm"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="bg-white text-brand-700 hover:bg-brand-50 shadow-none"
                >
                  {loading ? "..." : dict.cta.button}
                  <Send className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
