import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  // 1. Relationships
  storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },

  // 2. Basic Info
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  category: { type: String }, // e.g., "Clothing", "Footwear"
  sizes: { type: String }, // Comma-separated sizes

  // 3. Inventory
  isAvailable: { type: Boolean, default: true },

  // 4. Variants (Size/Color options)
  variants: [{
    name: String,
    options: [String]
  }],

  // 5. Stats
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }

}, { timestamps: true });

export const Product = models.Product || model("Product", ProductSchema);