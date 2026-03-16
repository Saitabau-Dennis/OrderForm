"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { normalizeStoreSlug } from "@/lib/slug-utils";

interface StoreSettingsData {
  name: string;
  description?: string;
  slug: string;
  whatsappNumber: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  xUrl?: string;
  currency: string;
  brandColor: string;
  secondaryColor?: string;
  theme: string;
  deliveryZones: { name: string; price: number }[];
}

// Creates or updates the current user's store profile and replaces delivery zones in full.
export async function updateStoreSettings(data: StoreSettingsData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const existingStore = await db.store.findFirst({
      where: { userId: session.user.id }
    });
    const normalizedSlug = normalizeStoreSlug(data.slug);

    if (!normalizedSlug) {
      return { error: "Store slug is required." };
    }

    const previousSlug = existingStore?.slug ?? null;

    if (!existingStore) {
      // First-time setup path.
      await db.store.create({
        data: {
          userId: session.user.id,
          name: data.name,
          slug: normalizedSlug,
          description: data.description,
          whatsappNumber: data.whatsappNumber,
          contactEmail: data.contactEmail || null,
          contactPhone: data.contactPhone || null,
          contactAddress: data.contactAddress || null,
          instagramUrl: data.instagramUrl || null,
          facebookUrl: data.facebookUrl || null,
          tiktokUrl: data.tiktokUrl || null,
          xUrl: data.xUrl || null,
          currency: data.currency,
          brandColor: data.brandColor,
          secondaryColor: data.secondaryColor || "#95D5B2",
          theme: data.theme,
          deliveryZones: {
            create: data.deliveryZones || []
          }
        }
      });
    } else {
      // Edit path: zones are replaced to mirror form state exactly.
      await db.store.update({
        where: { id: existingStore.id },
        data: {
          name: data.name,
          slug: normalizedSlug,
          description: data.description,
          whatsappNumber: data.whatsappNumber,
          contactEmail: data.contactEmail || null,
          contactPhone: data.contactPhone || null,
          contactAddress: data.contactAddress || null,
          instagramUrl: data.instagramUrl || null,
          facebookUrl: data.facebookUrl || null,
          tiktokUrl: data.tiktokUrl || null,
          xUrl: data.xUrl || null,
          currency: data.currency,
          brandColor: data.brandColor,
          secondaryColor: data.secondaryColor || "#95D5B2",
          theme: data.theme,
          deliveryZones: {
            deleteMany: {},
            create: data.deliveryZones || []
          }
        }
      });
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/products");

    // Revalidate both old and new storefront paths when the slug is changed.
    if (previousSlug) {
      revalidatePath(`/${previousSlug}`);
    }
    if (normalizedSlug && normalizedSlug !== previousSlug) {
      revalidatePath(`/${normalizedSlug}`);
    }

    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "This store link is already in use. Please choose another slug." };
    }
    console.error("Error updating store settings:", error);
    return { error: "Something went wrong" };
  }
}

export async function getStoreStatus() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const store = await db.store.findFirst({
      where: { userId: session.user.id }
    });

    if (!store) {
      return { configured: false, hasFirstProduct: false, onboardingComplete: false };
    }

    // Onboarding is complete only after store contact setup and at least one product.
    const isConfigured = !!store.whatsappNumber;
    const productsCount = await db.product.count({
      where: { storeId: store.id }
    });
    const hasFirstProduct = productsCount > 0;

    return {
      configured: isConfigured,
      hasFirstProduct,
      onboardingComplete: isConfigured && hasFirstProduct,
      slug: store.slug
    };
  } catch (error) {
    console.error("Error checking store status:", error);
    return { error: "Something went wrong" };
  }
}
