"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import db from "@/lib/db";

const STALE_PAYMENT_MINUTES = 30;

const StartMockPaymentSchema = z.object({
  orderId: z.string().min(1),
  storeSlug: z.string().min(1),
  method: z.enum(["mpesa", "card"]).default("mpesa"),
});

const CompleteMockPaymentSchema = z.object({
  orderId: z.string().min(1),
  storeSlug: z.string().min(1),
  method: z.enum(["mpesa", "card"]).default("mpesa"),
});

const AbandonMockPaymentSchema = z.object({
  orderId: z.string().min(1),
  storeSlug: z.string().min(1),
  reason: z.string().trim().min(1).max(120).optional(),
});

const ReconcileStaleMockPaymentsSchema = z.object({
  storeSlug: z.string().min(1),
});

async function markStalePendingPaymentsAbandoned(
  tx: Prisma.TransactionClient,
  storeId: string,
  orderId?: string
) {
  const staleThreshold = new Date(Date.now() - STALE_PAYMENT_MINUTES * 60 * 1000);
  const stalePendingPayments = await tx.payment.findMany({
    where: {
      storeId,
      status: "PENDING",
      createdAt: { lt: staleThreshold },
      ...(orderId ? { orderId } : {}),
    },
    select: { id: true, orderId: true },
  });

  if (stalePendingPayments.length === 0) {
    return { abandonedPayments: 0, abandonedOrders: 0 };
  }

  const staleIds = stalePendingPayments.map((payment) => payment.id);
  await tx.payment.updateMany({
    where: { id: { in: staleIds } },
    data: {
      status: "CANCELLED",
      failureReason: `Abandoned after ${STALE_PAYMENT_MINUTES} minutes without payment.`,
    },
  });

  await tx.paymentEvent.createMany({
    data: staleIds.map((paymentId) => ({
      storeId,
      paymentId,
      eventType: "PAYMENT_ABANDONED_TIMEOUT",
      payload: {
        staleMinutes: STALE_PAYMENT_MINUTES,
      },
    })),
  });

  const staleOrderIds = Array.from(new Set(stalePendingPayments.map((payment) => payment.orderId)));
  const updatedOrders = await tx.order.updateMany({
    where: {
      id: { in: staleOrderIds },
      storeId,
      paymentStatus: "pending",
      status: { notIn: ["completed", "cancelled"] },
    },
    data: {
      paymentStatus: "failed",
      status: "abandoned",
    },
  });

  return { abandonedPayments: staleIds.length, abandonedOrders: updatedOrders.count };
}

export async function startMockPayment(input: z.infer<typeof StartMockPaymentSchema>) {
  try {
    const { orderId, storeSlug, method } = StartMockPaymentSchema.parse(input);

    const result = await db.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, store: { slug: storeSlug } },
        select: {
          id: true,
          storeId: true,
          customerPhone: true,
          totalAmount: true,
          paymentStatus: true,
          status: true,
        },
      });

      if (!order) {
        throw new Error("Order not found.");
      }

      if (order.paymentStatus === "paid" || order.status === "completed") {
        return { alreadyPaid: true as const };
      }

      await markStalePendingPaymentsAbandoned(tx, order.storeId);

      const activePendingPayment = await tx.payment.findFirst({
        where: {
          orderId: order.id,
          storeId: order.storeId,
          status: "PENDING",
        },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      if (activePendingPayment) {
        await tx.paymentEvent.create({
          data: {
            storeId: order.storeId,
            paymentId: activePendingPayment.id,
            eventType: "PAYMENT_ATTEMPT_RESUMED",
            payload: { method },
          },
        });

        return { paymentId: activePendingPayment.id, alreadyPending: true as const };
      }

      const payment = await tx.payment.create({
        data: {
          storeId: order.storeId,
          orderId: order.id,
          phone: order.customerPhone,
          amount: order.totalAmount,
          requestPayload: {
            mode: "mock",
            method,
            startedAt: new Date().toISOString(),
          },
        },
        select: { id: true },
      });

      await tx.paymentEvent.create({
        data: {
          storeId: order.storeId,
          paymentId: payment.id,
          eventType: "PAYMENT_ATTEMPT_STARTED",
          payload: { method },
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "pending",
          status: "pending",
        },
      });

      return { paymentId: payment.id, alreadyPending: false as const };
    });

    revalidatePath("/orders");
    revalidatePath("/dashboard");
    revalidatePath(`/${storeSlug}/checkout/payment`);

    if ("alreadyPaid" in result) {
      return { success: true, state: "already_paid" as const };
    }

    return {
      success: true,
      state: result.alreadyPending ? ("pending_existing" as const) : ("pending_new" as const),
      paymentId: result.paymentId,
    };
  } catch (error) {
    console.error("startMockPayment error:", error);
    return { success: false, error: "Could not start payment." };
  }
}

