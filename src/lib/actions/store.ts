"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function updateStoreSettings(data: any) {
  try {
    const session = await getServerSession(authOptions);

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
          theme: data.theme,
          deliveryZones: {
            create: data.deliveryZones // Assumes data.deliveryZones is [{name, price}]
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
          theme: data.theme,
          deliveryZones: {
            deleteMany: {}, // Remove all old zones
            create: data.deliveryZones // Add new ones
          }
        }
      });
    }

    revalidatePath("/settings");
    if (existingStore?.slug) {
        revalidatePath(`/${existingStore.slug}`);
    } else if (data.slug) {
        revalidatePath(`/${data.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating store settings:", error);
    return { error: "Something went wrong" };
  }
}

export async function getStoreStatus() {
  try {
    const session = await getServerSession(authOptions);

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