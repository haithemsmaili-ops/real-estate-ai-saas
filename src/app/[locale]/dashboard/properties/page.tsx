"use client";

import { useState, useEffect } from "react";
import { PropertyRecord } from "@/lib/db/json-db";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب العقارات الخاصة بالمستخدم
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

  // دالة حذف العقار
  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا العقار؟")) return;

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // تحديث القائمة فورياً بعد الحذف
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("حدث خطأ أثناء حذف العقار");
      }
    } catch (err) {
      console.error(err);
      alert("تعذر الاتصال بالخادم");
    }
  };

  return (
    <div className="p-6 space-y-6 text-right">
      <h1 className="text-2xl font-bold text-gray-800">إدارة العقارات</h1>

      {loading ? (
        <p className="text-gray-500">جاري تحميل العقارات...</p>
      ) : properties.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-400">
          لا توجد عقارات مضافة بعد.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b">
                <th className="p-4">العنوان</th>
                <th className="p-4">النوع</th>
                <th className="p-4">السعر</th>
                <th className="p-4">الموقع</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id} className="border-b last:border-0 text-sm">
                  <td className="p-4 font-medium text-gray-800">{prop.title}</td>
                  <td className="p-4 text-gray-600">
                    {prop.type === "sale" ? "بيع" : "إيجار"}
                  </td>
                  <td className="p-4 text-emerald-600 font-bold">{prop.price}</td>
                  <td className="p-4 text-gray-500">{prop.location}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs">
                      {prop.status === "available" ? "متاح" : prop.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(prop.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-lg transition-colors"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}