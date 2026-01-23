"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function updateOrderStatus(id: string, status: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { error: "Unauthorized" };
    }

    const store = await db.store.findFirst({
        where: { userId: session.user.id }
    });

    if (!store) {
      return { error: "Store not found" };
    }

    // Ensure the order belongs to the user's store
    const order = await db.order.findFirst({
        where: { id: id, storeId: store.id }
    });

    if (!order) {
      return { error: "Order not found" };
    }

    const updatedOrder = await db.order.update({
        where: { id: id },
        data: { status }
    });

    revalidatePath("/orders");
    revalidatePath("/dashboard");

    return { success: true, order: JSON.parse(JSON.stringify(updatedOrder)) };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { error: "Something went wrong" };
  }
}