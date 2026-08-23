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

  // 1. الحصول على جلسة المستخدم الحالية بأمان
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || "";

  // 2. جلب البيانات الحقيقية من قاعدة البيانات مع ضمان مصفوفات فارغة كحد أدنى
  const rawLeads = userEmail ? jsonDb.getLeads(userEmail) || [] : [];
  const rawProperties = userEmail ? jsonDb.getProperties(userEmail) || [] : [];

  // 3. تأمين وتجهيز التواريخ لمنع خطأ toLocaleString
  const userLeads = rawLeads.map((lead: any) => ({
    ...lead,
    createdAt: lead.createdAt ? new Date(lead.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: lead.updatedAt ? new Date(lead.updatedAt).toISOString() : new Date().toISOString(),
  }));

  // 4. حساب الإحصائيات الواقعية مع الحماية
  const totalLeads = userLeads.length;
  const totalProperties = rawProperties.length;
  const qualifiedLeads = userLeads.filter(
    (l: any) => l.status === "qualified" || l.status === "converted"
  ).length;
  const conversionRate =
    totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;

  const realStats = {
    totalLeads: totalLeads || 0,
    totalProperties: totalProperties || 0,
    qualifiedLeads: qualifiedLeads || 0,
    conversionRate: Math.round(conversionRate) || 0,
  };

  // 5. جلب حالة القنوات مع الحماية من القيم الفارغة
  let channelStatuses: Array<{ channel: string; connected: boolean }> = [];
  try {
    const rawStatuses = omnichannelService.getChannelStatuses();
    if (Array.isArray(rawStatuses)) {
      channelStatuses = rawStatuses.map((ch) => ({
        channel: ch.channel,
        connected: Boolean(ch.connected),
      }));
    }
  } catch (err) {
    console.error("Error fetching channel statuses:", err);
  }

  return (
    <div className="space-y-6">
      <LeadsStats dict={dict} stats={realStats as any} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChannelStatusCard
          dict={dict}
          channels={
            (channelStatuses.length ? channelStatuses : mockChannelStatuses) as any
          }
        />
        <RecentLeadsTable dict={dict} leads={userLeads as any} />
      </div>
    </div>
  );
}