import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, select: false }, // Hashed
  image: { type: String },

  // Email Verification Logic
  emailVerified: { type: Date, default: null },
  verificationToken: { type: String },
  verificationTokenExpiry: { type: Date },

  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },

}, { timestamps: true });

export const User = models.User || model("User", UserSchema);