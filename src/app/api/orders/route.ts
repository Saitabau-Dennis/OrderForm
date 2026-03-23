import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

// Lists orders (with items) for the authenticated merchant.
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const store = await db.store.findFirst({
        where: { userId: session.user.id }
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const orders = await db.order.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: 'desc' },
        include: { items: true }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