export async function completeMockPayment(input: z.infer<typeof CompleteMockPaymentSchema>) {
  try {
    const { orderId, storeSlug, method } = CompleteMockPaymentSchema.parse(input);

    const result = await db.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, store: { slug: storeSlug } },
        select: { id: true, storeId: true },
      });

      if (!order) {
        throw new Error("Order not found.");
      }

      let payment = await tx.payment.findFirst({
        where: {
          orderId: order.id,
          storeId: order.storeId,
          status: "PENDING",
        },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      if (!payment) {
        const latestPayment = await tx.payment.findFirst({
          where: {
            orderId: order.id,
            storeId: order.storeId,
          },
          orderBy: { createdAt: "desc" },
          select: { id: true },
        });

        payment = latestPayment;
      }

      if (!payment) {
        throw new Error("No payment attempt found.");
      }

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          paidAt: new Date(),
          providerReference: `MOCK-${randomUUID().slice(0, 8).toUpperCase()}`,
          callbackPayload: {
            mode: "mock",
            method,
            completedAt: new Date().toISOString(),
          },
          failureReason: null,
        },
      });

      await tx.paymentEvent.create({
        data: {
          storeId: order.storeId,
          paymentId: payment.id,
          eventType: "PAYMENT_SUCCEEDED",
          payload: { method },
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "paid",
          status: "completed",
        },
      });

      return { paymentId: payment.id };
    });

    revalidatePath("/orders");
    revalidatePath("/dashboard");
    revalidatePath(`/${storeSlug}/checkout/payment`);

    return { success: true, paymentId: result.paymentId };
  } catch (error) {
    console.error("completeMockPayment error:", error);
    return { success: false, error: "Could not complete payment." };
  }
}

export async function abandonMockPayment(input: z.infer<typeof AbandonMockPaymentSchema>) {
  try {
    const { orderId, storeSlug, reason } = AbandonMockPaymentSchema.parse(input);

    const result = await db.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, store: { slug: storeSlug } },
        select: { id: true, storeId: true },
      });

      if (!order) {
        return { updated: false };
      }

      const pendingPayment = await tx.payment.findFirst({
        where: {
          orderId: order.id,
          storeId: order.storeId,
          status: "PENDING",
        },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      if (!pendingPayment) {
        return { updated: false };
      }

      await tx.paymentEvent.create({
        data: {
          storeId: order.storeId,
          paymentId: pendingPayment.id,
          eventType: "PAYMENT_PAGE_EXITED",
          payload: {
            reason: reason || "left_payment_page",
            pendingWindowMinutes: STALE_PAYMENT_MINUTES,
          },
        },
      });

      return { updated: true };
    });

    revalidatePath("/orders");
    revalidatePath("/dashboard");
    revalidatePath(`/${storeSlug}/checkout/payment`);

    return { success: true, updated: result.updated };
  } catch (error) {
    console.error("abandonMockPayment error:", error);
    return { success: false, error: "Could not mark payment as abandoned." };
  }
}

export async function reconcileStaleMockPayments(input: z.infer<typeof ReconcileStaleMockPaymentsSchema>) {
  try {
    const { storeSlug } = ReconcileStaleMockPaymentsSchema.parse(input);

    const result = await db.$transaction(async (tx) => {
      const store = await tx.store.findUnique({
        where: { slug: storeSlug },
        select: { id: true },
      });

      if (!store) {
        return { abandonedPayments: 0, abandonedOrders: 0 };
      }

      return markStalePendingPaymentsAbandoned(tx, store.id);
    });

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error("reconcileStaleMockPayments error:", error);
    return { success: false, error: "Could not reconcile stale payments." };
  }
}
