import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  // 1. Identity
  name: { type: String },
email: { type: String, unique: true, required: true },
image: { type: String },

// 2. Authentication
password: { type: String, select: false }, // Hashed

// 3. Email Verification
emailVerified: { type: Date },
verificationToken: { type: String },
verificationTokenExpires: { type: Date },

// 4. Password Reset
resetPasswordToken: { type: String },
resetPasswordTokenExpires: { type: Date },

}, { timestamps: true });

export const User = models.User || model("User", UserSchema);