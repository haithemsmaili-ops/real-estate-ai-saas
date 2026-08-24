import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // فحص ما إذا كان المسار يخص لوحة التحكم
    const isDashboardRoute = pathname.includes("/dashboard");

    // التحقق من وجود كوكيز الجلسة الخاصة بـ Supabase
    // (Supabase يخزن الجلسة عادة بأسماء تبدأ بـ sb- أو supabase-auth-token)
    const allCookies = request.cookies.getAll();
    const hasSupabaseSession = allCookies.some(
        (cookie) =>
            cookie.name.includes("sb-") ||
            cookie.name.includes("supabase") ||
            cookie.name.includes("auth")
    );

    // إذا حاول دخول الداشبورد بدون جلسة مسجلة في الكوكيز
    if (isDashboardRoute && !hasSupabaseSession) {
        const localeMatch = pathname.match(/^\/(ar|en)/);
        const locale = localeMatch ? localeMatch[1] : "ar";

        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};