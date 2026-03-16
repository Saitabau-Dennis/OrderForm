import { normalizeStoreSlug } from "@/lib/slug-utils";

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "")
  .replace(/^https?:\/\//i, "")
  .replace(/\/.*$/, "")
  .toLowerCase();

const CAN_USE_SUBDOMAIN_URLS =
  Boolean(ROOT_DOMAIN) && !ROOT_DOMAIN.endsWith(".vercel.app");

function normalizePath(path: string) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function storefrontPath(storeSlug: string, path = "/") {
  const normalizedPath = normalizePath(path);

  if (CAN_USE_SUBDOMAIN_URLS) {
    return normalizedPath;
  }

  const slug = normalizeStoreSlug(storeSlug);
  if (normalizedPath === "/") {
    return `/${slug}`;
  }
  return `/${slug}${normalizedPath}`;
}
