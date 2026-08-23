"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Mail, Globe, Briefcase, X } from 'lucide-react';

export default function Footer({ dict }: { dict?: any }) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const f = dict?.footer || {};

  return (
    <footer className="border-t border-white/10 bg-surface-950 py-16 text-surface-400 relative overflow-hidden">
      {/* Subtle bottom glow */}
      <div className="pointer-events-none absolute bottom-0 start-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-md shadow-emerald-500/20">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">PropAI</span>
            </div>
            <p className="text-sm text-surface-400 leading-relaxed">
              {f.brandDescription || "The Ultimate AI Sales & Automation Platform for Real Estate Agencies Worldwide."}
            </p>
          </div>

          {/* Links Column 1: Products */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              {f.productHeading || f.product || "Product"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#features" className="hover:text-emerald-400 transition-colors">{f.features || "Features"}</Link></li>
              <li><Link href="#pricing" className="hover:text-emerald-400 transition-colors">{f.pricing || "Pricing"}</Link></li>
              <li><Link href="#dashboard" className="hover:text-emerald-400 transition-colors">{f.dashboard || "Dashboard"}</Link></li>
            </ul>
          </div>

          {/* Links Column 2: Company */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              {f.companyHeading || f.company || "Company"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  {f.aboutUs || f.about || "About Us"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  {f.contactUs || f.contact || "Contact Us"}
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Legal */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              {f.legalHeading || f.legal || "Legal"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">{f.privacy || "Privacy Policy"}</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">{f.terms || "Terms of Service"}</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-surface-500">
          © {new Date().getFullYear()} PropAI. {f.copyright || f.rights || "All rights reserved."}
        </div>
      </div>

      {/* --- About Modal --- */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-surface-900/95 border border-white/15 rounded-3xl max-w-md w-full p-8 shadow-[0_20px_70px_rgba(0,0,0,0.7)] relative animate-fade-in-scale">
            <button
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-4 end-4 p-2 text-surface-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">
              {f.aboutModalTitle || "About PropAI"}
            </h3>
            <p className="text-surface-300 leading-relaxed text-sm">
              {f.aboutModalText || "PropAI is an advanced AI sales and automation platform empowering real estate agencies worldwide to convert leads, schedule viewings, and close deals 24/7."}
            </p>
          </div>
        </div>
      )}

      {/* --- Contact Modal --- */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-surface-900/95 border border-white/15 rounded-3xl max-w-md w-full p-8 shadow-[0_20px_70px_rgba(0,0,0,0.7)] relative animate-fade-in-scale">
            <button
              onClick={() => setIsContactOpen(false)}
              className="absolute top-4 end-4 p-2 text-surface-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">
              {f.contactModalTitle || "Contact Us"}
            </h3>
            <div className="space-y-3.5 text-sm text-surface-300">
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span><strong>Email:</strong> contact@propai.co</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span><strong>LinkedIn:</strong> PropAI Global</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span><strong>Website:</strong> www.propai.co</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}