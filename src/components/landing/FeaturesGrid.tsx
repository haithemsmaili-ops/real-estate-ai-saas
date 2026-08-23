import type { Dictionary } from "@/lib/i18n/get-dictionary";
import {
  Bot,
  FileSearch,
  Globe2,
  MessageSquare,
  ScanLine,
  Users,
  Sparkles,
} from "lucide-react";

interface FeaturesGridProps {
  dict: Dictionary;
}

const featureIcons = [
  MessageSquare,
  Globe2,
  Bot,
  ScanLine,
  Users,
  FileSearch,
] as const;

const featureKeys = [
  "leadQualifier",
  "omnichannel",
  "ragBot",
  "ocr",
  "multilingual",
  "multiTenant",
] as const;

export function FeaturesGrid({ dict }: FeaturesGridProps) {
  return (
    <section id="features" className="relative overflow-hidden bg-surface-950 py-24 sm:py-32">
      {/* Background Ambient Glows & Grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 start-10 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[130px] animate-ambient-float" />
        <div className="absolute bottom-10 end-10 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[120px] animate-ambient-float-reverse" />
        <div className="absolute inset-0 bg-grid-mesh opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Capabilities</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-white via-emerald-300 to-white bg-clip-text text-transparent">
            {dict.features.title}
          </h2>
          <p className="mt-4 text-lg text-surface-400">
            {dict.features.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureKeys.map((key, i) => {
            const Icon = featureIcons[i];
            const feature = dict.features[key];
            return (
              <div
                key={key}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-emerald-500/40 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-cyan-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-white transition-colors group-hover:text-emerald-300">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-surface-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
