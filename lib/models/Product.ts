import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },

  // Basic Info
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },

  // Inventory
  isAvailable: { type: Boolean, default: true },

  // Variants (MongoDB lets us store this as simple JSON)
  // Example: [{ name: "Size", options: ["42", "43"] }]
  variants: [{
    name: String,
    options: [String]
  }],

  // Social Proof
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }

}, { timestamps: true });

export const Product = models.Product || model("Product", ProductSchema);