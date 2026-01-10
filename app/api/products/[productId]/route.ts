import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Store } from "@/lib/models/Store";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const { productId } = await params;

    const store = await Store.findOne({ userId: session.user.id });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const product = await Product.findOne({
      _id: productId,
      storeId: store._id,
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, price, category, description, imageUrl, isAvailable, variants } = body;
    const { productId } = await params;

    await dbConnect();

    const store = await Store.findOne({ userId: session.user.id });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId, storeId: store._id },
      {
        name,
        price,
        category,
        description,
        imageUrl,
        isAvailable,
        variants,
      },
      { new: true }
    );

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const { productId } = await params;

    const store = await Store.findOne({ userId: session.user.id });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const product = await Product.findOneAndDelete({
      _id: productId,
      storeId: store._id,
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
