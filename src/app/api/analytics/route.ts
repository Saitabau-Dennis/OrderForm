import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
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

    const orders = await Order.find({ storeId: store._id });
    const products = await Product.find({ storeId: store._id });

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;

    // Calculate sales over time (e.g., last 7 days) - simplified for now
    // In a real app, you'd aggregate this in MongoDB
    const recentOrders = await Order.find({ storeId: store._id })
      .sort({ createdAt: -1 })
      .limit(5);

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
