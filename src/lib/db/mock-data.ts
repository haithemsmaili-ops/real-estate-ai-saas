import type { Lead } from "@/types/lead";
import type { ChannelStatus } from "@/types/communication";

/** Mock dashboard data — replace with DB queries in production */
export const mockLeads: Lead[] = [
  {
    id: "1",
    tenantId: "demo",
    name: "Ahmed Al-Rashid",
    phone: "+971501234567",
    source: "whatsapp",
    status: "qualified",
    intentScore: 87,
    locale: "ar",
    createdAt: new Date("2026-07-26"),
    updatedAt: new Date("2026-07-26"),
  },
  {
    id: "2",
    tenantId: "demo",
    name: "Sarah Mitchell",
    email: "sarah.m@email.com",
    source: "email",
    status: "pending",
    intentScore: 62,
    locale: "en",
    createdAt: new Date("2026-07-25"),
    updatedAt: new Date("2026-07-25"),
  },
  {
    id: "3",
    tenantId: "demo",
    name: "James Chen",
    phone: "+14165551234",
    source: "sms",
    status: "new",
    intentScore: 45,
    locale: "en",
    createdAt: new Date("2026-07-24"),
    updatedAt: new Date("2026-07-24"),
  },
  {
    id: "4",
    tenantId: "demo",
    name: "Fatima Hassan",
    phone: "+966501112233",
    source: "whatsapp",
    status: "converted",
    intentScore: 95,
    locale: "ar",
    createdAt: new Date("2026-07-23"),
    updatedAt: new Date("2026-07-27"),
  },
];

export const mockChannelStatuses: ChannelStatus[] = [
  { channel: "whatsapp", connected: false },
  { channel: "email", connected: false },
  { channel: "sms", connected: false },
];

export const mockLeadStats = {
  totalLeads: 1284,
  qualifiedLeads: 412,
  pendingLeads: 186,
  conversionRate: 18.4,
};
