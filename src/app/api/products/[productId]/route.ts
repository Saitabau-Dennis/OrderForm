import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

// Reads one product and enforces store ownership.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { productId } = await params;

    const store = await db.store.findFirst({
        where: { userId: session.user.id }
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const product = await db.product.findFirst({
        where: { id: productId, storeId: store.id }
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
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, price, stock, optionStocks, category, description, imageUrl, galleryImages, isAvailable, variants, sizes } = body;
    // Keep gallery payload clean and stable before persistence.
    const normalizedGalleryImages = Array.from(
      new Set(
        (Array.isArray(galleryImages) ? galleryImages : [])
          .filter((item): item is string => typeof item === "string" && item.trim() !== "")
      )
    );
    const { productId } = await params;

    const store = await db.store.findFirst({
        where: { userId: session.user.id }
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // Ensure users can only edit products in their own store.
    const existingProduct = await db.product.findFirst({
        where: { id: productId, storeId: store.id }
    });

    if (!existingProduct) {
        return new NextResponse("Product not found", { status: 404 });
    }

    const normalizedOptionStocks = Object.entries(
      optionStocks && typeof optionStocks === "object" ? optionStocks as Record<string, unknown> : {}
    )
      .map(([optionValue, qty]) => ({
        optionValue: optionValue.trim().toLowerCase(),
        stock: Math.max(0, Math.trunc(Number(qty))),
      }))
      .filter((row) => row.optionValue.length > 0 && Number.isFinite(row.stock));

    const product = await db.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id: productId },
        data: {
          name,
          price: parseFloat(price),
          stock: stock === "" || stock === undefined || stock === null
            ? null
            : (Number.isFinite(Number(stock))
              ? Math.max(0, Math.trunc(Number(stock)))
              : existingProduct.stock),
          category,
          description,
          imageUrl,
          galleryImages: normalizedGalleryImages,
          isAvailable,
          variants: variants || [],
          sizes
        }
      });

      await tx.productOptionStock.deleteMany({
        where: { productId },
      });

      if (normalizedOptionStocks.length > 0) {
        await tx.productOptionStock.createMany({
          data: normalizedOptionStocks.map((row) => ({
            productId,
            optionValue: row.optionValue,
            stock: row.stock,
          })),
        });
      }

      return updated;
    });

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
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { productId } = await params;

    const store = await db.store.findFirst({
        where: { userId: session.user.id }
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // deleteMany ensures the ID belongs to this store in the same statement.
    const result = await db.product.deleteMany({
      where: {
        id: productId,
        storeId: store.id,
      }
    });

    if (result.count === 0) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
