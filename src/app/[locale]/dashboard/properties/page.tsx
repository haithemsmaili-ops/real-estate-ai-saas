"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Building, Plus, Tag, MapPin, DollarSign, CheckCircle2, RefreshCw } from "lucide-react";

interface Property {
  id: string;
  title: string;
  type: "sale" | "rent";
  price: string;
  location: string;
  status: "available" | "sold" | "rented";
  createdAt: string;
}

export default function PropertiesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const isAr = locale === "ar";

  const [dict, setDict] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"sale" | "rent">("sale");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"available" | "sold" | "rented">("available");

  useEffect(() => {
    getDictionary(locale as any)
      .then(setDict)
      .catch(() => setDict({}));

    fetchProperties();
  }, [locale]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/properties");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      console.error(err);
      setError(isAr ? "فشل تحميل العقارات" : "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (!title || !price || !location) {
      setError(isAr ? "يرجى ملء جميع الحقول الإلزامية" : "Please fill in all mandatory fields");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type, price, location, status }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add");

      setSuccess(isAr ? "تم إضافة العقار بنجاح" : "Property added successfully");
      setTitle("");
      setPrice("");
      setLocation("");
      setStatus("available");

      // Refresh list
      fetchProperties();
    } catch (err: any) {
      console.error(err);
      setError(err.message || (isAr ? "خطأ في إضافة العقار" : "Error adding property"));
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (s: string) => {
    switch (s) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "sold":
        return "bg-red-50 text-red-700 border-red-200";
      case "rented":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (s: string) => {
    if (isAr) {
      if (s === "available") return "متاح";
      if (s === "sold") return "مباع";
      if (s === "rented") return "مؤجر";
    } else {
      if (s === "available") return "Available";
      if (s === "sold") return "Sold";
      if (s === "rented") return "Rented";
    }
    return s;
  };

  const getTypeText = (t: string) => {
    if (isAr) {
      return t === "sale" ? "للبيع" : "للإيجار";
    }
    return t === "sale" ? "For Sale" : "For Rent";
  };

  return (
    <div className="space-y-8" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-surface-900">
            {isAr ? "إدارة العقارات" : "Property Management"}
          </h2>
          <p className="text-sm text-surface-500">
            {isAr ? "أضف واعرض عقارات الوكالة المتوفرة في قاعدة بيانات الذكاء الاصطناعي." : "Add and view available agency listings in the AI database."}
          </p>
        </div>
        <Button onClick={fetchProperties} variant="outline" size="sm" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>{isAr ? "تحديث" : "Refresh"}</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-right">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm text-right flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Add listing Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-3 flex items-center gap-2">
            <Plus className="h-5 w-5 text-brand-600" />
            <span>{isAr ? "إضافة عقار جديد" : "Add New Property"}</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-700">{isAr ? "عنوان العقار" : "Property Title"} *</label>
              <Input
                placeholder={isAr ? "شقة فاخرة 3 غرف في باب الزوار" : "3-bedroom luxury apartment in Algiers"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-700">{isAr ? "نوع العقار" : "Property Type"} *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType("sale")}
                  className={`py-2 px-3 text-sm font-semibold rounded-xl border text-center transition-all ${type === "sale"
                      ? "bg-brand-50 border-brand-500 text-brand-700"
                      : "bg-white border-surface-200 text-surface-600 hover:bg-surface-50"
                    }`}
                >
                  {isAr ? "للبيع" : "For Sale"}
                </button>
                <button
                  type="button"
                  onClick={() => setType("rent")}
                  className={`py-2 px-3 text-sm font-semibold rounded-xl border text-center transition-all ${type === "rent"
                      ? "bg-brand-50 border-brand-500 text-brand-700"
                      : "bg-white border-surface-200 text-surface-600 hover:bg-surface-50"
                    }`}
                >
                  {isAr ? "للإيجار" : "For Rent"}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-700">{isAr ? "السعر" : "Price"} *</label>
              <Input
                placeholder={isAr ? "12,000,000 دج" : "120,000 USD"}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-700">{isAr ? "الموقع" : "Location"} *</label>
              <Input
                placeholder={isAr ? "الجزائر العاصمة، باب الزوار" : "Bab Ezzouar, Algiers"}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-700">{isAr ? "الحالة" : "Status"} *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="available">{isAr ? "متاح" : "Available"}</option>
                <option value="sold">{isAr ? "مباع" : "Sold"}</option>
                <option value="rented">{isAr ? "مؤجر" : "Rented"}</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ العقار" : "Save Property")}
            </Button>
          </form>
        </div>

        {/* Listings Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-surface-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-surface-900 flex items-center gap-2">
              <Building className="h-5 w-5 text-brand-600" />
              <span>{isAr ? "قائمة العقارات المتوفرة" : "Available Properties List"}</span>
            </h3>
            <span className="text-xs font-semibold bg-surface-100 text-surface-700 px-2.5 py-1 rounded-full">
              {properties.length} {isAr ? "عقارات" : "properties"}
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-surface-500">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-brand-500" />
                <span>{isAr ? "جاري تحميل العقارات..." : "Loading properties..."}</span>
              </div>
            ) : properties.length === 0 ? (
              <div className="py-12 text-center text-surface-400">
                <Building className="h-12 w-12 mx-auto mb-2 text-surface-200" />
                <p>{isAr ? "لا توجد عقارات مضافة بعد." : "No properties added yet."}</p>
              </div>
            ) : (
              <table className="w-full text-right text-sm">
                <thead className="bg-surface-50 text-surface-700 border-b border-surface-200">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-right">{isAr ? "العقار" : "Property"}</th>
                    <th className="px-6 py-3 font-semibold text-right">{isAr ? "النوع" : "Type"}</th>
                    <th className="px-6 py-3 font-semibold text-right">{isAr ? "السعر" : "Price"}</th>
                    <th className="px-6 py-3 font-semibold text-right">{isAr ? "الموقع" : "Location"}</th>
                    <th className="px-6 py-3 font-semibold text-right">{isAr ? "الحالة" : "Status"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-surface-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-surface-900 flex items-center gap-2">
                        <Building className="h-4 w-4 text-surface-400 shrink-0" />
                        <span>{prop.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5 text-surface-400" />
                          <span>{getTypeText(prop.type)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-brand-700">
                        <span className="flex items-center gap-0.5">
                          <DollarSign className="h-3.5 w-3.5 text-brand-500" />
                          <span>{prop.price}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-surface-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-surface-400" />
                          <span>{prop.location}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-bold ${getStatusBadgeClass(prop.status)}`}>
                          {getStatusText(prop.status)}
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
    </div>
  );
}
