import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);
const ROOT_DOMAIN = (
  process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
  process.env.ROOT_DOMAIN ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  ""
)
  .replace(/^https?:\/\//i, "")
  .replace(/\/.*$/, "")
  .toLowerCase();
const RESERVED_SUBDOMAINS = new Set(["www", "app"]);
const PROTECTED_PATH_REGEX =
  /^\/(dashboard|settings|products|orders|onboarding|overview|customers)(\/|$)/;
const APP_PATHS_TO_SKIP_REWRITE = ["/login", "/register", "/forgot-password", "/reset-password"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Multitenant rewrites only run when a root domain is configured.
  if (!ROOT_DOMAIN) {
    // Fallback: enforce auth locally when no root domain is set.
    if (PROTECTED_PATH_REGEX.test(pathname) && !isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return Response.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const hostHeader = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const host = hostHeader.split(":")[0].toLowerCase();
  const rootHost = ROOT_DOMAIN;
  const wwwHost = `www.${ROOT_DOMAIN}`;
  const appHost = `app.${ROOT_DOMAIN}`;
  const appBaseUrl = `https://${appHost}`;
  const domainSuffix = `.${ROOT_DOMAIN}`;

  // Resolve tenant subdomain early so storefront routes are preferred over dashboard route groups.
  // Fallback inference (first label) keeps tenant routing resilient when ROOT_DOMAIN is misconfigured.
  let tenantSubdomain: string | null = null;
  if (host.endsWith(domainSuffix)) {
    const candidate = host.slice(0, -domainSuffix.length);
    if (candidate && !RESERVED_SUBDOMAINS.has(candidate)) {
      tenantSubdomain = candidate;
    }
  } else {
    const hostParts = host.split(".");
    if (hostParts.length >= 3) {
      const candidate = hostParts[0];
      if (candidate && !RESERVED_SUBDOMAINS.has(candidate)) {
        tenantSubdomain = candidate;
      }
    }
  }

  if (tenantSubdomain) {
    const tenantPrefix = `/${tenantSubdomain}`;
    // Canonicalize tenant URLs: `slug.root/slug/...` -> `slug.root/...`.
    // Internal rewrite below maps clean path back to `/{slug}/...`.
    if (pathname === tenantPrefix || pathname.startsWith(`${tenantPrefix}/`)) {
      const canonicalUrl = req.nextUrl.clone();
      canonicalUrl.pathname = pathname.slice(tenantPrefix.length) || "/";
      return NextResponse.redirect(canonicalUrl);
    }

    // Rewrite `sub.root-domain.com/foo` -> `/{sub}/foo` for storefront routing.
    const rewrittenUrl = req.nextUrl.clone();
    rewrittenUrl.pathname = pathname === "/" ? tenantPrefix : `${tenantPrefix}${pathname}`;
    return NextResponse.rewrite(rewrittenUrl);
  }

  // app.{domain}: enforce auth for dashboard, redirect root → /dashboard.
  if (host === appHost) {
    if (PROTECTED_PATH_REGEX.test(pathname) && !isLoggedIn) {
      const loginUrl = new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, appBaseUrl);
      return Response.redirect(loginUrl);
    }
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", appBaseUrl));
    }
    return NextResponse.next();
  }

  // On root/www domain: redirect dashboard & auth paths to app subdomain.
  if (!host || host === rootHost || host === wwwHost) {
    if (PROTECTED_PATH_REGEX.test(pathname) || APP_PATHS_TO_SKIP_REWRITE.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      return NextResponse.redirect(new URL(pathname + req.nextUrl.search, appBaseUrl));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ]
};
