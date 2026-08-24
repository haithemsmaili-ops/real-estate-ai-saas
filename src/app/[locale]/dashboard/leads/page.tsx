"use client";

import React, { useState, useMemo } from "react";
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
  CheckCircle,
  Clock,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  propertyType: string;
  budget: string;
  location: string;
  status: "Qualified" | "New" | "Contacted";
  notes: string;
  createdAt: string;
}

const INITIAL_LEADS: Lead[] = [
  {
    id: "1",
    name: "أحمد بن علي",
    phone: "+213 555 123 456",
    propertyType: "شقة F3",
    budget: "1.5 مليار سنتيم",
    location: "زرالدة، الجزائر",
    status: "Qualified",
    notes: "يبحث عن شقة بدفتر عقاري، جاهز للشراء الفوري.",
    createdAt: "2026-08-20",
  },
  {
    id: "2",
    name: "سارة محمود",
    phone: "+213 661 987 654",
    propertyType: "فيلا",
    budget: "6.5 مليار سنتيم",
    location: "معالمة، الجزائر",
    status: "New",
    notes: "تريد فيلا بمساحة لا تقل عن 300 م².",
    createdAt: "2026-08-22",
  },
];

export default function LeadsPage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const isAr = lang === "ar";

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.propertyType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  const toggleStatus = (id: string) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          const nextStatus =
            lead.status === "New"
              ? "Contacted"
              : lead.status === "Contacted"
                ? "Qualified"
                : "New";
          return { ...lead, status: nextStatus };
        }
        return lead;
      })
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    if (selectedLead?.id === id) setSelectedLead(null);
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

        <button
          onClick={() => setLang(isAr ? "en" : "ar")}
          className="self-start md:self-auto px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 transition"
        >
          {isAr ? "English 🌐" : "العربية 🌐"}
        </button>
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
            className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">{isAr ? "كل الحالات" : "All Statuses"}</option>
            <option value="New">{isAr ? "جديد" : "New"}</option>
            <option value="Contacted">{isAr ? "تم التواصل" : "Contacted"}</option>
            <option value="Qualified">{isAr ? "مؤهل" : "Qualified"}</option>
          </select>
        </div>
      </div>

      {/* Leads Grid */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
          {isAr ? "لا يوجد عملاء مطابقون للبحث." : "No matching leads found."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition relative group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {lead.name}
                  </h3>
                  <span className="text-xs text-slate-400">{lead.createdAt}</span>
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
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>{lead.propertyType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{lead.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-800">
                    {lead.budget}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
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
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                    title={isAr ? "حذف" : "Delete"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isAr ? "واتساب" : "WhatsApp"}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 left-4 rtl:right-4 rtl:left-auto text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {selectedLead.name}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              {isAr ? "معرف العميل:" : "Lead ID:"} {selectedLead.id}
            </p>

            <div className="space-y-4 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                <span className="text-slate-500">{isAr ? "رقم الهاتف:" : "Phone:"}</span>
                <span className="font-semibold text-slate-800">{selectedLead.phone}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                <span className="text-slate-500">{isAr ? "نوع العقار:" : "Property:"}</span>
                <span className="font-semibold text-slate-800">{selectedLead.propertyType}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                <span className="text-slate-500">{isAr ? "الميزانية:" : "Budget:"}</span>
                <span className="font-semibold text-slate-800">{selectedLead.budget}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                <span className="text-slate-500">{isAr ? "الموقع:" : "Location:"}</span>
                <span className="font-semibold text-slate-800">{selectedLead.location}</span>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  {isAr ? "ملاحظات وتفاصيل الطلب:" : "Notes & Details:"}
                </label>
                <p className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs leading-relaxed">
                  {selectedLead.notes}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}