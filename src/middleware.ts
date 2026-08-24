import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isValidLocale, locales } from "@/lib/i18n/config";

const LOCALE_COOKIE = "NEXT_LOCALE";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. استثناء API والملفات الثابتة
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. التحقق من وجود توكن تسجيل الدخول (Auth Token) في الـ Cookies لحماية لوحة التحكم
  const hasAuthToken =
    request.cookies.has("sb-access-token") ||
    request.cookies.has("supabase-auth-token") ||
    Array.from(request.cookies.getAll()).some((cookie) =>
      cookie.name.includes("auth-token")
    );

  // إذا حاول الزائر دخول /dashboard بدون توكن تسجيل الدخول، حوّله لصفحة الدخول
  if (pathname.includes("/dashboard") && !hasAuthToken) {
    const localeMatch = pathname.split("/")[1];
    const locale = isValidLocale(localeMatch) ? localeMatch : defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. معالجة بادئة اللغة (Locale Prefix)
  const pathnameLocale = pathname.split("/")[1];
  const hasLocalePrefix = isValidLocale(pathnameLocale);

  if (hasLocalePrefix) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, pathnameLocale);
    return response;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : defaultLocale;

  const targetPath = pathname === "/" ? "" : pathname;
  const redirectUrl = new URL(`/${locale}${targetPath}`, request.url);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export { locales };