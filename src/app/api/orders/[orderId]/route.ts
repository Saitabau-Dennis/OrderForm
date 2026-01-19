import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { Store } from "@/lib/models/Store";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const { orderId } = await params;

    const store = await Store.findOne({ userId: session.user.id });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const order = await Order.findOne({
      _id: orderId,
      storeId: store._id,
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
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status, paymentStatus } = body;
    const { orderId } = await params;

    await dbConnect();

    const store = await Store.findOne({ userId: session.user.id });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, storeId: store._id },
      {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
      { new: true }
    );

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
