import mongoose, { Schema, model, models } from "mongoose";

const StoreSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  // Identity
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  whatsappNumber: { type: String, required: true },
  currency: { type: String, default: "KES" },

  // Branding
  logoUrl: { type: String },
  brandColor: { type: String, default: "#30382F" }, // Hunter Green

  // Delivery Zones (e.g. "CBD: 200")
  deliveryZones: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],

  // Subscription & Billing
  subscription: {
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free"
    },
    status: {
      type: String,
      enum: ["active", "past_due", "canceled", "trialing"],
      default: "active"
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }, // When the Pro plan expires
    stripeCustomerId: { type: String }, // Future-proofing for Stripe/Paystack
  },

  // Analytics
  totalViews: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },

}, { timestamps: true });

export const Store = models.Store || model("Store", StoreSchema);