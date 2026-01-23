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
        where: { userId: session.user.id },
        include: { deliveryZones: true } // Include relation
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      whatsappNumber,
      currency,
      logoUrl,
      brandColor,
      theme,
      description,
      deliveryZones,
      isActive,
    } = body;

    const existingStore = await db.store.findFirst({
        where: { userId: session.user.id }
    });

    if (!existingStore) {
        return new NextResponse("Store not found", { status: 404 });
    }

    const store = await db.store.update({
      where: { id: existingStore.id },
      data: {
        name,
        slug,
        whatsappNumber,
        currency,
        logoUrl,
        brandColor,
        theme,
        description,
        isActive,
        deliveryZones: {
            deleteMany: {},
            create: deliveryZones // Assumes [{name, price}]
        }
      },
      include: { deliveryZones: true }
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORE_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}