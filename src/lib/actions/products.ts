"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { z } from "zod";

const ProductInputSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  imageUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  sizes: z.string().optional().nullable(),
  isAvailable: z.boolean().optional(),
  variants: z.unknown().optional(),
});

type ProductInput = z.infer<typeof ProductInputSchema>;

const normalizeProductPayload = (raw: unknown): ProductInput =>
  ProductInputSchema.parse(raw);

export async function createProduct(data: unknown) {
  try {
    const payload = normalizeProductPayload(data);
    const session = await auth();

    if (!session) {
      return { error: "Unauthorized" };
    }

    const store = await db.store.findFirst({
      where: { userId: session.user.id }
    });

    if (!store) {
      return { error: "Store not found" };
    }

    const isStoreConfigured = Boolean(store.whatsappNumber?.trim());
    if (!isStoreConfigured) {
      return { error: "Please configure your store settings before adding products." };
    }

    const product = await db.product.create({
      data: {
        storeId: store.id,
        name: payload.name,
        description: payload.description ?? null,
        price: payload.price,
        imageUrl: payload.imageUrl ?? null,
        category: payload.category ?? null,
        sizes: payload.sizes ?? null,
        isAvailable: payload.isAvailable ?? true,
        variants: payload.variants ?? [], // Store as JSON
      }
    });

    revalidatePath("/products");
    revalidatePath(`/${store.slug}`);

    // Return plain object
    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    console.error("Error creating product:", error);
    return { error: "Something went wrong" };
  }
}

export async function updateProduct(id: string, data: unknown) {
  try {
    const payload = normalizeProductPayload(data);
    const session = await auth();

    if (!session) {
      return { error: "Unauthorized" };
    }

    const store = await db.store.findFirst({
      where: { userId: session.user.id }
    });

    if (!store) {
      return { error: "Store not found" };
    }

    // Ensure the product belongs to the user's store
    const product = await db.product.findFirst({
      where: { id: id, storeId: store.id }
    });

    if (!product) {
      return { error: "Product not found" };
    }

    const updatedProduct = await db.product.update({
      where: { id: id },
      data: {
        name: payload.name,
        description: payload.description ?? null,
        price: payload.price,
        imageUrl: payload.imageUrl ?? null,
        category: payload.category ?? null,
        sizes: payload.sizes ?? null,
        isAvailable: payload.isAvailable ?? true,
        variants: payload.variants ?? [],
      }
    });

    revalidatePath("/products");
    revalidatePath(`/${store.slug}`);

    return { success: true, product: JSON.parse(JSON.stringify(updatedProduct)) };
  } catch (error) {
    console.error("Error updating product:", error);
    return { error: "Something went wrong" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const session = await auth();

    if (!session) {
      return { error: "Unauthorized" };
    }

    const store = await db.store.findFirst({
      where: { userId: session.user.id }
    });

    if (!store) {
      return { error: "Store not found" };
    }

    // Delete using deleteMany to ensure storeId matches (safeguard)
    const result = await db.product.deleteMany({
      where: {
        id: id,
        storeId: store.id
      }
    });

    if (result.count === 0) {
      return { error: "Product not found" };
    }

    revalidatePath("/products");
    revalidatePath(`/${store.slug}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: "Something went wrong" };
  }
}

export async function getStoreCategories() {
  try {
    const session = await auth();

    if (!session) {
      return { error: "Unauthorized" };
    }

    const store = await db.store.findFirst({
      where: { userId: session.user.id }
    });

    if (!store) {
      return { error: "Store not found" };
    }

    const products = await db.product.findMany({
      where: {
        storeId: store.id,
        category: {
          not: null
        }
      },
      select: {
        category: true
      },
      distinct: ["category"]
    });

    const categories = products
      .map(p => p.category)
      .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));

    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: "Something went wrong" };
  }
}
