import mongoose, { Schema, model, models } from "mongoose";

const StoreSchema = new Schema({
  // 1. Relationships
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  // 2. Identity
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // orderform.store/slug
  description: { type: String },
  whatsappNumber: { type: String },
  currency: { type: String, default: "KES" },

  // 3. Branding
  logoUrl: { type: String },
  brandColor: { type: String, default: "#30382F" }, // Hunter Green
  theme: { type: String, default: "Modern Minimalist" },

  // 4. Logistics
  deliveryZones: [{
    name: { type: String, required: true }, // e.g., "Nairobi CBD"
    price: { type: Number, required: true }  // e.g., 200
  }],

  // 5. Business Logic
  subscriptionPlan: {
    type: String,
    enum: ["free", "pro"],
    default: "free"
  },
  isActive: { type: Boolean, default: true },

  // 6. Rewards (Future)
  rewardConfig: {
    isEnabled: { type: Boolean, default: false },
    couponCode: { type: String },
    successMessage: { type: String, default: "Thanks! Here is your code:" }
  },

  // 7. Analytics
  totalViews: { type: Number, default: 0 },
  whatsappClicks: { type: Number, default: 0 }

}, { timestamps: true });

export const Store = models.Store || model("Store", StoreSchema);