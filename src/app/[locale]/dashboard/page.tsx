import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale } from "@/lib/i18n/config";
import { LeadsStats } from "@/components/dashboard/LeadsStats";
import { ChannelStatusCard } from "@/components/dashboard/ChannelStatusCard";
import { RecentLeadsTable } from "@/components/dashboard/RecentLeadsTable";
import {
  mockChannelStatuses,
  mockLeadStats,
  mockLeads,
} from "@/lib/db/mock-data";
import { omnichannelService } from "@/lib/services/communication";

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : "en";
  const dict = await getDictionary(locale);

  // Merge env-based channel status with mock data
  const channelStatuses = omnichannelService.getChannelStatuses().map((ch) => ({
    channel: ch.channel,
    connected: ch.connected,
  }));

  return (
    <div className="space-y-6">
      <LeadsStats dict={dict} stats={mockLeadStats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChannelStatusCard dict={dict} channels={channelStatuses.length ? channelStatuses : mockChannelStatuses} />
        <RecentLeadsTable dict={dict} leads={mockLeads} />
      </div>
    </div>
  );
}
