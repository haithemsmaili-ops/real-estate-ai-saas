"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Users, Search, RefreshCw, Star, MessageSquare, Mail, Phone, Calendar } from "lucide-react";

interface Lead {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: string;
  intentScore: number;
  locale: string;
  createdAt: string;
}

export default function LeadsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const isAr = locale === "ar";

  const [dict, setDict] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getDictionary(locale as any)
      .then(setDict)
      .catch(() => setDict({}));

    fetchLeads();
  }, [locale]);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error(err);
      setError(isAr ? "فشل تحميل العملاء" : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (s: string) => {
    switch (s?.toLowerCase()) {
      case "qualified":
      case "mouatel":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
      case "moraqaba":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "new":
      case "jadid":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "converted":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (s: string) => {
    if (isAr) {
      if (s === "qualified") return "مؤهل";
      if (s === "pending") return "قيد الانتظار";
      if (s === "new") return "جديد";
      if (s === "converted") return "تم التحويل";
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const getSourceIcon = (source: string) => {
    switch (source?.toLowerCase()) {
      case "whatsapp":
        return <span className="text-emerald-500 font-bold">WhatsApp</span>;
      case "email":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "sms":
        return <Phone className="h-4 w-4 text-purple-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  // Filter leads by search query
  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(query) ||
      lead.phone?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.source?.toLowerCase().includes(query) ||
      lead.status?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-surface-900">
            {isAr ? "الزبائن المستهدفين / المحتملين" : "Targeted & Potential Leads"}
          </h2>
          <p className="text-sm text-surface-500">
            {isAr
              ? "استعرض العملاء المحتملين الذين تم جمعهم وتأهيلهم تلقائياً بواسطة المساعد الذكي n8n."
              : "Review hot leads captured and qualified automatically by the smart chatbot."}
          </p>
        </div>
        <Button onClick={fetchLeads} variant="outline" size="sm" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>{isAr ? "تحديث البيانات" : "Refresh Leads"}</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-right">
          {error}
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-5 border-b border-surface-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-surface-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder={isAr ? "البحث بالاسم، الهاتف، البريد أو القناة..." : "Search by name, phone, channel..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-surface-50/50 ps-10 pe-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-right"
              dir="rtl"
            />
          </div>
          <span className="text-xs font-semibold bg-surface-100 text-surface-700 px-3 py-1.5 rounded-full self-start sm:self-center">
            {filteredLeads.length} {isAr ? "عملاء" : "leads found"}
          </span>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-surface-500">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-brand-500" />
              <span>{isAr ? "جاري تحميل العملاء المحتملين..." : "Loading leads..."}</span>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-16 text-center text-surface-400">
              <Users className="h-12 w-12 mx-auto mb-2 text-surface-200" />
              <p>{isAr ? "لم يتم العثور على أي عميل." : "No leads found."}</p>
            </div>
          ) : (
            <table className="w-full text-right text-sm">
              <thead className="bg-surface-50 text-surface-700 border-b border-surface-200">
                <tr>
                  <th className="px-6 py-3.5 font-semibold text-right">{isAr ? "العميل" : "Client"}</th>
                  <th className="px-6 py-3.5 font-semibold text-right">{isAr ? "معلومات الاتصال" : "Contact Info"}</th>
                  <th className="px-6 py-3.5 font-semibold text-right">{isAr ? "القناة" : "Channel"}</th>
                  <th className="px-6 py-3.5 font-semibold text-right">{isAr ? "درجة الاهتمام" : "Intent Score"}</th>
                  <th className="px-6 py-3.5 font-semibold text-right">{isAr ? "الحالة" : "Status"}</th>
                  <th className="px-6 py-3.5 font-semibold text-right">{isAr ? "التاريخ" : "Date"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-surface-50/50 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-4 font-bold text-surface-900">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-xs">
                          {lead.name?.charAt(0) || "U"}
                        </div>
                        <span>{lead.name}</span>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="px-6 py-4 text-surface-600">
                      <div className="flex flex-col gap-0.5 text-xs text-right">
                        {lead.phone && (
                          <span className="flex items-center justify-end gap-1 font-mono">
                            <span>{lead.phone}</span>
                            <Phone className="h-3 w-3 text-surface-400" />
                          </span>
                        )}
                        {lead.email && (
                          <span className="flex items-center justify-end gap-1">
                            <span>{lead.email}</span>
                            <Mail className="h-3 w-3 text-surface-400" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Source */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100 text-surface-800 text-xs font-semibold">
                        {getSourceIcon(lead.source)}
                        <span className="capitalize">{lead.source}</span>
                      </span>
                    </td>

                    {/* Intent Score */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`text-xs font-bold ${lead.intentScore >= 80 ? "text-amber-600" : "text-surface-600"}`}>
                          {lead.intentScore}%
                        </span>
                        <div className="w-16 bg-surface-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              lead.intentScore >= 80 ? "bg-amber-500" : lead.intentScore >= 50 ? "bg-blue-500" : "bg-surface-300"
                            }`}
                            style={{ width: `${lead.intentScore}%` }}
                          />
                        </div>
                        {lead.intentScore >= 80 && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-bounce" />}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-bold ${getStatusBadgeClass(lead.status)}`}>
                        {getStatusText(lead.status)}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-surface-500 text-xs font-medium">
                      <span className="flex items-center justify-end gap-1.5">
                        <span>{new Date(lead.createdAt).toLocaleDateString(locale === "ar" ? "ar-DZ" : "en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}</span>
                        <Calendar className="h-3.5 w-3.5 text-surface-400" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
