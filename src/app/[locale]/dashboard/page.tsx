import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale } from "@/lib/i18n/config";
import { LeadsStats } from "@/components/dashboard/LeadsStats";
import { ChannelStatusCard } from "@/components/dashboard/ChannelStatusCard";
import { RecentLeadsTable } from "@/components/dashboard/RecentLeadsTable";
import { mockChannelStatuses } from "@/lib/db/mock-data";
import { omnichannelService } from "@/lib/services/communication";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

// تهيئة عميل Supabase على مستوى السيرفر
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : "en";
  const dict = await getDictionary(locale);

  // 1. الحصول على جلسة المستخدم الحالية
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || "demo@agency.com";

  // 2. جلب العقارات الخاصة بالوكالة الحالية من Supabase
  const { count: propertiesCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("user_email", userEmail);

  // 3. جلب محادثات وعملاء (Leads) الوكالة الحالية من Supabase
  const { data: rawConversations } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_email", userEmail)
    .order("updated_at", { ascending: false });

  // 4. تجهيز وتنسيق بيانات الـ Leads لمكونات الـ UI
  const userLeads = (rawConversations || []).map((conv: any) => ({
    id: conv.id,
    name: conv.lead_name || "زائر جديد",
    email: conv.lead_email || "-",
    phone: conv.lead_phone || "-",
    channel: conv.channel || "widget",
    status: conv.status || "active",
    lastMessage: conv.last_message || "",
    createdAt: conv.created_at ? new Date(conv.created_at).toISOString() : new Date().toISOString(),
    updatedAt: conv.updated_at ? new Date(conv.updated_at).toISOString() : new Date().toISOString(),
  }));

  // 5. حساب الإحصائيات الدقيقة
  const totalLeads = userLeads.length;
  const totalProperties = propertiesCount || 0;
  const qualifiedLeads = userLeads.filter(
    (l: any) => l.status === "qualified" || l.status === "converted" || l.status === "HOT_LEAD"
  ).length;

  const conversionRate =
    totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;

  const realStats = {
    totalLeads,
    totalProperties,
    qualifiedLeads,
    conversionRate: Math.round(conversionRate),
  };

  // 6. جلب حالة قنوات التواصل
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