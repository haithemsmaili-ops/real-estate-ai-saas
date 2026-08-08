import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { Building2, Mail } from "lucide-react";
// قمنا باستدعاء مكون الشات هنا


interface FooterProps {
  dict: Dictionary;
  locale: Locale;
}

  const year = new Date().getFullYear();
  const [isAboutOpen, setAboutOpen] = useState(false);
  const [isContactOpen, setContactOpen] = useState(false);

  const closeModals = () => {
    setAboutOpen(false);
    setContactOpen(false);
  };
  const [isAboutOpen, setAboutOpen] = useState(false);
  const [isContactOpen, setContactOpen] = useState(false);

  const closeModals = () => {
    setAboutOpen(false);
    setContactOpen(false);
  };

  return (
    <>
      <footer className="border-t border-surface-200 bg-surface-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Link href={`/${locale}`} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="font-bold text-surface-900">{siteConfig.name}</span>
              </Link>
              <p className="mt-3 text-sm text-surface-500">{siteConfig.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-surface-900">{dict.footer.product}</h4>
              <ul className="mt-3 space-y-2 text-sm text-surface-600">
                  <li><Link href="#features" className="hover:text-brand-600">{dict.nav.features}</Link></li>
                  <li><Link href="#dashboard" className="hover:text-brand-600">{dict.nav.dashboard}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-surface-900">{dict.footer.company}</h4>
                <ul className="mt-3 space-y-2 text-sm text-surface-600">
                  <li><button onClick={() => setAboutOpen(true)} className="hover:text-brand-600 focus:outline-none">{dict.footer.about}</button></li>
                  <li><button onClick={() => setContactOpen(true)} className="hover:text-brand-600 focus:outline-none">{dict.footer.contact}</button></li>
                </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-surface-900">{dict.footer.legal}</h4>
              <ul className="mt-3 space-y-2 text-sm text-surface-600">
                <li>{dict.footer.privacy}</li>
                <li>{dict.footer.terms}</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-surface-200 pt-6 text-center text-sm text-surface-500">
            © {year} {siteConfig.name}. {dict.footer.rights}
          </div>
        </div>
      </footer>
      
      {/* About Us Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModals}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg glass-bg" onClick={e => e.stopPropagation()}>
            <button onClick={closeModals} className="absolute top-2 right-2 text-surface-500 hover:text-surface-700">✕</button>
            <h2 className="text-lg font-bold mb-4">من نحن</h2>
            <p className="text-sm text-surface-700">
              PropAI هو منصة SaaS مدعومة بالذكاء الاصطناعي صممت خصيصًا لوكالات العقارات لتأهيل العملاء الأوّلي وإدارة التواصل عبر الواتساب بشكلٍ آلي.
            </p>
          </div>
        </div>
      )}

      {/* Contact Us Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModals}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg glass-bg p-6" onClick={e => e.stopPropagation()}>
            <button onClick={closeModals} className="absolute top-2 right-2 text-surface-500 hover:text-surface-700">✕</button>
            <h2 className="text-lg font-bold mb-4">اتصل بنا</h2>
            <ul className="flex flex-col space-y-3 text-sm text-surface-700">
              <li className="flex items-center space-x-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.99 3.68 9.12 8.44 9.88v-6.99h-2.54V12h2.54V9.8c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.58V12h2.78l-.44 2.89h-2.34v6.99C18.32 21.12 22 16.99 22 12c0-5.52-4.48-10-10-10z"/></svg>
                <a href="#" className="hover:underline">Instagram Handle/URL</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <a href="mailto:official@email.com" className="hover:underline">official@email.com</a>
              </li>
              <li className="flex items-center space-x-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.023-3.034-1.848-3.034-1.849 0-2.132 1.445-2.132 2.938v5.665h-3.552V9h3.414v1.561h.047c.476-.9 1.637-1.848 3.367-1.848 3.6 0 4.267 2.368 4.267 5.452v6.287zM5.337 7.433c-1.146 0-2.072-.928-2.072-2.07 0-1.143.926-2.07 2.072-2.07 1.143 0 2.07.927 2.07 2.07 0 1.142-.927 2.07-2.07 2.07zM6.812 20.452H3.857V9h2.955v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.727v20.545C0 23.229.792 24 1.771 24h20.451C23.203 24 24 23.229 24 22.273V1.727C24 .771 23.203 0 22.225 0z"/></svg>
                <a href="#" className="hover:underline">LinkedIn Profile/URL</a>
              </li>
            </ul>
          </div>
        </div>
      )}


    </>
  );
}