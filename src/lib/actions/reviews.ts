"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitReview({
  storeId,
  productId,
  customerName,
  rating,
  comment,
  imageUrl
}: {
  storeId: string;
  productId?: string;
  customerName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
}) {
  try {
    const review = await db.review.create({
      data: {
        storeId,
        productId,
        customerName,
        rating,
        comment,
        imageUrl,
        isApproved: false // Require approval by default
      }
    });

    // If linked to a product, we'll update stats later via a background job or worker
    // for now we just create the record.

    return { success: true, review };
  } catch (error) {
    console.error("Error submitting review:", error);
    return { success: false, error: "Failed to submit. Please try again." };
  }
}
