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
  Pencil,
  Eye,
  X,
  Home,
  Camera,
  Film,
  DollarSign,
  ChevronLeft,
  ChevronRight,
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
  rentPeriod?: string;
  country?: string;
  city?: string;
  district?: string;
  address?: string;
  location?: string;
  area?: number;
  areaUnit?: string;
  bedrooms?: number;
  bathrooms?: number;
  livingRooms?: number;
  kitchens?: number;
  floorNumber?: number;
  totalFloors?: number;
  parkingSpaces?: number;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  images?: string[];
  videos?: string[];
  status?: string;
  legalStatus?: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [viewingProperty, setViewingProperty] = useState<PropertyRecord | null>(null);
  const [viewImageIndex, setViewImageIndex] = useState(0);

  useScrollLock(isModalOpen || !!viewingProperty);

  const userEmail = session?.user?.email || null;

  const handleEditClick = (prop: PropertyRecord) => {
    setFormData({
      title: prop.title || "",
      description: prop.description || "",
      listingType: prop.listingType || "sale",
      propertyType: prop.propertyType || "apartment",
      price: prop.price || "",
      currency: prop.currency || "USD",
      rentPeriod: prop.rentPeriod || "monthly",
      country: prop.country || "",
      city: prop.city || "",
      district: prop.district || "",
      address: prop.address || "",
      area: prop.area !== undefined && prop.area !== null ? String(prop.area) : "",
      areaUnit: prop.areaUnit || "sqm",
      bedrooms: prop.bedrooms !== undefined && prop.bedrooms !== null ? String(prop.bedrooms) : "",
      bathrooms: prop.bathrooms !== undefined && prop.bathrooms !== null ? String(prop.bathrooms) : "",
      livingRooms: prop.livingRooms !== undefined && prop.livingRooms !== null ? String(prop.livingRooms) : "",
      kitchens: prop.kitchens !== undefined && prop.kitchens !== null ? String(prop.kitchens) : "",
      floorNumber: prop.floorNumber !== undefined && prop.floorNumber !== null ? String(prop.floorNumber) : "",
      totalFloors: prop.totalFloors !== undefined && prop.totalFloors !== null ? String(prop.totalFloors) : "",
      parkingSpaces: prop.parkingSpaces !== undefined && prop.parkingSpaces !== null ? String(prop.parkingSpaces) : "",
      legalStatus: prop.legalStatus || "freehold",
      status: prop.status || "available",
      latitude: prop.latitude,
      longitude: prop.longitude,
      mapUrl: prop.mapUrl || "",
      images: Array.isArray(prop.images) ? prop.images : [],
      videos: Array.isArray(prop.videos) ? prop.videos : [],
    });
    setEditingPropertyId(prop.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

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
          rentPeriod: item.rent_period || item.rentPeriod,
          country: item.country,
          city: item.city,
          district: item.district,
          address: item.address,
          location: item.location,
          area: item.area,
          areaUnit: item.area_unit || item.areaUnit,
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms,
          livingRooms: item.living_rooms ?? item.livingRooms,
          kitchens: item.kitchens,
          floorNumber: item.floor_number ?? item.floorNumber,
          totalFloors: item.total_floors ?? item.totalFloors,
          parkingSpaces: item.parking_spaces ?? item.parkingSpaces,
          latitude: item.latitude !== undefined && item.latitude !== null ? Number(item.latitude) : undefined,
          longitude: item.longitude !== undefined && item.longitude !== null ? Number(item.longitude) : undefined,
          mapUrl: item.map_url || item.mapUrl,
          images: Array.isArray(item.images) ? item.images : [],
          videos: Array.isArray(item.videos) ? item.videos : [],
          status: item.status,
          legalStatus: item.legal_status || item.legalStatus || "freehold",
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
    rentPeriod: string;
    country: string;
    city: string;
    district: string;
    address: string;
    area: string;
    areaUnit: string;
    bedrooms: string;
    bathrooms: string;
    livingRooms: string;
    kitchens: string;
    floorNumber: string;
    totalFloors: string;
    parkingSpaces: string;
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
    rentPeriod: "monthly",
    country: "",
    city: "",
    district: "",
    address: "",
    area: "",
    areaUnit: "sqm",
    bedrooms: "",
    bathrooms: "",
    livingRooms: "",
    kitchens: "",
    floorNumber: "",
    totalFloors: "",
    parkingSpaces: "",
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
        livingRooms: formData.livingRooms !== "" ? Number(formData.livingRooms) : undefined,
        kitchens: formData.kitchens !== "" ? Number(formData.kitchens) : undefined,
        floorNumber: formData.floorNumber !== "" ? Number(formData.floorNumber) : undefined,
        totalFloors: formData.totalFloors !== "" ? Number(formData.totalFloors) : undefined,
        parkingSpaces: formData.parkingSpaces !== "" ? Number(formData.parkingSpaces) : undefined,
        rentPeriod: (formData.listingType === "rent" || formData.listingType === "short_term") ? formData.rentPeriod : undefined,
        location: [formData.district, formData.city, formData.country].filter(Boolean).join(", ") || formData.address || "",
        latitude: formData.latitude,
        longitude: formData.longitude,
        mapUrl: formData.mapUrl,
        images: formData.images,
        videos: formData.videos,
      };

      const url = isEditing
        ? `/api/properties/${editingPropertyId}?userEmail=${encodeURIComponent(userEmail)}`
        : "/api/properties";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingPropertyId(null);
        setFormData({
          title: "",
          description: "",
          listingType: "sale",
          propertyType: "apartment",
          price: "",
          currency: "USD",
          rentPeriod: "monthly",
          country: "",
          city: "",
          district: "",
          address: "",
          area: "",
          areaUnit: "sqm",
          bedrooms: "",
          bathrooms: "",
          livingRooms: "",
          kitchens: "",
          floorNumber: "",
          totalFloors: "",
          parkingSpaces: "",
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
        alert(isEditing ? "فشل في تعديل العقار" : "فشل في إضافة العقار");
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
          onClick={() => {
            setFormData({
              title: "",
              description: "",
              listingType: "sale",
              propertyType: "apartment",
              price: "",
              currency: "USD",
              rentPeriod: "monthly",
              country: "",
              city: "",
              district: "",
              address: "",
              area: "",
              areaUnit: "sqm",
              bedrooms: "",
              bathrooms: "",
              livingRooms: "",
              kitchens: "",
              floorNumber: "",
              totalFloors: "",
              parkingSpaces: "",
              legalStatus: "freehold",
              status: "available",
              latitude: undefined,
              longitude: undefined,
              mapUrl: "",
              images: [],
              videos: [],
            });
            setIsEditing(false);
            setEditingPropertyId(null);
            setIsModalOpen(true);
          }}
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
            onClick={() => {
              setFormData({
                title: "",
                description: "",
                listingType: "sale",
                propertyType: "apartment",
                price: "",
                currency: "USD",
                rentPeriod: "monthly",
                country: "",
                city: "",
                district: "",
                address: "",
                area: "",
                areaUnit: "sqm",
                bedrooms: "",
                bathrooms: "",
                livingRooms: "",
                kitchens: "",
                floorNumber: "",
                totalFloors: "",
                parkingSpaces: "",
                legalStatus: "freehold",
                status: "available",
                latitude: undefined,
                longitude: undefined,
                mapUrl: "",
                images: [],
                videos: [],
              });
              setIsEditing(false);
              setEditingPropertyId(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-100 transition"
          >
            إضافة عقار الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
            >
              {/* Cover Image Header - Clickable to open detail view */}
              <div
                className="cursor-pointer"
                onClick={() => { setViewingProperty(prop); setViewImageIndex(0); }}
              >
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
              </div>

              {/* Card body - also clickable */}
              <div
                className="p-5 space-y-4 cursor-pointer"
                onClick={() => { setViewingProperty(prop); setViewImageIndex(0); }}
              >
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

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl font-extrabold text-emerald-600">
                    {prop.numericPrice ? prop.numericPrice.toLocaleString() : prop.price} {prop.currency || 'USD'}
                  </span>
                  {prop.rentPeriod && (prop.listingType === 'rent' || prop.listingType === 'short_term') && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                      {{
                        daily: 'يومياً',
                        weekly: 'أسبوعياً',
                        monthly: 'شهرياً',
                        quarterly: 'ربع سنوي',
                        semi_annual: 'نصف سنوي',
                        yearly: 'سنوياً',
                      }[prop.rentPeriod] || prop.rentPeriod}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 py-3 border-y border-gray-50 text-xs text-gray-600">
                  {(prop.bedrooms ?? 0) > 0 && (
                    <div className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-gray-400" />
                      <span>{prop.bedrooms} {prop.propertyType === 'commercial' || prop.propertyType === 'office' ? 'غرفة' : 'غرفة'}</span>
                    </div>
                  )}
                  {(prop.bathrooms ?? 0) > 0 && (
                    <div className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-gray-400" />
                      <span>{prop.bathrooms} حمام</span>
                    </div>
                  )}
                  {(prop.livingRooms ?? 0) > 0 && (
                    <div className="flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-gray-400" />
                      <span>{prop.livingRooms} صالة</span>
                    </div>
                  )}
                  {(prop.parkingSpaces ?? 0) > 0 && (
                    <div className="flex items-center gap-1">
                      <span>🚗</span>
                      <span>{prop.parkingSpaces} موقف</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Maximize className="w-3.5 h-3.5 text-gray-400" />
                    <span>{prop.area || 0} {prop.areaUnit === 'sqft' ? 'SqFt' : 'م²'}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: property type + action buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400 capitalize">{prop.propertyType || "شقة"}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); setViewingProperty(prop); setViewImageIndex(0); }}
                    className="text-gray-500 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition"
                    title="عرض تفاصيل العقار"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditClick(prop); }}
                    className="text-gray-500 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
                    title="تعديل العقار"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(prop.id); }}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                    title="حذف العقار"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============ Property Detail View Modal ============ */}
      {viewingProperty && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative my-8 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{viewingProperty.title}</h2>
              <button
                onClick={() => setViewingProperty(null)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Gallery */}
            {viewingProperty.images && viewingProperty.images.length > 0 ? (
              <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                <img
                  src={viewingProperty.images[viewImageIndex]}
                  alt={viewingProperty.title}
                  className="w-full h-full object-cover"
                />
                {viewingProperty.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setViewImageIndex((i) => (i - 1 + viewingProperty.images!.length) % viewingProperty.images!.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewImageIndex((i) => (i + 1) % viewingProperty.images!.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {viewingProperty.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setViewImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition ${idx === viewImageIndex ? 'bg-white' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    {viewingProperty.images.length}
                  </span>
                  {viewingProperty.videos && viewingProperty.videos.length > 0 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white flex items-center gap-1">
                      <Film className="w-3.5 h-3.5 text-cyan-400" />
                      {viewingProperty.videos.length}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-32 w-full bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-emerald-600/30" />
              </div>
            )}

            {/* Body */}
            <div className="p-6 space-y-5" dir="rtl">
              {/* Status badges */}
              <div className="flex gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${viewingProperty.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                  {viewingProperty.status === 'available' ? 'متاح' : viewingProperty.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                  {viewingProperty.listingType === 'sale' ? 'للبيع' : viewingProperty.listingType === 'rent' ? 'للإيجار' : viewingProperty.listingType}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 capitalize">
                  {viewingProperty.propertyType}
                </span>
              </div>

              {/* Price + optional rental period badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-2xl font-extrabold text-emerald-600">
                    {viewingProperty.numericPrice ? viewingProperty.numericPrice.toLocaleString() : viewingProperty.price}{' '}
                    {viewingProperty.currency || 'USD'}
                  </span>
                </div>
                {viewingProperty.rentPeriod && (viewingProperty.listingType === 'rent' || viewingProperty.listingType === 'short_term') && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    {{
                      daily: 'يومياً',
                      weekly: 'أسبوعياً',
                      monthly: 'شهرياً',
                      quarterly: 'ربع سنوي',
                      semi_annual: 'نصف سنوي',
                      yearly: 'سنوياً',
                    }[viewingProperty.rentPeriod] || viewingProperty.rentPeriod}
                  </span>
                )}
              </div>

              {/* Location */}
              {(viewingProperty.location || viewingProperty.city || viewingProperty.country) && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{viewingProperty.location || [viewingProperty.district, viewingProperty.city, viewingProperty.country].filter(Boolean).join(', ')}</span>
                </div>
              )}

              {/* Dynamic Stats Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl">
                {/* Always: bedrooms (if > 0) */}
                {(viewingProperty.bedrooms ?? 0) > 0 && (
                  <div className="flex flex-col items-center gap-1">
                    <Bed className="w-5 h-5 text-gray-400" />
                    <span className="text-base font-bold text-gray-800">{viewingProperty.bedrooms}</span>
                    <span className="text-[11px] text-gray-500">
                      {viewingProperty.propertyType === 'commercial' || viewingProperty.propertyType === 'office' ? 'غرف/مكاتب' : 'غرفة'}
                    </span>
                  </div>
                )}
                {/* Always: bathrooms (if > 0) */}
                {(viewingProperty.bathrooms ?? 0) > 0 && (
                  <div className="flex flex-col items-center gap-1">
                    <Bath className="w-5 h-5 text-gray-400" />
                    <span className="text-base font-bold text-gray-800">{viewingProperty.bathrooms}</span>
                    <span className="text-[11px] text-gray-500">حمام</span>
                  </div>
                )}
                {/* Always: area */}
                <div className="flex flex-col items-center gap-1">
                  <Maximize className="w-5 h-5 text-gray-400" />
                  <span className="text-base font-bold text-gray-800">{viewingProperty.area ?? 0}</span>
                  <span className="text-[11px] text-gray-500">{viewingProperty.areaUnit === 'sqft' ? 'SqFt' : 'م²'}</span>
                </div>
                {/* Conditional: living rooms */}
                {(viewingProperty.livingRooms ?? 0) > 0 && (
                  <div className="flex flex-col items-center gap-1">
                    <Home className="w-5 h-5 text-gray-400" />
                    <span className="text-base font-bold text-gray-800">{viewingProperty.livingRooms}</span>
                    <span className="text-[11px] text-gray-500">صالة</span>
                  </div>
                )}
                {/* Conditional: kitchens */}
                {(viewingProperty.kitchens ?? 0) > 0 && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">🍳</span>
                    <span className="text-base font-bold text-gray-800">{viewingProperty.kitchens}</span>
                    <span className="text-[11px] text-gray-500">مطبخ</span>
                  </div>
                )}
                {/* Conditional: floor number */}
                {viewingProperty.floorNumber !== undefined && viewingProperty.floorNumber !== null && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">🏢</span>
                    <span className="text-base font-bold text-gray-800">{viewingProperty.floorNumber}</span>
                    <span className="text-[11px] text-gray-500">طابق رقم</span>
                  </div>
                )}
                {/* Conditional: total floors */}
                {(viewingProperty.totalFloors ?? 0) > 0 && (
                  <div className="flex flex-col items-center gap-1">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <span className="text-base font-bold text-gray-800">{viewingProperty.totalFloors}</span>
                    <span className="text-[11px] text-gray-500">طوابق</span>
                  </div>
                )}
                {/* Conditional: parking spaces */}
                {(viewingProperty.parkingSpaces ?? 0) > 0 && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">🚗</span>
                    <span className="text-base font-bold text-gray-800">{viewingProperty.parkingSpaces}</span>
                    <span className="text-[11px] text-gray-500">موقف</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {viewingProperty.description && (
                <div className="text-sm text-gray-600 leading-relaxed border-t pt-4">
                  <p className="font-semibold text-gray-700 mb-1">الوصف:</p>
                  <p>{viewingProperty.description}</p>
                </div>
              )}

              {/* Videos */}
              {viewingProperty.videos && viewingProperty.videos.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-cyan-600" />
                    فيديوهات العقار ({viewingProperty.videos.length}):
                  </p>
                  <div className="space-y-1.5">
                    {viewingProperty.videos.map((vid, idx) => (
                      <a
                        key={idx}
                        href={vid}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-100 p-2 rounded-xl transition truncate"
                      >
                        <Film className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate font-mono">{vid}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-6 pb-6 flex gap-3 justify-end border-t pt-4" dir="rtl">
              <button
                onClick={() => setViewingProperty(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-50 transition"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  const p = viewingProperty;
                  setViewingProperty(null);
                  handleEditClick(p);
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                <Pencil className="w-4 h-4" />
                تعديل العقار
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ Add / Edit Property Modal Form ============ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto w-full p-6 space-y-6 shadow-2xl relative my-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? "تعديل العقار" : "إضافة عقار جديد"}
              </h2>
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

              {/* Price + Currency + Rental Period */}
              <div className={`grid gap-4 ${(formData.listingType === 'rent' || formData.listingType === 'short_term') ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">السعر *</label>
                  <input
                    type="number"
                    required
                    placeholder=""
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">العملة</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
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
                {/* Rental Period — shown only for rent/short_term */}
                {(formData.listingType === 'rent' || formData.listingType === 'short_term') && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      فترة الإيجار
                    </label>
                    <select
                      value={formData.rentPeriod}
                      onChange={(e) => setFormData({ ...formData, rentPeriod: e.target.value })}
                      className="w-full border rounded-xl p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="daily">يومي (Daily)</option>
                      <option value="weekly">أسبوعي (Weekly)</option>
                      <option value="monthly">شهري (Monthly)</option>
                      <option value="quarterly">ربع سنوي (Quarterly)</option>
                      <option value="semi_annual">نصف سنوي (Semi-Annual)</option>
                      <option value="yearly">سنوي (Yearly)</option>
                    </select>
                  </div>
                )}
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

              {/* ── Dynamic Specs based on property type ── */}
              <div className="space-y-3 border border-gray-100 rounded-2xl p-4 bg-gray-50/60">
                <p className="text-xs font-bold text-gray-600 mb-2">المواصفات التفصيلية</p>

                {/* Always-shown: area + unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">المساحة</label>
                    <input
                      type="number"
                      placeholder=""
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">الوحدة</label>
                    <select
                      value={formData.areaUnit}
                      onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                      className="w-full border rounded-xl p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="sqm">متر مربع (m²)</option>
                      <option value="sqft">قدم مربع (SqFt)</option>
                    </select>
                  </div>
                </div>

                {/* Apartment: bedrooms, bathrooms, living rooms, kitchens, floor number */}
                {formData.propertyType === 'apartment' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">غرف النوم</label>
                      <input type="number" min="0" placeholder="0" value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">الحمامات</label>
                      <input type="number" min="0" placeholder="0" value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">صالات المعيشة</label>
                      <input type="number" min="0" placeholder="0" value={formData.livingRooms}
                        onChange={(e) => setFormData({ ...formData, livingRooms: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">المطابخ</label>
                      <input type="number" min="0" placeholder="0" value={formData.kitchens}
                        onChange={(e) => setFormData({ ...formData, kitchens: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">رقم الطابق</label>
                      <input type="number" min="0" placeholder="0" value={formData.floorNumber}
                        onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                  </div>
                )}

                {/* Villa / Townhouse: bedrooms, bathrooms, living rooms, kitchens, total floors, parking */}
                {(formData.propertyType === 'villa' || formData.propertyType === 'townhouse') && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">غرف النوم</label>
                      <input type="number" min="0" placeholder="0" value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">الحمامات</label>
                      <input type="number" min="0" placeholder="0" value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">صالات المعيشة</label>
                      <input type="number" min="0" placeholder="0" value={formData.livingRooms}
                        onChange={(e) => setFormData({ ...formData, livingRooms: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">المطابخ</label>
                      <input type="number" min="0" placeholder="0" value={formData.kitchens}
                        onChange={(e) => setFormData({ ...formData, kitchens: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">إجمالي الطوابق</label>
                      <input type="number" min="0" placeholder="0" value={formData.totalFloors}
                        onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">مواقف السيارات</label>
                      <input type="number" min="0" placeholder="0" value={formData.parkingSpaces}
                        onChange={(e) => setFormData({ ...formData, parkingSpaces: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                  </div>
                )}

                {/* Commercial / Office / Building: rooms/offices, bathrooms, parking */}
                {(formData.propertyType === 'commercial' || formData.propertyType === 'office' || formData.propertyType === 'building') && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">غرف / مكاتب</label>
                      <input type="number" min="0" placeholder="0" value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">الحمامات</label>
                      <input type="number" min="0" placeholder="0" value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">مواقف السيارات</label>
                      <input type="number" min="0" placeholder="0" value={formData.parkingSpaces}
                        onChange={(e) => setFormData({ ...formData, parkingSpaces: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                    </div>
                  </div>
                )}

                {/* Land: no extra specs beyond area */}
                {formData.propertyType === 'land' && (
                  <p className="text-xs text-gray-400 text-center py-2">لا توجد مواصفات إضافية للأراضي — المساحة كافية.</p>
                )}
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
                  {isSubmitting
                    ? (isEditing ? "جاري التعديل..." : "جاري الحفظ...")
                    : (isEditing ? "تعديل العقار" : "حفظ العقار")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}