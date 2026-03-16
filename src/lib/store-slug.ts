import db from "@/lib/db";
import { normalizeStoreSlug } from "@/lib/slug-utils";

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
