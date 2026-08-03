import type { Dictionary } from "@/lib/i18n/get-dictionary";
import {
  Bot,
  FileSearch,
  Globe2,
  MessageSquare,
  ScanLine,
  Users,
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
    <section id="features" className="bg-surface-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            {dict.features.title}
          </h2>
          <p className="mt-4 text-lg text-surface-600">
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
                className="group rounded-2xl border border-surface-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/50"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-surface-600">
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
