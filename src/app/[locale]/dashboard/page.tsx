import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale } from "@/lib/i18n/config";
import { LeadsStats } from "@/components/dashboard/LeadsStats";
import { ChannelStatusCard } from "@/components/dashboard/ChannelStatusCard";
import { RecentLeadsTable } from "@/components/dashboard/RecentLeadsTable";
import { mockChannelStatuses } from "@/lib/db/mock-data";
import { omnichannelService } from "@/lib/services/communication";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { jsonDb } from "@/lib/db/json-db";

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : "en";
  const dict = await getDictionary(locale);

  // 1. الحصول على جلسة المستخدم الحالية
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || "";

  // 2. جلب البيانات الحقيقية من قاعدة البيانات
  const userLeads = jsonDb.getLeads(userEmail);
  const userProperties = jsonDb.getProperties(userEmail);

  // 3. حساب الإحصائيات الواقعية
  const totalLeads = userLeads.length;
  const totalProperties = userProperties.length;
  const qualifiedLeads = userLeads.filter(
    (l) => l.status === "qualified" || l.status === "converted"
  ).length;
  const conversionRate =
    totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;

  // هيكلة الإحصائيات لنقلها لمكون LeadsStats
  const realStats = {
    totalLeads,
    totalProperties,
    qualifiedLeads,
    conversionRate: Math.round(conversionRate),
  };

  // حالة القنوات
  const channelStatuses = omnichannelService.getChannelStatuses().map((ch) => ({
    channel: ch.channel,
    connected: ch.connected,
  }));

  return (
    <div className="space-y-6">
      <LeadsStats dict={dict} stats={realStats as any} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChannelStatusCard
          dict={dict}
          channels={
            channelStatuses.length ? channelStatuses : mockChannelStatuses
          }
        />
        <RecentLeadsTable dict={dict} leads={userLeads as any} />
      </div>
    </div>
  );
}