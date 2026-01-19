import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { Store } from "@/lib/models/Store";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const store = await Store.findOne({ userId: session.user.id });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const orders = await Order.find({ storeId: store._id }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
