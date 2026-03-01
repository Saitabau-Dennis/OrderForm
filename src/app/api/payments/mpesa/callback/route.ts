import { NextResponse } from "next/server";
import db from "@/lib/db";

type MpesaCallbackItem = {
  Name: string;
  Value?: string | number;
};

type MpesaCallbackPayload = {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: {
        Item?: MpesaCallbackItem[];
      };
    };
  };
};

const parseTransactionDate = (raw: string | number | undefined) => {
  if (!raw) return null;
  const value = String(raw);
  if (value.length !== 14) return null;

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const hour = Number(value.slice(8, 10));
  const minute = Number(value.slice(10, 12));
  const second = Number(value.slice(12, 14));

  const date = new Date(year, month - 1, day, hour, minute, second);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getItemValue = (
  items: MpesaCallbackItem[] | undefined,
  name: string
): string | number | undefined =>
  items?.find((item) => item.Name === name)?.Value;

export async function POST(req: Request) {
  try {
    const expectedToken = process.env.MPESA_CALLBACK_TOKEN?.trim();
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (expectedToken && token !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized callback" }, { status: 401 });
    }

    const payload = (await req.json()) as MpesaCallbackPayload;
    const callback = payload.Body?.stkCallback;
    if (!callback?.CheckoutRequestID) {
      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    const payment = await db.payment.findUnique({
      where: { checkoutRequestId: callback.CheckoutRequestID },
      select: {
        id: true,
        storeId: true,
        orderId: true,
      },
    });

    if (!payment) {
      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    const items = callback.CallbackMetadata?.Item;
    const resultCode = callback.ResultCode ?? -1;
    const resultDesc = callback.ResultDesc || "Callback received";
    const amountRaw = getItemValue(items, "Amount");
    const receiptRaw = getItemValue(items, "MpesaReceiptNumber");
    const phoneRaw = getItemValue(items, "PhoneNumber");
    const txnDateRaw = getItemValue(items, "TransactionDate");
    const paidAt = parseTransactionDate(txnDateRaw) || (resultCode === 0 ? new Date() : null);
    const parsedAmount =
      typeof amountRaw === "number"
        ? amountRaw
        : amountRaw
          ? Number(amountRaw)
          : null;
    const validAmount =
      parsedAmount !== null && Number.isFinite(parsedAmount) ? parsedAmount : null;

    if (resultCode === 0) {
      await db.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "SUCCESS",
            mpesaReceiptNumber: receiptRaw ? String(receiptRaw) : null,
            phone: phoneRaw ? String(phoneRaw) : undefined,
            ...(validAmount !== null ? { amount: validAmount } : {}),
            callbackPayload: payload,
            failureReason: null,
            paidAt,
          },
        });

        await tx.paymentEvent.create({
          data: {
            storeId: payment.storeId,
            paymentId: payment.id,
            eventType: "STK_CALLBACK_SUCCESS",
            payload,
          },
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: "paid" },
        });
      });
    } else {
      await db.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "FAILED",
            callbackPayload: payload,
            failureReason: resultDesc,
            paidAt: null,
          },
        });

        await tx.paymentEvent.create({
          data: {
            storeId: payment.storeId,
            paymentId: payment.id,
            eventType: "STK_CALLBACK_FAILED",
            payload,
          },
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: "failed" },
        });
      });
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (error) {
    console.error("[MPESA_CALLBACK]", error);
    // Return 200-style response to prevent aggressive retries while still logging failures.
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }
}
