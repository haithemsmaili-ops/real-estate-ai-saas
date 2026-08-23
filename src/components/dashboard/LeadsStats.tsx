import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { TrendingUp, UserCheck, UserPlus, Users } from "lucide-react";

interface LeadsStatsProps {
  dict: Dictionary;
  stats?: {
    totalLeads?: number;
    qualifiedLeads?: number;
    pendingLeads?: number;
    conversionRate?: number;
  };
}

const statConfig = [
  { key: "totalLeads" as const, icon: Users, color: "text-brand-600 bg-brand-50" },
  { key: "qualifiedLeads" as const, icon: UserCheck, color: "text-emerald-600 bg-emerald-50" },
  { key: "pendingLeads" as const, icon: UserPlus, color: "text-amber-600 bg-amber-50" },
  { key: "conversionRate" as const, icon: TrendingUp, color: "text-violet-600 bg-violet-50" },
];

export function LeadsStats({ dict, stats }: LeadsStatsProps) {
  const safeStats = {
    totalLeads: stats?.totalLeads ?? 0,
    qualifiedLeads: stats?.qualifiedLeads ?? 0,
    pendingLeads: stats?.pendingLeads ?? 0,
    conversionRate: stats?.conversionRate ?? 0,
  };

  const values: Record<string, string> = {
    totalLeads: safeStats.totalLeads.toLocaleString(),
    qualifiedLeads: safeStats.qualifiedLeads.toLocaleString(),
    pendingLeads: safeStats.pendingLeads.toLocaleString(),
    conversionRate: `${safeStats.conversionRate}%`,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statConfig.map(({ key, icon: Icon, color }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between mb-0">
            <div>
              <p className="text-sm font-medium text-surface-500">
                {dict?.dashboard?.stats?.[key] || key}
              </p>
              <CardTitle className="mt-1 text-2xl">{values[key]}</CardTitle>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}