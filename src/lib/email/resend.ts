import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const emailFrom =
  process.env.RESEND_FROM ?? "OrderForm <onboarding@resend.dev>";

// Resolves canonical app URL for links embedded in transactional emails.
export function getAppBaseUrl() {
  const fromEnv =
    process.env.APP_URL ?? process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;

  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}
