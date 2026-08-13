"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";
import { LayoutDashboard, LogOut, Users, User } from "lucide-react";

interface UserMenuProps {
    locale: Locale;
}

export function UserMenu({ locale }: UserMenuProps) {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // إغلاق القائمة المنسدلة عند الضغط خارجها
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (status === "loading") {
        return (
            <div className="h-9 w-9 animate-pulse rounded-full bg-surface-200" />
        );
    }

    // إذا لم يكن المسجل داخلاً، يظهر زر Sign In
    if (!session?.user) {
        return (
            <button
                onClick={() => signIn("google", { callbackUrl: `/${locale}` })}
                className="hidden sm:inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
                Sign In
            </button>
        );
    }

    // استخراج الحروف الأولى من الاسم أو الإيميل
    const name = session.user.name || "User";
    const email = session.user.email || "";
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "U";

    return (
        <div className="relative" ref={menuRef}>
            {/* زر الأفاتار */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-surface-300 bg-brand-100 text-sm font-bold text-brand-700 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                title={name}
            >
                {session.user.image ? (
                    <img
                        src={session.user.image}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span>{initials}</span>
                )}
            </button>

            {/* القائمة المنسدلة Dropdown */}
            {isOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-56 origin-top-right rounded-2xl border border-surface-200 bg-white p-2 shadow-xl z-50 transition-all">
                    <div className="border-b border-surface-100 px-3 py-2.5">
                        <p className="truncate text-sm font-bold text-surface-900">{name}</p>
                        <p className="truncate text-xs text-surface-500">{email}</p>
                    </div>

                    <div className="py-1">
                        <Link
                            href={`/${locale}/dashboard`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-surface-700 transition-colors hover:bg-surface-100 hover:text-surface-900"
                        >
                            <LayoutDashboard className="h-4 w-4 text-brand-600" />
                            <span>لوحة التحكم</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                signIn("google", { callbackUrl: `/${locale}` });
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-surface-700 transition-colors hover:bg-surface-100 hover:text-surface-900"
                        >
                            <Users className="h-4 w-4 text-surface-500" />
                            <span>تبديل الحساب (Switch)</span>
                        </button>
                    </div>

                    <div className="border-t border-surface-100 pt-1">
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                signOut({ callbackUrl: `/${locale}` });
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                            <LogOut className="h-4 w-4 text-red-600" />
                            <span>تسجيل الخروج (Log Out)</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}