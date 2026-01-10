import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema({
  // 1. Relationships
  storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product" },

  // 2. Content
  customerName: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  imageUrl: { type: String },

  // 3. Moderation
  isApproved: { type: Boolean, default: false },

}, { timestamps: true });

export const Review = models.Review || model("Review", ReviewSchema);