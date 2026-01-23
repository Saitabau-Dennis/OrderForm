import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import db from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const store = await db.store.findFirst({
        where: { userId: session.user.id }
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // Efficient Aggregation
    const revenueAggregation = await db.order.aggregate({
        _sum: { totalAmount: true },
        where: { storeId: store.id }
    });
    const totalRevenue = revenueAggregation._sum.totalAmount || 0;

    const totalOrders = await db.order.count({
        where: { storeId: store.id }
    });

    const totalProducts = await db.product.count({
        where: { storeId: store.id }
    });

    const recentOrders = await db.order.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { items: true }
    });

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      recentOrders,
    });
  } catch (error) {
    console.error("[ANALYTICS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}