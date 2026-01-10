import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  // 1. Relationships
  storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },

  // 2. Customer Details
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  deliveryZone: { type: String }, // e.g., "Nairobi CBD"

  // 3. Order Items
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Price per unit
    variant: { type: String } // e.g., "Size: M, Color: Red"
  }],

  // 4. Financials
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },

  // 5. Status
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  // 6. Meta
  notes: { type: String }

}, { timestamps: true });

export const Order = models.Order || model("Order", OrderSchema);
