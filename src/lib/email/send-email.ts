import { createElement } from "react";
import type { SendEmailPayload, SendEmailResult } from "@/lib/email/types";
import { emailFrom, getAppBaseUrl, resend } from "@/lib/email/resend";
import WelcomeEmail from "@/emails/WelcomeEmail";
import VerifyEmail from "@/emails/VerifyEmail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";

// Shared transport wrapper so all transactional emails return a consistent result shape.
async function sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  try {
    const response = await resend.emails.send({
      from: emailFrom,
      to: payload.to,
      subject: payload.subject,
      react: payload.react,
    });

    return { success: true, id: response.data?.id };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(to: string, name?: string): Promise<SendEmailResult> {
  const loginUrl = `${getAppBaseUrl()}/login`;

  return sendEmail({
    to,
    subject: "Welcome to OrderForm",
    react: createElement(WelcomeEmail, { name, loginUrl }),
  });
}

export async function sendVerifyEmail(
  to: string,
  name: string | undefined,
  verifyUrl: string,
): Promise<SendEmailResult> {
  return sendEmail({
    to,
    subject: "Verify your OrderForm email",
    react: createElement(VerifyEmail, { name, verifyUrl }),
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string | undefined,
  resetUrl: string,
): Promise<SendEmailResult> {
  return sendEmail({
    to,
    subject: "Reset your OrderForm password",
    react: createElement(PasswordResetEmail, { name, resetUrl }),
  });
}
