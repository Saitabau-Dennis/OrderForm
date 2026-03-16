import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { normalizeStoreSlug } from "@/lib/store-slug";

// Returns the current merchant store profile and related delivery zones.
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const store = await db.store.findFirst({
        where: { userId: session.user.id },
        include: { deliveryZones: true }
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
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      whatsappNumber,
      contactEmail,
      contactPhone,
      contactAddress,
      instagramUrl,
      facebookUrl,
      tiktokUrl,
      xUrl,
      currency,
      brandColor,
      theme,
      description,
      deliveryZones,
      isActive,
    } = body;
    const normalizedSlug = normalizeStoreSlug(String(slug ?? ""));

    if (!normalizedSlug) {
      return new NextResponse("Store slug is required", { status: 400 });
    }

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
        slug: normalizedSlug,
        whatsappNumber,
        contactEmail,
        contactPhone,
        contactAddress,
        instagramUrl,
        facebookUrl,
        tiktokUrl,
        xUrl,
        currency,
        brandColor,
        theme,
        description,
        isActive,
        deliveryZones: {
            // Replace zones with the latest submitted list from settings UI.
            deleteMany: {},
            create: deliveryZones
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
