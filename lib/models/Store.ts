import mongoose, { Schema, model, models } from "mongoose";

const StoreSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  // Identity & Branding
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // orderform.store/slug
  whatsappNumber: { type: String, required: true },
  currency: { type: String, default: "KES" },
  logoUrl: { type: String },
  brandColor: { type: String, default: "#30382F" }, // Default Hunter Green

  // Logistics (OrderForm Feature)
  deliveryZones: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],

  // Rewards Configuration (Future Feature - Ready to go)
  rewardConfig: {
    isEnabled: { type: Boolean, default: false },
    couponCode: { type: String }, // e.g., "REVIEW10"
    successMessage: { type: String, default: "Thanks! Here is your code:" }
  },

  // Subscription & Business Logic
  subscriptionPlan: {
    type: String,
    enum: ["free", "pro"],
    default: "free"
  },
  isActive: { type: Boolean, default: true },

  // Analytics
  totalViews: { type: Number, default: 0 },
  whatsappClicks: { type: Number, default: 0 }

}, { timestamps: true });

export const Store = models.Store || model("Store", StoreSchema);