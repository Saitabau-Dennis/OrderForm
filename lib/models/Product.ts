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

  // Analytics per product
  views: { type: Number, default: 0 },

  // Flexible Variants (e.g. Size: 42, 43 | Color: Red, Blue)
  variants: [{
    name: String, // e.g. "Size"
    options: [String] // e.g. ["40", "41", "42"]
  }]

}, { timestamps: true });

export const Product = models.Product || model("Product", ProductSchema);