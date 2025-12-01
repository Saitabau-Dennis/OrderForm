import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema({
  storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product" },

  // Customer Content
  customerName: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  imageUrl: { type: String },
  comment: String,

  // Moderation (Crucial for safety)
  isApproved: { type: Boolean, default: false },

}, { timestamps: true });

export const Review = models.Review || model("Review", ReviewSchema);