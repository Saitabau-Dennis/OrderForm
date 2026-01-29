"use server";

import db from "@/lib/db";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const sendVerificationCode = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return { error: "User not found" };
    }

    const verificationToken = crypto.randomInt(100000, 999999).toString();
    const verificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    const hashedToken = await bcrypt.hash(verificationToken, 10);

    await db.user.update({
      where: { email },
      data: {
        verificationToken: hashedToken,
        verificationTokenExpires
      }
    });

    await sendVerificationEmail(email, verificationToken);

    return { success: "Verification code sent" };
  } catch (error) {
    console.error("Error sending verification code:", error);
    return { error: "Failed to send verification code" };
  }
};

export const verifyEmail = async (email: string, code: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
        verificationTokenExpires: { gt: new Date() }
      }
    });

    if (!user || !user.verificationToken) {
      return { error: "Invalid or expired code" };
    }

    // Verify the token
    const isValid = await bcrypt.compare(code, user.verificationToken);

    if (!isValid) {
      return { error: "Invalid or expired code" };
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null
      }
    });

    return { success: "Email verified successfully" };
  } catch (error) {
    console.error("Error verifying email:", error);
    return { error: "Failed to verify email" };
  }
};

export const sendPasswordResetCode = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return { error: "User not found" };
    }

    const resetToken = crypto.randomInt(100000, 999999).toString();
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const hashedToken = await bcrypt.hash(resetToken, 10);

    await db.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry
      }
    });

    await sendPasswordResetEmail(email, resetToken);

    return { success: "Password reset code sent" };
  } catch (error) {
    console.error("Error sending password reset code:", error);
    return { error: "Failed to send password reset code" };
  }
};

export const verifyResetCode = async (email: string, code: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user || !user.resetToken) {
      return { error: "Invalid or expired code" };
    }

    // Verify the token
    const isValid = await bcrypt.compare(code, user.resetToken);

    if (!isValid) {
      return { error: "Invalid or expired code" };
    }

    return { success: "Code verified" };
  } catch (error) {
    console.error("Error verifying reset code:", error);
    return { error: "Failed to verify code" };
  }
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user || !user.resetToken) {
      return { error: "Invalid or expired code" };
    }

    // Verify the token
    const isValid = await bcrypt.compare(code, user.resetToken);

    if (!isValid) {
      return { error: "Invalid or expired code" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return { success: "Password reset successfully" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error: "Failed to reset password" };
  }
};
