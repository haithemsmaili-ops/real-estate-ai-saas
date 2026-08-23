"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { Send, CheckCircle2, Sparkles } from "lucide-react";

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
    <section id="demo" className="relative overflow-hidden bg-surface-950 py-24 sm:py-32">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-emerald-500/15 blur-[130px] animate-ambient-float" />
        <div className="absolute inset-0 bg-grid-mesh opacity-30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-emerald-950/30 border border-white/15 px-8 py-16 sm:px-16 sm:py-20 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          <div className="relative mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4 animate-pulse-ring">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Demonstration</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-white via-emerald-300 to-white bg-clip-text text-transparent">
              {dict.cta.title}
            </h2>
            <p className="mt-4 text-lg text-surface-300">{dict.cta.subtitle}</p>

            {submitted ? (
              <div className="mt-10 flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-emerald-300 shadow-lg shadow-emerald-500/10 animate-fade-in-scale">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                <p className="text-lg font-bold">{dict.cta.success}</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:justify-center"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.cta.placeholder}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white placeholder:text-surface-400 backdrop-blur-md ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent sm:max-w-sm transition-all"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 animate-glow-pulse"
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
