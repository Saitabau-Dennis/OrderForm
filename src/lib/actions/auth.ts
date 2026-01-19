"use server";

import { User } from "@/lib/models/User";
import dbConnect from "@/lib/db";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const sendVerificationCode = async (email: string) => {
  try {
    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return { error: "User not found" };
    }

    const verificationToken = crypto.randomInt(100000, 999999).toString();
    const verificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    const hashedToken = await bcrypt.hash(verificationToken, 10);

    user.verificationToken = hashedToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    return { success: "Verification code sent" };
  } catch (error) {
    console.error("Error sending verification code:", error);
    return { error: "Failed to send verification code" };
  }
};

export const verifyEmail = async (email: string, code: string) => {
  try {
    await dbConnect();
    // Find user by email and check if token is not expired
    const user = await User.findOne({
      email,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return { error: "Invalid or expired code" };
    }

    // Verify the token
    const isValid = await bcrypt.compare(code, user.verificationToken);

    if (!isValid) {
      return { error: "Invalid or expired code" };
    }

    user.emailVerified = new Date();
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return { success: "Email verified successfully" };
  } catch (error) {
    console.error("Error verifying email:", error);
    return { error: "Failed to verify email" };
  }
};

export const sendPasswordResetCode = async (email: string) => {
  try {
    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return { error: "User not found" };
    }

    const resetPasswordToken = crypto.randomInt(100000, 999999).toString();
    const resetPasswordTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

    const hashedToken = await bcrypt.hash(resetPasswordToken, 10);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpires = resetPasswordTokenExpires;
    await user.save();

    await sendPasswordResetEmail(email, resetPasswordToken);

    return { success: "Password reset code sent" };
  } catch (error) {
    console.error("Error sending password reset code:", error);
    return { error: "Failed to send password reset code" };
  }
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  try {
    await dbConnect();
    // Find user by email and check if token is not expired
    const user = await User.findOne({
      email,
      resetPasswordTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return { error: "Invalid or expired code" };
    }

    // Verify the token
    const isValid = await bcrypt.compare(code, user.resetPasswordToken);

    if (!isValid) {
      // Debugging
      console.log("Debug Reset:", {
        email,
        code,
        storedToken: user.resetPasswordToken,
        isValid
      });
      return { error: "Invalid or expired code" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    return { success: "Password reset successfully" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error: "Failed to reset password" };
  }
};
