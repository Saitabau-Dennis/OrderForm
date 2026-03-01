import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getMpesaCallbackUrl, sendStkPush } from "@/lib/mpesa";

const StkPushSchema = z.object({
  orderId: z.string().min(1, "Order id is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = StkPushSchema.parse(body);

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            currency: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "Order is already paid" },
        { status: 400 }
      );
    }

    const callbackUrl = getMpesaCallbackUrl();
    const amount = Number(order.totalAmount);

    const initialPayment = await db.payment.create({
      data: {
        storeId: order.storeId,
        orderId: order.id,
        amount: order.totalAmount,
        currency: order.store.currency,
        phone: order.customerPhone,
        requestPayload: {
          orderId: order.id,
          callbackUrl,
          amount,
        },
      },
    });

    const stk = await sendStkPush({
      amount,
      phoneNumber: order.customerPhone,
      accountReference: order.displayId || String(order.orderNumber),
      transactionDesc: `Payment for ${order.store.name} order`,
      callbackUrl,
    });

    if (!stk.ok || !stk.data.CheckoutRequestID) {
      await db.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: initialPayment.id },
          data: {
            status: "FAILED",
            failureReason:
              stk.data.errorMessage ||
              stk.data.ResponseDescription ||
              "STK request failed",
            requestPayload: {
              mpesaRequest: stk.payload,
              mpesaResponse: stk.data,
            },
          },
        });
        await tx.paymentEvent.create({
          data: {
            storeId: order.storeId,
            paymentId: initialPayment.id,
            eventType: "STK_PUSH_FAILED",
            payload: stk.data,
          },
        });
        await tx.order.update({
          where: { id: order.id },
          data: { paymentStatus: "failed" },
        });
      });

      return NextResponse.json(
        { error: stk.data.errorMessage || "Failed to initiate STK push." },
        { status: 400 }
      );
    }

    await db.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: initialPayment.id },
        data: {
          checkoutRequestId: stk.data.CheckoutRequestID,
          merchantRequestId: stk.data.MerchantRequestID,
          providerReference: stk.data.ResponseCode,
          requestPayload: {
            mpesaRequest: stk.payload,
            mpesaResponse: stk.data,
          },
        },
      });
      await tx.paymentEvent.create({
        data: {
          storeId: order.storeId,
          paymentId: initialPayment.id,
          eventType: "STK_PUSH_REQUESTED",
          payload: stk.data,
        },
      });
      await tx.order.update({
        where: { id: order.id },
        data: { paymentStatus: "pending" },
      });
    });

    return NextResponse.json({
      success: true,
      paymentId: initialPayment.id,
      checkoutRequestId: stk.data.CheckoutRequestID,
      customerMessage:
        stk.data.CustomerMessage ||
        "M-Pesa prompt sent. Complete payment on your phone.",
    });
  } catch (error) {
    console.error("[MPESA_STK_PUSH]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Invalid request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to initiate M-Pesa payment" },
      { status: 500 }
    );
  }
}
