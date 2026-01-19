import { Resend } from "resend";
import VerificationEmail from "@/components/emails/verification-template";
import PasswordResetEmail from "@/components/emails/password-reset-template";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: "OrderForm <onboarding@resend.dev>", 
      to: email,
      subject: "Verify your email",
      react: <VerificationEmail validationCode={token} />,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: "OrderForm <onboarding@resend.dev>", 
      to: email,
      subject: "Reset your password",
      react: <PasswordResetEmail validationCode={token} />,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error };
  }
};
