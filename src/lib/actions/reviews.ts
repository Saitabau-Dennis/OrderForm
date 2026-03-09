"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const rewardPercentFromEnv = Number(process.env.REVIEW_REWARD_PERCENT_OFF || "10");
const rewardExpiryFromEnv = Number(process.env.REVIEW_REWARD_EXPIRY_DAYS || "30");
const DEFAULT_PERCENT_OFF =
  Number.isFinite(rewardPercentFromEnv) && rewardPercentFromEnv > 0
    ? Math.round(rewardPercentFromEnv)
    : 10;
const DEFAULT_EXPIRY_DAYS =
  Number.isFinite(rewardExpiryFromEnv) && rewardExpiryFromEnv > 0
    ? Math.round(rewardExpiryFromEnv)
    : 30;
const DEFAULT_MAX_USES = 1;

// Review submission payload expected from the public storefront.
const SubmitReviewSchema = z.object({
  storeId: z.string(),
  productId: z.string().optional(),
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(7, "Phone is required"),
  orderRef: z.string().min(1, "Order reference is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1, "Review message is required"),
  imageUrl: z.string().optional(),
});

const ReviewModerationSchema = z.object({
  reviewId: z.string(),
});

const normalizePhone = (phone: string) => phone.replace(/\D/g, "");

// Generates a readable per-store coupon code and verifies uniqueness in DB.
async function generateUniqueDiscountCode(storeName: string) {
  const storePrefix = storeName
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 4) || "SAVE";

  for (let i = 0; i < 8; i += 1) {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    const code = `${storePrefix}-${suffix}`;
    const existing = await db.discountCode.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!existing) {
      return code;
    }
  }

  throw new Error("Failed to generate unique discount code");
}

export async function submitReview({
  storeId,
  productId,
  customerName,
  customerPhone,
  orderRef,
  rating,
  comment,
  imageUrl
}: {
  storeId: string;
  productId?: string;
  customerName: string;
  customerPhone: string;
  orderRef: string;
  rating: number;
  comment: string;
  imageUrl?: string;
}) {
  try {
    const validatedData = SubmitReviewSchema.parse({
      storeId,
      productId,
      customerName,
      customerPhone,
      orderRef,
      rating,
      comment,
      imageUrl,
    });

    // Accept flexible input like "#ord-0012" and normalize matching.
    const normalizedOrderRef = validatedData.orderRef.trim().replace(/^#/, "").toUpperCase();
    const orderNumber = Number.parseInt(normalizedOrderRef.replace(/[^\d]/g, ""), 10);

    const orderCandidates = await db.order.findMany({
      where: {
        storeId: validatedData.storeId,
        OR: [
          { displayId: normalizedOrderRef },
          ...(Number.isFinite(orderNumber) ? [{ orderNumber }] : []),
        ],
      },
      include: {
        items: {
          select: { productId: true },
        },
      },
      take: 5,
    });

    // Phone match is the final ownership check for customer-submitted reviews.
    const matchedOrder = orderCandidates.find(
      (order) =>
        normalizePhone(order.customerPhone) ===
        normalizePhone(validatedData.customerPhone)
    );

    if (!matchedOrder) {
      return {
        success: false,
        error: "Order not found for this phone number. Check order reference and phone.",
      };
    }

    if (
      validatedData.productId &&
      !matchedOrder.items.some((item) => item.productId === validatedData.productId)
    ) {
      return {
        success: false,
        error: "Selected product was not found in this order.",
      };
    }

    const existingReview = await db.review.findFirst({
      where: {
        storeId: validatedData.storeId,
        orderId: matchedOrder.id,
        ...(validatedData.productId
          ? { productId: validatedData.productId }
          : { productId: null }),
      },
      select: { id: true },
    });

    if (existingReview) {
      return {
        success: false,
        error: "You already submitted a review for this purchase.",
      };
    }

    const review = await db.review.create({
      data: {
        storeId: validatedData.storeId,
        productId: validatedData.productId,
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        customerId: matchedOrder.customerId,
        orderRef: normalizedOrderRef,
        orderId: matchedOrder.id,
        rating: validatedData.rating,
        comment: validatedData.comment,
        imageUrl: validatedData.imageUrl,
        isApproved: false,
        approvalStatus: "pending",
      }
    });

    return { success: true, review };
  } catch (error) {
    console.error("Error submitting review:", error);
    return { success: false, error: "Failed to submit. Please try again." };
  }
}

export async function approveReview(reviewId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const validated = ReviewModerationSchema.parse({ reviewId });

    const store = await db.store.findFirst({
      where: { userId: session.user.id },
      select: { id: true, name: true, slug: true },
    });

    if (!store) {
      return { error: "Store not found" };
    }

    const review = await db.review.findFirst({
      where: { id: validated.reviewId, storeId: store.id },
      include: { discountCode: true },
    });

    if (!review) {
      return { error: "Review not found" };
    }

    if (review.approvalStatus === "approved" && review.discountCode) {
      return {
        success: true,
        code: review.discountCode.code,
        message: "Review already approved.",
      };
    }

    const code = await generateUniqueDiscountCode(store.name);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + DEFAULT_EXPIRY_DAYS);

    // Approving a review and creating its reward code must be atomic.
    const approvedReview = await db.$transaction(async (tx) => {
      const updatedReview = await tx.review.update({
        where: { id: review.id },
        data: {
          isApproved: true,
          approvalStatus: "approved",
          approvedAt: new Date(),
        },
      });

      await tx.discountCode.create({
        data: {
          code,
          percentOff: DEFAULT_PERCENT_OFF,
          maxUses: DEFAULT_MAX_USES,
          usedCount: 0,
          isActive: true,
          expiresAt,
          customerPhone: review.customerPhone!,
          storeId: store.id,
          reviewId: review.id,
        },
      });

      return updatedReview;
    });

    revalidatePath("/reviews");
    revalidatePath("/dashboard");
    revalidatePath(`/${store.slug}`);
    revalidatePath(`/${store.slug}/share`);

    return { success: true, review: approvedReview, code };
  } catch (error) {
    console.error("Error approving review:", error);
    return { error: "Failed to approve review" };
  }
}

export async function rejectReview(reviewId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const validated = ReviewModerationSchema.parse({ reviewId });

    const store = await db.store.findFirst({
      where: { userId: session.user.id },
      select: { id: true, slug: true },
    });

    if (!store) {
      return { error: "Store not found" };
    }

    const review = await db.review.findFirst({
      where: { id: validated.reviewId, storeId: store.id },
      select: { id: true },
    });

    if (!review) {
      return { error: "Review not found" };
    }

    const rejected = await db.review.update({
      where: { id: review.id },
      data: {
        isApproved: false,
        approvalStatus: "rejected",
      },
    });

    revalidatePath("/reviews");
    revalidatePath("/dashboard");
    revalidatePath(`/${store.slug}`);
    revalidatePath(`/${store.slug}/share`);

    return { success: true, review: rejected };
  } catch (error) {
    console.error("Error rejecting review:", error);
    return { error: "Failed to reject review" };
  }
}
