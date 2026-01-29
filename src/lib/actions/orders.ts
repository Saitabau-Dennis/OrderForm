"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { z } from "zod";
import { sendSMS } from "@/lib/sms";

const CreateOrderSchema = z.object({
  storeId: z.string(),
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(1, "Phone is required"),
  deliveryAddress: z.string().min(1, "Address is required"),
  deliveryZone: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
    variant: z.string().optional()
  })),
  totalAmount: z.number()
});

export async function createOrder(data: z.infer<typeof CreateOrderSchema>) {
  try {
    const validatedData = CreateOrderSchema.parse(data);

    // Fetch store to get name for ID generation
    const store = await db.store.findUnique({
      where: { id: validatedData.storeId }
    });

    if (!store) {
      return { error: "Store not found" };
    }

    // Generate Display ID (e.g., NIK-4821)
    const prefix = store.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "ORD");
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 1000-9999
    const displayId = `${prefix}-${randomNum}`;

    // Note: In a high-volume prod app, we'd handle collisions with a retry loop here.
    // For now, the probability is low enough for this scale.

    const order = await db.order.create({
      data: {
        storeId: validatedData.storeId,
        displayId: displayId,
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        deliveryAddress: validatedData.deliveryAddress,
        deliveryZone: validatedData.deliveryZone,
        totalAmount: validatedData.totalAmount,
        subtotal: validatedData.totalAmount, 
        items: {
          create: validatedData.items.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            variant: item.variant
          }))
        }
      }
    });

    // Send SMS Notification (Fire and forget, or await safely)
    if (store.whatsappNumber) {
      const message = `You have a new order! Order ID: #${order.displayId || order.orderNumber}`;
      
      // We await this to ensure it runs before server action returns, 
      // but catch error so it doesn't block success.
      try {
        await sendSMS(store.whatsappNumber, message);
      } catch (smsError) {
        console.error("Failed to send order SMS:", smsError);
      }
    }

    return { success: true, orderId: order.displayId || order.orderNumber, id: order.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { error: "Failed to create order" };
  }
}

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