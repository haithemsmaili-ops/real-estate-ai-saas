"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Search,
  Filter,
  Phone,
  MessageSquare,
  Building,
  MapPin,
  DollarSign,
  UserCheck,
  Trash2,
  Eye,
  X,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  propertyType: string;
  budget: string;
  location: string;
  status: "Qualified" | "New" | "Contacted";
  notes?: string;
  createdAt?: string;
}

export default function LeadsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const [lang, setLang] = useState<"ar" | "en">(locale === "ar" ? "ar" : "en");

  // المصفوفة تبدأ فارغة تماماً بدون أي أسماء تجريبية
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const isAr = lang === "ar";

  // جلب البيانات الحقيقية من الـ API
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/leads");
      if (res.ok) {
        const data = await res.json();
        const leadsData = Array.isArray(data) ? data : data.leads || [];
        setLeads(leadsData);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        lead.name?.toLowerCase().includes(query) ||
        lead.location?.toLowerCase().includes(query) ||
        lead.propertyType?.toLowerCase().includes(query) ||
        lead.phone?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  const toggleStatus = async (id: string) => {
    const currentLead = leads.find((l) => l.id === id);
    if (!currentLead) return;

    const nextStatus =
      currentLead.status === "New"
        ? "Contacted"
        : currentLead.status === "Contacted"
          ? "Qualified"
          : "New";

    // تحديث واجهة المستخدم فوراً
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status: nextStatus } : lead
      )
    );

    // إرسال التحديث للسيرفر
    try {
      await fetch(`/api/v1/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.error("Error updating lead status:", err);
    }
  };

  const deleteLead = async (id: string) => {
    if (
      !confirm(
        isAr
          ? "هل أنت متأكد من حذف هذا العميل؟"
          : "Are you sure you want to delete this lead?"
      )
    )
      return;

    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    if (selectedLead?.id === id) setSelectedLead(null);

    try {
      await fetch(`/api/v1/leads/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {isAr ? "إدارة العملاء المحتملين" : "Leads Management"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAr
              ? "متابعة الطلبات والزبائن المستهدفين لمنصة PropAI"
              : "Track and qualify real estate prospects for PropAI"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            title={isAr ? "تحديث" : "Refresh"}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setLang(isAr ? "en" : "ar")}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 transition"
          >
            {isAr ? "English 🌐" : "العربية 🌐"}
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute top-1/2 -translate-y-1/2 right-3 left-auto text-slate-400 w-4 h-4 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
          <input
            type="text"
            placeholder={
              isAr ? "بحث بالاسم، المنطقة أو العقار..." : "Search leads..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">{isAr ? "كل الحالات" : "All Statuses"}</option>
            <option value="New">{isAr ? "جديد" : "New"}</option>
            <option value="Contacted">{isAr ? "تم التواصل" : "Contacted"}</option>
            <option value="Qualified">{isAr ? "مؤهل" : "Qualified"}</option>
          </select>
        </div>
      </div>

      {/* Content State */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p>{isAr ? "جاري تحميل العملاء..." : "Loading leads..."}</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-medium text-slate-600">
            {isAr ? "لا يوجد عملاء حالياً." : "No leads found."}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? "سيظهر العملاء الجدد هنا فور تواصلهم عبر الشات بوت أو الواتساب."
              : "New leads will appear here automatically."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {lead.name}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {lead.createdAt || new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${lead.status === "Qualified"
                        ? "bg-emerald-100 text-emerald-700"
                        : lead.status === "Contacted"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {lead.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{lead.propertyType || (isAr ? "غير محدد" : "N/A")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{lead.location || (isAr ? "غير محدد" : "N/A")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">
                      {lead.budget || (isAr ? "غير محدد" : "N/A")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {lead.phone && (
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isAr ? "واتساب" : "WhatsApp"}</span>
                  </a>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                    title={isAr ? "عرض التفاصيل" : "View Details"}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleStatus(lead.id)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                    title={isAr ? "تغيير الحالة" : "Toggle Status"}
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition"
                    title={isAr ? "حذف" : "Delete"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal تفاصيل العميل */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 relative">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 left-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 border-b pb-3">
              {selectedLead.name}
            </h3>

            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-slate-700">
                  {isAr ? "رقم الهاتف:" : "Phone:"}
                </strong>{" "}
                {selectedLead.phone || "---"}
              </p>
              <p>
                <strong className="text-slate-700">
                  {isAr ? "نوع العقار:" : "Property:"}
                </strong>{" "}
                {selectedLead.propertyType || "---"}
              </p>
              <p>
                <strong className="text-slate-700">
                  {isAr ? "الموقع:" : "Location:"}
                </strong>{" "}
                {selectedLead.location || "---"}
              </p>
              <p>
                <strong className="text-slate-700">
                  {isAr ? "الميزانية:" : "Budget:"}
                </strong>{" "}
                {selectedLead.budget || "---"}
              </p>
              {selectedLead.notes && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-700 block mb-1">
                    {isAr ? "ملاحظات:" : "Notes:"}
                  </strong>
                  <p className="text-xs text-slate-600">{selectedLead.notes}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedLead(null)}
              className="w-full py-2 mt-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition"
            >
              {isAr ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}