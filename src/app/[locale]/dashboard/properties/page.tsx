"use client";

import { useState, useEffect } from "react";
import { PropertyRecord } from "@/lib/db/json-db";
import { Plus, Trash2, Home, Bed, Bath, Maximize, MapPin, DollarSign, X } from "lucide-react";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    listingType: "sale",
    propertyType: "apartment",
    price: "",
    currency: "USD",
    country: "",
    city: "",
    district: "",
    address: "",
    area: "",
    areaUnit: "sqm",
    bedrooms: "1",
    bathrooms: "1",
    legalStatus: "freehold",
    status: "available",
  });

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties");
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      console.error("Failed to load properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا العقار؟")) return;

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("حدث خطأ أثناء حذف العقار");
      }
    } catch (err) {
      console.error(err);
      alert("تعذر الاتصال بالخادم");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        numericPrice: Number(formData.price) || 0,
        area: Number(formData.area) || 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        location: [formData.district, formData.city, formData.country].filter(Boolean).join(", ") || formData.address || "N/A",
      };

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          title: "",
          description: "",
          listingType: "sale",
          propertyType: "apartment",
          price: "",
          currency: "USD",
          country: "",
          city: "",
          district: "",
          address: "",
          area: "",
          areaUnit: "sqm",
          bedrooms: "1",
          bathrooms: "1",
          legalStatus: "freehold",
          status: "available",
        });
        fetchProperties();
      } else {
        alert("فشل في إضافة العقار");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الإرسال");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 text-right dir-rtl">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العقارات</h1>
          <p className="text-sm text-gray-500 mt-1">إضافة وعرض العقارات الخاصة بك في النظام</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          إضافة عقار جديد
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">جاري تحميل العقارات...</div>
      ) : properties.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center space-y-3">
          <Home className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-700">لا توجد عقارات مضافة بعد</h3>
          <p className="text-sm text-gray-400">ابدأ بإضافة أول عقار في محفظتك العقارية الآن</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-100 transition"
          >
            إضافة عقار الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between">
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${prop.status === "available" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>
                    {prop.status === "available" ? "متاح" : prop.status}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md capitalize">
                    {prop.listingType === "sale" ? "للبيع" : "للإيجار"}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{prop.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 line-clamp-1">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    {prop.location || `${prop.city || ""}, ${prop.country || ""}`}
                  </p>
                </div>

                <div className="text-xl font-extrabold text-emerald-600">
                  {prop.numericPrice ? prop.numericPrice.toLocaleString() : prop.price} {prop.currency || "USD"}
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-50 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-gray-400" />
                    <span>{prop.bedrooms || 0} غرف</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-gray-400" />
                    <span>{prop.bathrooms || 0} حمام</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Maximize className="w-4 h-4 text-gray-400" />
                    <span>{prop.area || 0} {prop.areaUnit === "sqft" ? "SqFt" : "م²"}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400 capitalize">{prop.propertyType || "شقة"}</span>
                <button
                  onClick={() => handleDelete(prop.id)}
                  className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                  title="حذف العقار"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">إضافة عقار جديد</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">عنوان العقار *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فيلا فاخرة مطلة على البحر"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">نوع المعاملة</label>
                  <select
                    value={formData.listingType}
                    onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm bg-white outline-none"
                  >
                    <option value="sale">للبيع (For Sale)</option>
                    <option value="rent">للإيجار (For Rent)</option>
                    <option value="short_term">إيجار يومي/سياحي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">نوع العقار</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm bg-white outline-none"
                  >
                    <option value="apartment">شقة (Apartment)</option>
                    <option value="villa">فيلا (Villa)</option>
                    <option value="townhouse">تاون هاوس (Townhouse)</option>
                    <option value="land">أرض (Land)</option>
                    <option value="building">مبنى / عمارة (Building)</option>
                    <option value="commercial">تجاري (Commercial)</option>
                    <option value="office">مكتب (Office)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">السعر *</label>
                  <input
                    type="number"
                    required
                    placeholder="250000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">العملة</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm bg-white outline-none"
                  >
                    <option value="USD">دولار أمريكي ($ USD)</option>
                    <option value="EUR">يورو (€ EUR)</option>
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                    <option value="QAR">ريال قطري (QAR)</option>
                    <option value="KWD">دينار كويتي (KWD)</option>
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="DZD">دينار جزائري (DZD)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">الدولة</label>
                  <input
                    type="text"
                    placeholder="الإمارات / السعودية"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">المدينة</label>
                  <input
                    type="text"
                    placeholder="دبي / الرياض"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">المنطقة/الحي</label>
                  <input
                    type="text"
                    placeholder="وسط المدينة / النخيل"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">المساحة</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">الوحدة</label>
                  <select
                    value={formData.areaUnit}
                    onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm bg-white outline-none"
                  >
                    <option value="sqm">متر مربع (m²)</option>
                    <option value="sqft">قدم مربع (SqFt)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">الغرف</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">الحمامات</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">الوصف</label>
                <textarea
                  rows={2}
                  placeholder="تفاصيل إضافية حول العقار..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-xl p-2.5 text-sm outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  {isSubmitting ? "جاري الحفظ..." : "حفظ العقار"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}