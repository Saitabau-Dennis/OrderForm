import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
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

    await dbConnect();

    const store = await Store.findOneAndUpdate(
      { userId: session.user.id },
      {
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
      },
      { new: true }
    );

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORE_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
