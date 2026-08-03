import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

const variants = {
  default: "bg-surface-100 text-surface-700",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  error: "bg-red-50 text-red-700 ring-1 ring-red-200",
  brand: "bg-brand-50 text-brand-700 ring-1 ring-brand-200",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
