"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { randomInt } from "crypto";
import db from "@/lib/db";
import { z } from "zod";

const rewardPercentFromEnv = Number(process.env.REVIEW_REWARD_PERCENT_OFF || "10");
const DEFAULT_PERCENT_OFF =
  Number.isFinite(rewardPercentFromEnv) && rewardPercentFromEnv > 0
    ? rewardPercentFromEnv
    : 10;
const DISPLAY_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const DISPLAY_ID_RANDOM_LENGTH = 6;
const MAX_DISPLAY_ID_GENERATION_ATTEMPTS = 5;

// Validates checkout payloads coming from storefront clients.
const CreateOrderSchema = z.object({
  storeId: z.string(),
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(7, "Phone is required"),
  deliveryAddress: z.string().min(1, "Address is required"),
  deliveryZone: z.string().optional(),
  deliveryFee: z.number().min(0).optional(),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
    variant: z.string().optional()
  })),
  totalAmount: z.number().optional(),
  discountCode: z.string().trim().optional(),
  notes: z.string().optional()
});

const normalizePhone = (phone: string) => phone.replace(/\D/g, "");
const normalizePhoneForKey = (phone: string) => {
  const digits = normalizePhone(phone);
  if (digits) return digits;
  return phone.trim().toLowerCase().replace(/\s+/g, "");
};

const roundMoney = (amount: number) => Math.round(amount * 100) / 100;
// Uses a restricted alphabet to avoid ambiguous characters in human-facing IDs.
const generateDisplayIdSuffix = () =>
  Array.from({ length: DISPLAY_ID_RANDOM_LENGTH }, () =>
    DISPLAY_ID_ALPHABET[randomInt(0, DISPLAY_ID_ALPHABET.length)]
  ).join("");

