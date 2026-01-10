"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Store } from "@/lib/models/Store";

export async function updateStoreSettings(data: any) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { error: "Unauthorized" };
    }

    await dbConnect();

    let store = await Store.findOne({ userId: session.user.id });

    if (!store) {
      // Create new store
      store = new Store({
        userId: session.user.id,
        name: data.name,
        slug: data.slug,
        whatsappNumber: data.whatsappNumber,
        currency: data.currency,
        logoUrl: data.logoUrl,
        brandColor: data.brandColor,
        theme: data.theme,
        deliveryZones: data.deliveryZones,
      });
    } else {
      // Update existing store
      store.name = data.name;
      store.description = data.description;
      store.whatsappNumber = data.whatsappNumber;
      store.currency = data.currency;
      store.logoUrl = data.logoUrl;
      store.brandColor = data.brandColor;
      store.theme = data.theme;
      store.deliveryZones = data.deliveryZones;
    }

    await store.save();

    revalidatePath("/settings");
    revalidatePath(`/${store.slug}`); // Revalidate the public store page as well

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

    await dbConnect();

    const store = await Store.findOne({ userId: session.user.id });

    if (!store) {
      return { configured: false };
    }

    // Check if essential fields are filled
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
