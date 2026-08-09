'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer({ dict }: { dict?: any }) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer className="border-t border-surface-200 bg-surface-50 py-12 dark:border-surface-800 dark:bg-surface-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-surface-900 dark:text-white">PropAI</h3>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              {dict?.footer?.brandDescription || "منصة الذكاء الاصطناعي الأولى للوكالات العقارية في الجزائر لتمكين الاستجابة الفورية وتأهيل العملاء."}
            </p>
          </div>

          {/* Links Column 1: Products */}
          <div>
            <h4 className="font-semibold text-surface-900 dark:text-white mb-3">{dict?.footer?.productHeading || "Product"}</h4>
            <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
              <li><Link href="#features" className="hover:text-brand-600">الميزات الاستثنائية</Link></li>
              <li><Link href="#dashboard" className="hover:text-brand-600">لوحة التحكم الذكية</Link></li>
            </ul>
          </div>

          {/* Links Column 2: Company */}
          <div>
            <h4 className="font-semibold text-surface-900 dark:text-white mb-3">{dict?.footer?.companyHeading || "Company"}</h4>
            <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
              <li>
                  <button
                    onClick={() => setIsAboutOpen(true)}
                    className="hover:text-brand-600 w-full transition-colors cursor-pointer"
                  >
                    {dict?.footer?.aboutUs || "About Us"}
                  </button>
              </li>
              <li>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="hover:text-brand-600 w-full transition-colors cursor-pointer"
                  >
                    {dict?.footer?.contactUs || "Contact Us"}
                  </button>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Legal */}
          <div>
            <h4 className="font-semibold text-surface-900 dark:text-white mb-3">{dict?.footer?.legalHeading || "Legal"}</h4>
            <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                <li><Link href="#" className="hover:text-brand-600">{dict?.footer?.privacy || "Privacy Policy"}</Link></li>
                <li><Link href="#" className="hover:text-brand-600">{dict?.footer?.terms || "Terms of Service"}</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-surface-200 dark:border-surface-800 text-center text-sm text-surface-500">
          © {new Date().getFullYear()} PropAI. {dict?.footer?.copyright || "All rights reserved."}
        </div>
      </div>

      {/* --- About Modal --- */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-4 left-4 text-surface-500 hover:text-surface-900 dark:hover:text-white font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-4">{dict?.footer?.aboutModalTitle || "About PropAI"}</h3>
            <p className="text-surface-600 dark:text-surface-300 leading-relaxed text-sm">
              {dict?.footer?.aboutModalText || "PropAI هي منصة ذكاء اصطناعي متقدمة مخصصة للوكالات العقارية في الجزائر. تتيح لك المنصة الرد الآلي والفوري على استفسارات العملاء عبر الواتساب، وتأهيل المشتريين المحتملين على مدار 24/7 دون أي أخطاء."}
            </p>
          </div>
        </div>
      )}

      {/* --- Contact Modal --- */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsContactOpen(false)}
              className="absolute top-4 left-4 text-surface-500 hover:text-surface-900 dark:hover:text-white font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-4">{dict?.footer?.contactModalTitle || "Contact Us"}</h3>
            <div className="space-y-3 text-sm text-surface-600 dark:text-surface-300">
              <p>📧 <strong>البريد الإلكتروني:</strong> contact@propai.com</p>
              <p>📸 <strong>انستغرام:</strong> @propai.dz</p>
              <p>💼 <strong>لينكد إن:</strong> PropAI Algeria</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}