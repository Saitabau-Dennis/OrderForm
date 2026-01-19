"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { Store } from "@/lib/models/Store";

export async function updateOrderStatus(id: string, status: string) {
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

    // Ensure the order belongs to the user's store
    const order = await Order.findOne({ _id: id, storeId: store._id });

    if (!order) {
      return { error: "Order not found" };
    }

    order.status = status;
    await order.save();

    revalidatePath("/orders");
    revalidatePath("/dashboard");

    return { success: true, order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { error: "Something went wrong" };
  }
}
