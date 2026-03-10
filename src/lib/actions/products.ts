"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { z } from "zod";

const ProductInputSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    z.coerce.number().int().min(0).nullable()
  ),
  optionStocks: z.record(z.string(), z.coerce.number().int().min(0)).optional().default({}),
  imageUrl: z.string().optional().nullable(),
  galleryImages: z.array(z.string()).optional().default([]),
  category: z.string().optional().nullable(),
  sizes: z.string().optional().nullable(),
  isAvailable: z.boolean().optional(),
  variants: z.unknown().optional(),
});

type ProductInput = z.infer<typeof ProductInputSchema>;

// Parses and validates unknown payloads from forms/APIs before DB writes.
const normalizeProductPayload = (raw: unknown): ProductInput =>
  ProductInputSchema.parse(raw);

// Deduplicates gallery URLs and drops empty entries.
const normalizeGallery = (images: string[] | undefined) =>
  Array.from(new Set((images ?? []).map((value) => value.trim()).filter(Boolean)));

const normalizeOptionStocks = (optionStocks: Record<string, number> | undefined) =>
  Object.entries(optionStocks ?? {})
    .map(([optionValue, stock]) => ({
      optionValue: optionValue.trim().toLowerCase(),
      stock: Math.max(0, Math.trunc(Number(stock))),
    }))
    .filter((row) => row.optionValue.length > 0);

export async function createProduct(data: unknown) {
  try {
    const payload = normalizeProductPayload(data);
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const store = await db.store.findFirst({
      where: { userId: session.user.id }
    });

    if (!store) {
      return { error: "Store not found" };
    }

    const isStoreConfigured = Boolean(store.whatsappNumber?.trim());
    // Products cannot be published until core store contact setup is complete.
    if (!isStoreConfigured) {
      return { error: "Please configure your store settings before adding products." };
    }

    const normalizedOptionStocks = normalizeOptionStocks(payload.optionStocks);
    const product = await db.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          storeId: store.id,
          name: payload.name,
          description: payload.description ?? null,
          price: payload.price,
          stock: payload.stock ?? null,
          imageUrl: payload.imageUrl ?? null,
          galleryImages: normalizeGallery(payload.galleryImages),
          category: payload.category ?? null,
          sizes: payload.sizes ?? null,
          isAvailable: payload.isAvailable ?? true,
          variants: payload.variants ?? [], // Persisted as JSON for flexible option structures.
        }
      });

      if (normalizedOptionStocks.length > 0) {
        await tx.productOptionStock.createMany({
          data: normalizedOptionStocks.map((row) => ({
            productId: createdProduct.id,
            optionValue: row.optionValue,
            stock: row.stock,
          })),
        });
      }

      return createdProduct;
    });

    revalidatePath("/products");
    revalidatePath(`/${store.slug}`);

    // Normalize Prisma Decimal/Date fields into plain JSON-safe values.
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

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const store = await db.store.findFirst({
      where: { userId: session.user.id }
    });

    if (!store) {
      return { error: "Store not found" };
    }

    // Ownership check prevents cross-store product edits.
    const product = await db.product.findFirst({
      where: { id: id, storeId: store.id }
    });

    if (!product) {
      return { error: "Product not found" };
    }

    const normalizedOptionStocks = normalizeOptionStocks(payload.optionStocks);
    const updatedProduct = await db.$transaction(async (tx) => {
      const nextProduct = await tx.product.update({
        where: { id: id },
        data: {
          name: payload.name,
          description: payload.description ?? null,
          price: payload.price,
          stock: payload.stock ?? null,
          imageUrl: payload.imageUrl ?? null,
          galleryImages: normalizeGallery(payload.galleryImages),
          category: payload.category ?? null,
          sizes: payload.sizes ?? null,
          isAvailable: payload.isAvailable ?? true,
          variants: payload.variants ?? [],
        }
      });

      await tx.productOptionStock.deleteMany({
        where: { productId: id },
      });

      if (normalizedOptionStocks.length > 0) {
        await tx.productOptionStock.createMany({
          data: normalizedOptionStocks.map((row) => ({
            productId: id,
            optionValue: row.optionValue,
            stock: row.stock,
          })),
        });
      }

      return nextProduct;
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

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const store = await db.store.findFirst({
      where: { userId: session.user.id }
    });

    if (!store) {
      return { error: "Store not found" };
    }

    // deleteMany enforces both ID and storeId in one query.
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

    if (!session?.user?.id) {
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
