import db from "@/lib/db";

export function normalizeStoreSlug(value: string) {
  return value.trim().toLowerCase();
}

export async function findStoreBySlug(storeSlug: string) {
  const normalizedSlug = normalizeStoreSlug(storeSlug);
  return db.store.findFirst({
    where: {
      slug: {
        equals: normalizedSlug,
        mode: "insensitive",
      },
    },
  });
}
