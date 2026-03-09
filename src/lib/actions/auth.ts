"use server";

import db from "@/lib/db";
import { sendPasswordResetEmail, sendVerifyEmail, sendWelcomeEmail } from "@/lib/email/send-email";
import { getAppBaseUrl } from "@/lib/email/resend";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Generates and stores a short-lived verification code, then emails it to the user.
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

    const verifyUrl = `${getAppBaseUrl()}/verify-email?email=${encodeURIComponent(email)}&code=${encodeURIComponent(verificationToken)}`;
    await sendVerifyEmail(email, user.name ?? undefined, verifyUrl);

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

    // Codes are stored hashed, so verification must use bcrypt compare.
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

    const welcomeResult = await sendWelcomeEmail(email, user.name ?? undefined);
    if (!welcomeResult.success) {
      console.error("Error sending welcome email:", welcomeResult.error);
    }

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

    const resetUrl = `${getAppBaseUrl()}/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(resetToken)}`;
    await sendPasswordResetEmail(email, user.name ?? undefined, resetUrl);

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

    // Reset codes are hashed at rest for the same reason as verification codes.
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

    // Only accept password changes with a valid unexpired reset token.
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
