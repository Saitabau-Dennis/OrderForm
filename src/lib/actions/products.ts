"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";

export async function createProduct(data: any) {
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

    const product = await db.product.create({
      data: {
        storeId: store.id,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
        category: data.category,
        sizes: data.sizes,
        isAvailable: data.isAvailable,
        variants: data.variants || [], // Store as JSON
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

export async function updateProduct(id: string, data: any) {
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
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
        category: data.category,
        sizes: data.sizes,
        isAvailable: data.isAvailable,
        variants: data.variants || [],
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