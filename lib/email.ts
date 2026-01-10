import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const getEmailTemplate = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #000000;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 32px;
      background-color: #ffffff;
    }
    .otp-container {
      background-color: #f4f4f5;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      margin: 24px 0;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 4px;
      color: #000000;
    }
    .footer {
      padding: 24px;
      background-color: #f9fafb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>OrderForm</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} OrderForm. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const html = getEmailTemplate(
      "Verify your email",
      `
      <h2 style="margin-top: 0; font-size: 20px; font-weight: 600; color: #111827;">Verify your email address</h2>
      <p style="margin-bottom: 24px;">Thanks for starting the process. Please use the following verification code to complete your registration:</p>
      <div class="otp-container">
        <div class="otp-code">${token}</div>
      </div>
      <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">This code will expire in 10 minutes for your security.</p>
      `
    );

    await resend.emails.send({
      from: "OrderForm <onboarding@resend.dev>", // TODO: Update with verified domain
      to: email,
      subject: "Verify your email",
      html: html,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const html = getEmailTemplate(
      "Reset your password",
      `
      <h2 style="margin-top: 0; font-size: 20px; font-weight: 600; color: #111827;">Reset your password</h2>
      <p style="margin-bottom: 24px;">We received a request to reset your password. Use the code below to proceed:</p>
      <div class="otp-container">
        <div class="otp-code">${token}</div>
      </div>
      <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">This code will expire in 10 minutes. If you didn't ask for a password reset, you can ignore this email.</p>
      `
    );

    await resend.emails.send({
      from: "OrderForm <onboarding@resend.dev>", // TODO: Update with verified domain
      to: email,
      subject: "Reset your password",
      html: html,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error };
  }
};
