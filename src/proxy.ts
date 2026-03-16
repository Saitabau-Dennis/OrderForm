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
const PUBLIC_ASSET_PATH_REGEX = /\/[^/]+\.[a-z0-9]+$/i;

function canInferTenantFromHost(host: string) {
  if (!host) return false;
  if (host === "localhost") return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false;
  if (host.endsWith(".vercel.app")) return false;
  return host.split(".").length >= 3;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const hostHeader = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const host = hostHeader.split(":")[0].toLowerCase();

  // Never rewrite public/static asset requests to tenant paths.
  // Example: `/images/mpesa.jpg` must stay unchanged on subdomains.
  if (PUBLIC_ASSET_PATH_REGEX.test(pathname)) {
    return NextResponse.next();
  }

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
  } else if (host && host !== rootHost && host !== wwwHost && host !== appHost) {
    const hostParts = host.split(".");
    if (hostParts.length >= 3) {
      const candidate = hostParts[0];
      if (candidate && !RESERVED_SUBDOMAINS.has(candidate)) {
        tenantSubdomain = candidate;
      }
    }
  } else if (!ROOT_DOMAIN && canInferTenantFromHost(host)) {
    const candidate = host.split(".")[0];
    if (candidate && !RESERVED_SUBDOMAINS.has(candidate)) {
      tenantSubdomain = candidate;
    }
  }

  if (tenantSubdomain) {
    const tenantPrefix = `/${tenantSubdomain}`;
    const normalizedPathname = pathname.toLowerCase();
    // Canonicalize tenant URLs: `slug.root/slug/...` -> `slug.root/...`.
    // Internal rewrite below maps clean path back to `/{slug}/...`.
    if (normalizedPathname === tenantPrefix || normalizedPathname.startsWith(`${tenantPrefix}/`)) {
      const pathParts = pathname.split("/");
      const firstSegment = pathParts[1] ?? "";
      const canonicalPath =
        firstSegment.toLowerCase() === tenantSubdomain
          ? `/${pathParts.slice(2).join("/")}`.replace(/\/+$/, "") || "/"
          : pathname;
      const canonicalUrl = req.nextUrl.clone();
      canonicalUrl.pathname = canonicalPath;
      return NextResponse.redirect(canonicalUrl);
    }

    // Rewrite `sub.root-domain.com/foo` -> `/{sub}/foo` for storefront routing.
    const rewrittenUrl = req.nextUrl.clone();
    rewrittenUrl.pathname = pathname === "/" ? tenantPrefix : `${tenantPrefix}${pathname}`;
    return NextResponse.rewrite(rewrittenUrl);
  }

  // Without root domain config, keep local auth behavior and skip app/root host redirects.
  if (!ROOT_DOMAIN) {
    if (PROTECTED_PATH_REGEX.test(pathname) && !isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return Response.redirect(loginUrl);
    }
    return NextResponse.next();
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
