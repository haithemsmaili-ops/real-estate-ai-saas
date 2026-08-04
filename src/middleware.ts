import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isValidLocale, locales } from "@/lib/i18n/config";

const LOCALE_COOKIE = "NEXT_LOCALE";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathnameLocale = pathname.split("/")[1];
  const hasLocalePrefix = isValidLocale(pathnameLocale);

  if (hasLocalePrefix) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, pathnameLocale);
    return response;
  }

  // Redirect root or non-prefixed paths to default locale or cookie preference
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