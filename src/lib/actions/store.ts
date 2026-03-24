"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { normalizeStoreSlug } from "@/lib/slug-utils";
import { z } from "zod";

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
  enableDelivery: boolean;
  enableShopPickup: boolean;
  shopPickupInstructions?: string;
  deliveryZones: { name: string; price: number }[];
}

const CategoryImageInputSchema = z.object({
  categoryName: z.string().trim().min(1, "Category is required"),
  imageUrl: z.string().trim().url("A valid image URL is required"),
});

const CategoryNameSchema = z.object({
  categoryName: z.string().trim().min(1, "Category is required"),
});

async function getCurrentUserStore() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" as const };
  }

  const store = await db.store.findFirst({
    where: { userId: session.user.id },
  });

  if (!store) {
    return { error: "Store not found" as const };
  }

  return { store };
}

async function getNormalizedStoreCategories(storeId: string) {
  const products = await db.product.findMany({
    where: {
      storeId,
      category: { not: null },
    },
    select: {
      category: true,
    },
    distinct: ["category"],
  });

  return products
    .map((product) => product.category?.trim() || "")
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function revalidateStorePaths(slug: string) {
  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath(`/${slug}`);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isTimeoutLikeError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "ETIMEDOUT" || error.code === "P1001";
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes("timed out") || message.includes("can't reach database server");
  }

  return false;
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
          enableDelivery: data.enableDelivery,
          enableShopPickup: data.enableShopPickup,
          shopPickupInstructions: data.shopPickupInstructions || null,
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
          enableDelivery: data.enableDelivery,
          enableShopPickup: data.enableShopPickup,
          shopPickupInstructions: data.shopPickupInstructions || null,
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

export async function getStoreCategoryImageSettings() {
  try {
    const storeResult = await getCurrentUserStore();

    if ("error" in storeResult) {
      return { error: storeResult.error };
    }

    const { store } = storeResult;
    const categories = await getNormalizedStoreCategories(store.id);

    let categoryImages: Awaited<ReturnType<typeof db.storeCategoryImage.findMany>> = [];
    try {
      categoryImages = await db.storeCategoryImage.findMany({
        where: { storeId: store.id },
        orderBy: { categoryName: "asc" },
      });
    } catch (firstError) {
      if (!isTimeoutLikeError(firstError)) {
        throw firstError;
      }

      await wait(300);

      try {
        categoryImages = await db.storeCategoryImage.findMany({
          where: { storeId: store.id },
          orderBy: { categoryName: "asc" },
        });
      } catch (secondError) {
        if (!isTimeoutLikeError(secondError)) {
          throw secondError;
        }

        console.warn("Category image query timed out; returning categories without saved images.");
        categoryImages = [];
      }
    }

    return {
      success: true,
      categories,
      categoryImages: categoryImages.map((entry) => ({
        id: entry.id,
        categoryName: entry.categoryName,
        imageUrl: entry.imageUrl,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching store category image settings:", error);
    return { error: "Something went wrong" };
  }
}

export async function upsertStoreCategoryImage(data: unknown) {
  try {
    const storeResult = await getCurrentUserStore();

    if ("error" in storeResult) {
      return { error: storeResult.error };
    }

    const { store } = storeResult;
    const payload = CategoryImageInputSchema.parse(data);
    const availableCategories = await getNormalizedStoreCategories(store.id);

    if (!availableCategories.includes(payload.categoryName)) {
      return { error: "Selected category does not exist in this store." };
    }

    const categoryImage = await db.storeCategoryImage.upsert({
      where: {
        storeId_categoryName: {
          storeId: store.id,
          categoryName: payload.categoryName,
        },
      },
      update: {
        imageUrl: payload.imageUrl,
      },
      create: {
        storeId: store.id,
        categoryName: payload.categoryName,
        imageUrl: payload.imageUrl,
      },
    });

    revalidateStorePaths(store.slug);

    return {
      success: true,
      categoryImage: {
        id: categoryImage.id,
        categoryName: categoryImage.categoryName,
        imageUrl: categoryImage.imageUrl,
        createdAt: categoryImage.createdAt.toISOString(),
        updatedAt: categoryImage.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Invalid category image data" };
    }

    console.error("Error saving store category image:", error);
    return { error: "Something went wrong" };
  }
}

export async function deleteStoreCategoryImage(data: unknown) {
  try {
    const storeResult = await getCurrentUserStore();

    if ("error" in storeResult) {
      return { error: storeResult.error };
    }

    const { store } = storeResult;
    const payload = CategoryNameSchema.parse(data);

    await db.storeCategoryImage.deleteMany({
      where: {
        storeId: store.id,
        categoryName: payload.categoryName,
      },
    });

    revalidateStorePaths(store.slug);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Invalid category image data" };
    }

    console.error("Error deleting store category image:", error);
    return { error: "Something went wrong" };
  }
}
