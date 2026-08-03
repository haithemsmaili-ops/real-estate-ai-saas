import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Lead } from "@/types/lead";

interface RecentLeadsTableProps {
  dict: Dictionary;
  leads: Lead[];
}

const statusVariants: Record<
  Lead["status"],
  "default" | "success" | "warning" | "brand"
> = {
  new: "default",
  qualified: "success",
  pending: "warning",
  disqualified: "default",
  converted: "brand",
};

export function RecentLeadsTable({ dict, leads }: RecentLeadsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.dashboard.recentLeads.title}</CardTitle>
      </CardHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-100 text-start text-surface-500">
              <th className="pb-3 font-medium">{dict.dashboard.recentLeads.name}</th>
              <th className="pb-3 font-medium">{dict.dashboard.recentLeads.source}</th>
              <th className="pb-3 font-medium">{dict.dashboard.recentLeads.score}</th>
              <th className="pb-3 font-medium">{dict.dashboard.recentLeads.status}</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-surface-50 last:border-0"
              >
                <td className="py-3 font-medium text-surface-900">{lead.name}</td>
                <td className="py-3 capitalize text-surface-600">{lead.source}</td>
                <td className="py-3">
                  <span className="font-semibold text-brand-600">
                    {lead.intentScore}
                  </span>
                </td>
                <td className="py-3">
                  <Badge variant={statusVariants[lead.status]}>
                    {lead.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
