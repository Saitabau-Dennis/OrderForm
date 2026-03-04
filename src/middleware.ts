import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);
const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.ROOT_DOMAIN || "").toLowerCase();
const RESERVED_SUBDOMAINS = new Set(["www", "app"]);
const PROTECTED_PATH_REGEX = /^\/(dashboard|settings|products|orders|onboarding)(\/|$)/;
const APP_PATHS_TO_SKIP_REWRITE = ["/login", "/register", "/forgot-password", "/reset-password"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Preserve dashboard auth protection.
  if (PROTECTED_PATH_REGEX.test(pathname) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // Skip rewriting if root domain is not configured.
  if (!ROOT_DOMAIN) {
    return NextResponse.next();
  }

  // Keep auth/dashboard routes on their original paths.
  if (PROTECTED_PATH_REGEX.test(pathname)) {
    return NextResponse.next();
  }

  if (APP_PATHS_TO_SKIP_REWRITE.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  const hostHeader = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const host = hostHeader.split(":")[0].toLowerCase();
  const rootHost = ROOT_DOMAIN;
  const wwwHost = `www.${ROOT_DOMAIN}`;

  // Main domain requests continue as-is.
  if (!host || host === rootHost || host === wwwHost) {
    return NextResponse.next();
  }

  const domainSuffix = `.${ROOT_DOMAIN}`;
  if (!host.endsWith(domainSuffix)) {
    return NextResponse.next();
  }

  const subdomain = host.slice(0, -domainSuffix.length);
  if (!subdomain || RESERVED_SUBDOMAINS.has(subdomain)) {
    return NextResponse.next();
  }

  // Prevent double-prefixing in edge cases.
  if (pathname === `/${subdomain}` || pathname.startsWith(`/${subdomain}/`)) {
    return NextResponse.next();
  }

  const rewrittenUrl = req.nextUrl.clone();
  rewrittenUrl.pathname = pathname === "/" ? `/${subdomain}` : `/${subdomain}${pathname}`;
  return NextResponse.rewrite(rewrittenUrl);
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ]
};
