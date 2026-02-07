import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { orderId } = await params;

    const store = await db.store.findFirst({
        where: { userId: session.user.id }
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const order = await db.order.findFirst({
        where: { id: orderId, storeId: store.id },
        include: { items: true }
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status, paymentStatus } = body;
    const { orderId } = await params;

    const store = await db.store.findFirst({
        where: { userId: session.user.id }
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // Verify ownership
    const existingOrder = await db.order.findFirst({
        where: { id: orderId, storeId: store.id }
    });

    if (!existingOrder) {
        return new NextResponse("Order not found", { status: 404 });
    }

    const order = await db.order.update({
      where: { id: orderId },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}