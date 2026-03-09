import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

// Lists products for the authenticated store owner.
export async function GET(req: Request) {
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

    const products = await db.product.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, price, category, description, imageUrl, galleryImages, isAvailable, sizes, variants } = body;
    // Guard against duplicate/empty URLs coming from client forms.
    const normalizedGalleryImages = Array.from(
      new Set(
        (Array.isArray(galleryImages) ? galleryImages : [])
          .filter((item): item is string => typeof item === "string" && item.trim() !== "")
      )
    );

    if (!name || !price) {
      return new NextResponse("Name and price are required", { status: 400 });
    }

    const store = await db.store.findFirst({
        where: { userId: session.user.id }
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const isStoreConfigured = Boolean(store.whatsappNumber?.trim());
    // Enforce basic store setup before product publishing.
    if (!isStoreConfigured) {
      return new NextResponse("Please configure your store settings before adding products.", { status: 400 });
    }

    const product = await db.product.create({
      data: {
        storeId: store.id,
        name,
        price: parseFloat(price),
        category,
        description,
        imageUrl,
        galleryImages: normalizedGalleryImages,
        isAvailable,
        sizes,
        variants: variants || []
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
