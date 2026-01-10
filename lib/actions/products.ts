"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Store } from "@/lib/models/Store";

export async function createProduct(data: any) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { error: "Unauthorized" };
    }

    await dbConnect();

    const store = await Store.findOne({ userId: session.user.id });

    if (!store) {
      return { error: "Store not found" };
    }

    const product = await Product.create({
      storeId: store._id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      imageUrl: data.imageUrl,
      category: data.category,
      sizes: data.sizes,
      isAvailable: data.isAvailable,
      variants: data.variants,
    });

    revalidatePath("/products");
    revalidatePath(`/${store.slug}`);

    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    console.error("Error creating product:", error);
    return { error: "Something went wrong" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { error: "Unauthorized" };
    }

    await dbConnect();

    const store = await Store.findOne({ userId: session.user.id });

    if (!store) {
      return { error: "Store not found" };
    }

    // Ensure the product belongs to the user's store
    const product = await Product.findOne({ _id: id, storeId: store._id });

    if (!product) {
      return { error: "Product not found" };
    }

    product.name = data.name;
    product.description = data.description;
    product.price = parseFloat(data.price);
    product.imageUrl = data.imageUrl;
    product.category = data.category;
    product.sizes = data.sizes;
    product.isAvailable = data.isAvailable;
    product.variants = data.variants;

    await product.save();

    revalidatePath("/products");
    revalidatePath(`/${store.slug}`);

    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    console.error("Error updating product:", error);
    return { error: "Something went wrong" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { error: "Unauthorized" };
    }

    await dbConnect();

    const store = await Store.findOne({ userId: session.user.id });

    if (!store) {
      return { error: "Store not found" };
    }

    const result = await Product.deleteOne({ _id: id, storeId: store._id });

    if (result.deletedCount === 0) {
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
