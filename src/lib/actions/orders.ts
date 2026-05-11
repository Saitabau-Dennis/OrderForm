"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { randomInt } from "crypto";
import db from "@/lib/db";
import { z } from "zod";
import { extractVariantOptionValues, normalizeToken, variantLabelToStockKey } from "@/lib/inventory";

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
  fulfillmentMethod: z.enum(["delivery", "shop_pickup"]).default("delivery"),
  shipToDifferentAddress: z.boolean().default(false),
  billingAddressLine1: z.string().optional(),
  billingAddressLine2: z.string().optional(),
  billingZoneId: z.string().optional(),
  shippingRecipientName: z.string().optional(),
  shippingRecipientPhone: z.string().optional(),
  shippingAddressLine1: z.string().optional(),
  shippingAddressLine2: z.string().optional(),
  shippingZoneId: z.string().optional(),
  // Legacy fields kept to support older clients until they are fully rolled out.
  deliveryAddress: z.string().optional(),
  deliveryZoneId: z.string().optional(),
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
      where: { id: validatedData.storeId },
      select: {
        id: true,
        slug: true,
        name: true,
        enableDelivery: true,
        enableShopPickup: true,
        deliveryZones: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
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
        stock: true,
        isAvailable: true,
        optionStocks: {
          select: {
            optionValue: true,
            stock: true,
          },
        },
      },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const lineItems = validatedData.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (!product.isAvailable) {
        throw new Error(`Product unavailable: ${product.name}`);
      }
      if (product.optionStocks.length > 0) {
        const optionStockMap = new Map(
          product.optionStocks.map((row) => [normalizeToken(row.optionValue), row.stock])
        );
        const exactVariantKey = variantLabelToStockKey(item.variant);
        const normalizedRequestedOptions = extractVariantOptionValues(item.variant);
        const hasKnownOption =
          (exactVariantKey ? optionStockMap.has(exactVariantKey) : false) ||
          normalizedRequestedOptions.some((value) => optionStockMap.has(value));
        if (!hasKnownOption) {
          throw new Error(`Please select a valid product option for ${product.name}`);
        }
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
    // Consolidate duplicate product IDs (e.g. same product with multiple variants) for stock reservation.
    const requestedQuantityByProduct = lineItems.reduce((acc, item) => {
      acc.set(item.productId, (acc.get(item.productId) || 0) + item.quantity);
      return acc;
    }, new Map<string, number>());
    const requestedQuantityByProductOption = lineItems.reduce((acc, item) => {
      const productOptions = acc.get(item.productId) || new Map<string, number>();
      const exactVariantKey = variantLabelToStockKey(item.variant);
      if (exactVariantKey) {
        productOptions.set(exactVariantKey, (productOptions.get(exactVariantKey) || 0) + item.quantity);
      } else {
        for (const optionValue of extractVariantOptionValues(item.variant)) {
          const normalized = normalizeToken(optionValue);
          if (!normalized) continue;
          productOptions.set(normalized, (productOptions.get(normalized) || 0) + item.quantity);
        }
      }
      acc.set(item.productId, productOptions);
      return acc;
    }, new Map<string, Map<string, number>>());

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

    const isDelivery = validatedData.fulfillmentMethod === "delivery";
    const shipToDifferentAddress = isDelivery ? validatedData.shipToDifferentAddress : false;
    const billingAddressLine1 =
      validatedData.billingAddressLine1?.trim() || validatedData.deliveryAddress?.trim() || null;
    const billingAddressLine2 = validatedData.billingAddressLine2?.trim() || null;
    const billingZoneId = validatedData.billingZoneId?.trim() || null;
    const shippingRecipientName = shipToDifferentAddress
      ? validatedData.shippingRecipientName?.trim() || null
      : validatedData.customerName.trim();
    const shippingRecipientPhone = shipToDifferentAddress
      ? validatedData.shippingRecipientPhone?.trim() || null
      : validatedData.customerPhone.trim();
    const shippingAddressLine1 = shipToDifferentAddress
      ? validatedData.shippingAddressLine1?.trim() || null
      : billingAddressLine1;
    const shippingAddressLine2 = shipToDifferentAddress
      ? validatedData.shippingAddressLine2?.trim() || null
      : billingAddressLine2;
    const shippingZoneIdInput = shipToDifferentAddress
      ? validatedData.shippingZoneId?.trim() || null
      : billingZoneId || validatedData.deliveryZoneId?.trim() || null;
    const selectedZone = shippingZoneIdInput
      ? store.deliveryZones.find((zone) => zone.id === shippingZoneIdInput)
      : undefined;
    const deliveryAddress = [shippingAddressLine1, shippingAddressLine2].filter(Boolean).join(", ") || null;
    const billingAddress = [billingAddressLine1, billingAddressLine2].filter(Boolean).join(", ") || null;

    if (isDelivery && !store.enableDelivery) {
      return { error: "Delivery is currently unavailable for this store." };
    }

    if (!isDelivery && !store.enableShopPickup) {
      return { error: "Shop pickup is currently unavailable for this store." };
    }

    if (isDelivery && (!shippingAddressLine1 || shippingAddressLine1.length < 8)) {
      return { error: "Address is required for delivery." };
    }
    if (isDelivery && (!shippingRecipientName || shippingRecipientName.length < 2)) {
      return { error: "Recipient name is required for delivery." };
    }
    if (isDelivery) {
      const recipientPhoneDigits = normalizePhone(shippingRecipientPhone || "");
      if (recipientPhoneDigits.length < 10 || recipientPhoneDigits.length > 12) {
        return { error: "Recipient phone is invalid." };
      }
    }

    if (isDelivery && store.deliveryZones.length > 0 && !shippingZoneIdInput) {
      return { error: "Please select a valid delivery zone." };
    }

    if (isDelivery && shippingZoneIdInput && !selectedZone) {
      return { error: "Selected delivery zone is invalid." };
    }

    const deliveryZoneName = isDelivery ? selectedZone?.name : null;
    const deliveryZoneId = isDelivery ? selectedZone?.id ?? null : null;
    const deliveryFee = roundMoney(
      isDelivery && selectedZone ? Number(selectedZone.price) : 0
    );
    const totalAmount = roundMoney(Math.max(0, subtotal - discountAmount + deliveryFee));

    const order = await db.$transaction(async (tx) => {
      for (const [productId, quantity] of requestedQuantityByProduct.entries()) {
        const product = productMap.get(productId);
        if (!product) {
          throw new Error(`Product not found: ${productId}`);
        }
        const optionStocksMap = new Map(
          product.optionStocks.map((row) => [normalizeToken(row.optionValue), row.stock])
        );
        const requestedOptionQuantities = requestedQuantityByProductOption.get(productId) || new Map<string, number>();

        let reservedByOption = false;
        for (const [optionValue, optionQty] of requestedOptionQuantities.entries()) {
          if (!optionStocksMap.has(optionValue)) continue;

          reservedByOption = true;
          const optionStockReservation = await tx.productOptionStock.updateMany({
            where: {
              productId,
              optionValue,
              stock: { gte: optionQty },
            },
            data: {
              stock: { decrement: optionQty },
            },
          });

          if (optionStockReservation.count === 0) {
            throw new Error(`Insufficient stock for ${product.name} (${optionValue})`);
          }
        }

        if (!reservedByOption && product.stock !== null) {
          const stockReservation = await tx.product.updateMany({
            where: {
              id: productId,
              storeId: validatedData.storeId,
              isAvailable: true,
              stock: { gte: quantity },
            },
            data: {
              stock: { decrement: quantity },
            },
          });

          if (stockReservation.count === 0) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
        }
      }

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
          ...(billingAddress ? { defaultAddress: billingAddress } : {}),
        },
        create: {
          storeId: validatedData.storeId,
          name: validatedData.customerName,
          phone: validatedData.customerPhone.trim(),
          phoneNormalized: normalizedPhone,
          defaultAddress: billingAddress,
        },
        select: { id: true },
      });

      const fulfillmentMethod: "DELIVERY" | "SHOP_PICKUP" = isDelivery ? "DELIVERY" : "SHOP_PICKUP";
      const createOrderData = {
        storeId: validatedData.storeId,
        customerId: customer.id,
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        fulfillmentMethod,
        shipToDifferentAddress,
        billingAddressLine1,
        billingAddressLine2,
        billingZoneId,
        shippingAddressLine1: isDelivery ? shippingAddressLine1 : null,
        shippingAddressLine2: isDelivery ? shippingAddressLine2 : null,
        shippingZoneId: isDelivery ? selectedZone?.id ?? null : null,
        deliveryAddress,
        deliveryZoneId,
        deliveryZone: deliveryZoneName,
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
      };
      // Added dynamically to keep compatibility with environments pinned to older Prisma client typings.
      const createOrderDataWithRecipient = createOrderData as Record<string, unknown>;
      createOrderDataWithRecipient.shippingRecipientName = isDelivery ? shippingRecipientName : null;
      createOrderDataWithRecipient.shippingRecipientPhone = isDelivery ? shippingRecipientPhone : null;

      const createdOrder = await tx.order.create({
        data: createOrderData,
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

    revalidatePath(`/${store.slug}`);
    revalidatePath(`/${store.slug}/catalog`);

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
    if (error instanceof Error && error.message.includes("Insufficient stock")) {
      return { error: error.message };
    }
    if (error instanceof Error && error.message.includes("Product unavailable")) {
      return { error: error.message };
    }
    if (error instanceof Error && error.message.includes("Please select a valid product option")) {
      return { error: error.message };
    }
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
