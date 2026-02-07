"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";

interface StoreSettingsData {
  name: string;
  description?: string;
  slug: string;
  whatsappNumber: string;
  currency: string;
  logoUrl?: string;
  brandColor: string;
  secondaryColor?: string;
  theme: string;
  deliveryZones: { name: string; price: number }[];
}

export async function updateStoreSettings(data: StoreSettingsData) {
  try {
    const session = await auth();

    if (!session) {
      return { error: "Unauthorized" };
    }

    const existingStore = await db.store.findFirst({
      where: { userId: session.user.id }
    });

    if (!existingStore) {
      // Create new store
      await db.store.create({
        data: {
          userId: session.user.id,
          name: data.name,
          slug: data.slug,
          whatsappNumber: data.whatsappNumber,
          currency: data.currency,
          logoUrl: data.logoUrl,
          brandColor: data.brandColor,
          secondaryColor: data.secondaryColor || "#95D5B2", // Default fallback
          theme: data.theme,
          deliveryZones: {
            create: data.deliveryZones || []
          }
        }
      });
    } else {
      // Update existing store
      await db.store.update({
        where: { id: existingStore.id },
        data: {
          name: data.name,
          description: data.description,
          whatsappNumber: data.whatsappNumber,
          currency: data.currency,
          logoUrl: data.logoUrl,
          brandColor: data.brandColor,
          secondaryColor: data.secondaryColor || "#95D5B2", // Default fallback
          theme: data.theme,
          deliveryZones: {
            deleteMany: {}, // Remove all old zones
            create: data.deliveryZones || []
          }
        }
      });
    }

    revalidatePath("/settings");

    // Revalidate store page
    const slugToRevalidate = existingStore?.slug || data.slug;
    if (slugToRevalidate) {
      revalidatePath(`/${slugToRevalidate}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating store settings:", error);
    return { error: "Something went wrong" };
  }
}

export async function getStoreStatus() {
  try {
    const session = await auth();

    if (!session) {
      return { error: "Unauthorized" };
    }

    const store = await db.store.findFirst({
      where: { userId: session.user.id }
    });

    if (!store) {
      return { configured: false };
    }

    const isConfigured = !!store.whatsappNumber;

    return {
      configured: isConfigured,
      slug: store.slug
    };
  } catch (error) {
    console.error("Error checking store status:", error);
    return { error: "Something went wrong" };
  }
}