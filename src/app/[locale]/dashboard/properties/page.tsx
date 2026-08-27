"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Trash2,
  X,
  Home,
  Camera,
  Film,
} from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import PropertyMiniMap from "@/components/dashboard/PropertyMiniMap";
import MediaUploadZone from "@/components/dashboard/MediaUploadZone";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

const LocationPickerMap = dynamic(() => import("@/components/dashboard/LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-56 bg-gray-50 border border-gray-200 rounded-2xl animate-pulse flex flex-col items-center justify-center text-xs text-gray-400 gap-2">
      <Building2 className="w-6 h-6 text-gray-300 animate-bounce" />
      <span>جاري تحميل الخريطة التفاعلية...</span>
    </div>
  ),
});

interface PropertyRecord {
  id: string;
  title: string;
  description?: string;
  listingType?: string;
  propertyType?: string;
  price?: string;
  numericPrice?: number;
  currency?: string;
  country?: string;
  city?: string;
  district?: string;
  address?: string;
  location?: string;
  area?: number;
  areaUnit?: string;
  bedrooms?: number;
  bathrooms?: number;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  images?: string[];
  videos?: string[];
  status?: string;
}

export default function PropertiesPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterListing, setFilterListing] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useScrollLock(isModalOpen);

  const userEmail = session?.user?.email || null;

  useEffect(() => {
    if (sessionStatus === "authenticated" && userEmail) {
      fetchProperties(userEmail);
    } else if (sessionStatus === "unauthenticated") {
      setLoading(false);
    }
  }, [sessionStatus, userEmail]);

  const fetchProperties = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties?userEmail=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        const formattedProperties: PropertyRecord[] = (data.properties || data).map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          listingType: item.listing_type || item.listingType,
          propertyType: item.property_type || item.propertyType,
          price: item.price,
          numericPrice: item.numeric_price || item.numericPrice,
          currency: item.currency,
          country: item.country,
          city: item.city,
          district: item.district,
          address: item.address,
          location: item.location,
          area: item.area,
          areaUnit: item.area_unit || item.areaUnit,
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms,
          latitude: item.latitude !== undefined && item.latitude !== null ? Number(item.latitude) : undefined,
          longitude: item.longitude !== undefined && item.longitude !== null ? Number(item.longitude) : undefined,
          mapUrl: item.map_url || item.mapUrl,
          images: Array.isArray(item.images) ? item.images : [],
          videos: Array.isArray(item.videos) ? item.videos : [],
          status: item.status,
        }));
        setProperties(formattedProperties);
      }
    } catch (err) {
      console.error("Failed to load properties", err);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    listingType: string;
    propertyType: string;
    price: string;
    currency: string;
    country: string;
    city: string;
    district: string;
    address: string;
    area: string;
    areaUnit: string;
    bedrooms: string;
    bathrooms: string;
    legalStatus: string;
    status: string;
    latitude?: number;
    longitude?: number;
    mapUrl: string;
    images: string[];
    videos: string[];
  }>({
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
    bedrooms: "",
    bathrooms: "",
    legalStatus: "freehold",
    status: "available",
    latitude: undefined,
    longitude: undefined,
    mapUrl: "",
    images: [],
    videos: [],
  });

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا العقار؟")) return;

    try {
      const res = await fetch(`/api/properties/${id}?userEmail=${encodeURIComponent(userEmail || "")}`, {
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
    if (!userEmail) {
      alert("تعذر التعرف على بيانات الحساب الحالي");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        userEmail,
        numericPrice: Number(formData.price) || 0,
        area: Number(formData.area) || 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        location: [formData.district, formData.city, formData.country].filter(Boolean).join(", ") || formData.address || "",
        latitude: formData.latitude,
        longitude: formData.longitude,
        mapUrl: formData.mapUrl,
        images: formData.images,
        videos: formData.videos,
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
          bedrooms: "",
          bathrooms: "",
          legalStatus: "freehold",
          status: "available",
          latitude: undefined,
          longitude: undefined,
          mapUrl: "",
          images: [],
          videos: [],
        });
        fetchProperties(userEmail);
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

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || prop.propertyType === filterType;
    const matchesListing = filterListing === "all" || prop.listingType === filterListing;

    return matchesSearch && matchesType && matchesListing;
  });

  return (
    <div className="p-6 space-y-6 text-right dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-7 w-7 text-emerald-600" />
            إدارة العقارات
          </h1>
          <p className="text-sm text-gray-500 mt-1">إضافة وعرض العقارات الخاصة بك في النظام</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          إضافة عقار جديد
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="البحث باسم العقار أو الموقع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterListing}
            onChange={(e) => setFilterListing(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">كل العروض</option>
            <option value="sale">للبيع</option>
            <option value="rent">للإيجار</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">كل الأنواع</option>
            <option value="apartment">شقة</option>
            <option value="villa">فيلا</option>
            <option value="land">أرض</option>
            <option value="commercial">تجاري</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">جاري تحميل العقارات...</div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center space-y-3">
          <Home className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-700">لا توجد عقارات مطابقة</h3>
          <p className="text-sm text-gray-400">لم نجد أي عقارات بناءً على البحث أو التصفية الحالية</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-100 transition"
          >
            إضافة عقار الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div key={prop.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group">
              {/* Cover Image Header */}
              {prop.images && prop.images.length > 0 ? (
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-white flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      {prop.images.length}
                    </span>
                    {prop.videos && prop.videos.length > 0 && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-white flex items-center gap-1">
                        <Film className="w-3.5 h-3.5 text-cyan-400" />
                        {prop.videos.length}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative h-32 w-full bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-emerald-600/30" />
                </div>
              )}

              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${prop.status === "available" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                    {prop.status === "available" ? "متاح" : prop.status}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md capitalize">
                    {prop.listingType === "sale" ? "للبيع" : "للإيجار"}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{prop.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 line-clamp-1">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    {prop.location || `${prop.city || ""}, ${prop.country || ""}`}
                  </p>
                  <PropertyMiniMap
                    latitude={prop.latitude}
                    longitude={prop.longitude}
                    mapUrl={prop.mapUrl}
                    locationName={prop.location}
                  />
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto w-full p-6 space-y-6 shadow-2xl relative my-auto">
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
                  placeholder=""
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
                    placeholder=""
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
                    <option value="GBP">جنيه إسترليني (£ GBP)</option>
                    <option value="CAD">دولار كندي ($ CAD)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="DZD">دينار جزائري (DZD)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">الدولة</label>
                  <input
                    type="text"
                    placeholder=""
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">المدينة</label>
                  <input
                    type="text"
                    placeholder=""
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">المنطقة/الحي</label>
                  <input
                    type="text"
                    placeholder=""
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Multi-Media Upload Zone (Images & Videos) */}
              <div className="pt-2 border-t border-gray-100">
                <MediaUploadZone
                  images={formData.images}
                  videos={formData.videos}
                  onImagesChange={(imgs) => setFormData((prev) => ({ ...prev, images: imgs }))}
                  onVideosChange={(vids) => setFormData((prev) => ({ ...prev, videos: vids }))}
                />
              </div>

              {/* Map Location Picker */}
              <div className="pt-2 border-t border-gray-100">
                <LocationPickerMap
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  mapUrl={formData.mapUrl}
                  onLocationSelect={(lat, lng, url) => {
                    setFormData((prev) => ({
                      ...prev,
                      latitude: lat,
                      longitude: lng,
                      mapUrl: url || prev.mapUrl,
                    }));
                  }}
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">المساحة</label>
                  <input
                    type="number"
                    placeholder=""
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
                    placeholder=""
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">الحمامات</label>
                  <input
                    type="number"
                    placeholder=""
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
                  placeholder=""
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