export async function createOrder(data: z.infer<typeof CreateOrderSchema>) {
  try {
    const validatedData = CreateOrderSchema.parse(data);

    // Store name contributes a recognizable prefix (e.g. "NIK-XXXXXX").
    const store = await db.store.findUnique({
      where: { id: validatedData.storeId }
    });

    if (!store) {
      return { error: "Store not found" };
    }

    // Fallback to ORD when store name does not produce alphabetic characters.
    const sanitizedStoreName = store.name.replace(/[^A-Za-z]/g, "").toUpperCase();
    const prefix = sanitizedStoreName.slice(0, 3) || "ORD";

    // Always price from DB values to prevent client-side total tampering.
    const productIds = validatedData.items.map((item) => item.productId);
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        storeId: store.id,
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const lineItems = validatedData.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const unitPrice = Number(product.price);
      return {
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: unitPrice,
        variant: item.variant,
        lineTotal: unitPrice * item.quantity,
      };
    });

    const subtotal = roundMoney(
      lineItems.reduce((sum, item) => sum + item.lineTotal, 0)
    );

    const requestedCode = validatedData.discountCode?.toUpperCase().trim();
    let appliedDiscountCode: {
      id: string;
      code: string;
      percentOff: number;
      usedCount: number;
      maxUses: number;
      isActive: boolean;
      expiresAt: Date;
      customerPhone: string | null;
    } | null = null;
    let discountAmount = 0;

    if (requestedCode) {
      const discountCode = await db.discountCode.findUnique({
        where: { code: requestedCode },
      });

      // A code is valid only for the right store, in-window, below usage cap, and (optionally) same phone.
      const now = new Date();
      const validForStore = discountCode?.storeId === store.id;
      const stillUsable =
        !!discountCode &&
        discountCode.isActive &&
        discountCode.expiresAt > now &&
        discountCode.usedCount < discountCode.maxUses;
      const sameCustomer =
        !!discountCode &&
        (!discountCode.customerPhone ||
          normalizePhone(discountCode.customerPhone) ===
            normalizePhone(validatedData.customerPhone));

      if (!validForStore || !stillUsable || !sameCustomer) {
        return { error: "Invalid or expired discount code." };
      }

      appliedDiscountCode = discountCode;
      const safePercent =
        discountCode.percentOff > 0 ? discountCode.percentOff : DEFAULT_PERCENT_OFF;
      discountAmount = roundMoney((subtotal * safePercent) / 100);
    }

    const deliveryFee = roundMoney(Math.max(0, validatedData.deliveryFee ?? 0));
    const totalAmount = roundMoney(Math.max(0, subtotal - discountAmount + deliveryFee));

    const order = await db.$transaction(async (tx) => {
      const normalizedPhone = normalizePhoneForKey(validatedData.customerPhone);
      // Upsert keeps repeat buyers tied to one Customer record per normalized phone/store pair.
      const customer = await tx.customer.upsert({
        where: {
          storeId_phoneNormalized: {
            storeId: validatedData.storeId,
            phoneNormalized: normalizedPhone,
          },
        },
        update: {
          name: validatedData.customerName,
          phone: validatedData.customerPhone.trim(),
          defaultAddress: validatedData.deliveryAddress,
        },
        create: {
          storeId: validatedData.storeId,
          name: validatedData.customerName,
          phone: validatedData.customerPhone.trim(),
          phoneNormalized: normalizedPhone,
          defaultAddress: validatedData.deliveryAddress,
        },
        select: { id: true },
      });

      const createdOrder = await tx.order.create({
        data: {
          storeId: validatedData.storeId,
          customerId: customer.id,
          customerName: validatedData.customerName,
          customerPhone: validatedData.customerPhone,
          deliveryAddress: validatedData.deliveryAddress,
          deliveryZone: validatedData.deliveryZone,
          deliveryFee,
          totalAmount,
          subtotal,
          discountAmount,
          discountCodeUsed: appliedDiscountCode?.code,
          notes: validatedData.notes,
          items: {
            create: lineItems.map((item) => ({
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              variant: item.variant,
            })),
          },
        },
      });

      if (appliedDiscountCode) {
        // updateMany + guard conditions avoids race conditions under concurrent redemptions.
        const redemption = await tx.discountCode.updateMany({
          where: {
            id: appliedDiscountCode.id,
            isActive: true,
            expiresAt: { gt: new Date() },
            usedCount: { lt: appliedDiscountCode.maxUses },
          },
          data: { usedCount: { increment: 1 } },
        });

        if (redemption.count === 0) {
          throw new Error("Discount code is no longer available.");
        }

        const refreshedCode = await tx.discountCode.findUnique({
          where: { id: appliedDiscountCode.id },
          select: { usedCount: true, maxUses: true },
        });

        if (refreshedCode && refreshedCode.usedCount >= refreshedCode.maxUses) {
          await tx.discountCode.update({
            where: { id: appliedDiscountCode.id },
            data: { isActive: false },
          });
        }
      }

      let updatedOrder = null;
      // displayId uniqueness is global; retry when Prisma returns P2002 collisions.
      for (let attempt = 0; attempt < MAX_DISPLAY_ID_GENERATION_ATTEMPTS; attempt += 1) {
        const displayId = `${prefix}-${generateDisplayIdSuffix()}`;
        try {
          updatedOrder = await tx.order.update({
            where: { id: createdOrder.id },
            data: { displayId },
          });
          break;
        } catch (error) {
          if ((error as { code?: string })?.code === "P2002") {
            continue;
          }
          throw error;
        }
      }

      if (!updatedOrder) {
        throw new Error("Failed to allocate unique display ID.");
      }

      return updatedOrder;
    });

    return {
      success: true,
      orderId: order.displayId || order.orderNumber,
      id: order.id,
      pricing: {
        subtotal,
        discountAmount,
        totalAmount,
      },
      appliedDiscountCode: appliedDiscountCode?.code ?? null,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    if (error instanceof Error && error.message.includes("Discount code is no longer available")) {
      return { error: "Discount code is no longer available." };
    }
    return { error: "Failed to create order" };
  }
}

export async function updateOrderStatus(id: string, status: string) {
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
