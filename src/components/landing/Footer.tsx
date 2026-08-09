'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function Footer() {
  const { t } = useTranslation();
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
                              {t('footer.brandDescription')}
            </p>
          </div>

          {/* Links Column 1: Products */}
          <div>
            <h4 className="font-semibold text-surface-900 dark:text-white mb-3">{t('footer.productHeading')}</h4>
            <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
              <li><Link href="#features" className="hover:text-brand-600">{t('footer.features')}</Link></li>
              <li><Link href="#dashboard" className="hover:text-brand-600">{t('footer.dashboard')}</Link></li>
            </ul>
          </div>

          {/* Links Column 2: Company */}
          <div>
            <h4 className="font-semibold text-surface-900 dark:text-white mb-3">{t('footer.companyHeading')}</h4>
            <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
              <li>
                  <button
                    onClick={() => setIsAboutOpen(true)}
                    className="hover:text-brand-600 w-full transition-colors cursor-pointer"
                  >
                                        {t('footer.aboutUs')}
                  </button>
              </li>
              <li>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="hover:text-brand-600 w-full transition-colors cursor-pointer"
                  >
                                        {t('footer.contactUs')}
                  </button>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Legal */}
          <div>
            <h4 className="font-semibold text-surface-900 dark:text-white mb-3">{t('footer.legalHeading')}</h4>
            <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                <li><Link href="#" className="hover:text-brand-600">{t('footer.privacy')}</Link></li>
                <li><Link href="#" className="hover:text-brand-600">{t('footer.terms')}</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-surface-200 dark:border-surface-800 text-center text-sm text-surface-500">
          © {new Date().getFullYear()} PropAI. {t('footer.copyright')}
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
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-4">{t('footer.aboutModalTitle')}</h3>
            <p className="text-surface-600 dark:text-surface-300 leading-relaxed text-sm">
              {t('footer.aboutModalText')}
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
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-4">{t('footer.contactModalTitle')}</h3>
            <div className="space-y-3 text-sm text-surface-600 dark:text-surface-300">
              <p>📧 <strong>{t('footer.emailLabel')}:</strong> contact@propai.com</p>
              <p>📸 <strong>{t('footer.instagramLabel')}:</strong> @propai.dz</p>
              <p>💼 <strong>{t('footer.linkedinLabel')}:</strong> PropAI Algeria</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}