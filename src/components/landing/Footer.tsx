import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { Building2 } from "lucide-react";
// قمنا باستدعاء مكون الشات هنا


interface FooterProps {
  dict: Dictionary;
  locale: Locale;
}

export function Footer({ dict, locale }: FooterProps) {
  const year = new Date().getFullYear();

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
                <li><Link href={`/${locale}#features`} className="hover:text-brand-600">{dict.nav.features}</Link></li>
                <li><Link href={`/${locale}/dashboard`} className="hover:text-brand-600">{dict.nav.dashboard}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-surface-900">{dict.footer.company}</h4>
              <ul className="mt-3 space-y-2 text-sm text-surface-600">
                <li>{dict.footer.about}</li>
                <li>{dict.footer.contact}</li>
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
      
      {/* زر ونافذة الشات سيظهران هنا في أسفل الشاشة */}

    </>
  );
}