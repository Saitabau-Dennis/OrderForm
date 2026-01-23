import { Resend } from "resend";
import VerificationEmail from "@/components/email-templates/verification-template";
import PasswordResetEmail from "@/components/email-templates/password-reset-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: "OrderForm <onboarding@resend.dev>", 
      to: email,
      subject: `Verify your OrderForm account with code: ${token}`,
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
      subject: `Reset your OrderForm password with this code: ${token}`,
      react: <PasswordResetEmail validationCode={token} />,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error };
  }
};
