import * as React from "react";
import {
  EmailLayout,
  EmailParagraph,
  EmailTitle,
} from "@/emails/components/EmailLayout";

type WelcomeEmailProps = {
  name?: string;
  loginUrl?: string;
};

function getFirstName(name?: string) {
  if (!name) return "there";
  const first = name.trim().split(/\s+/)[0];
  return first || "there";
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  const firstName = getFirstName(name);

  return (
    <EmailLayout preview="Welcome to OrderForm - your account is ready">
      <EmailTitle>Welcome to OrderForm</EmailTitle>

      <EmailParagraph>Hi {firstName},</EmailParagraph>

      <EmailParagraph>
        Your account is now ready. You can log in to your dashboard and start
        setting up your store.
      </EmailParagraph>

      <EmailParagraph>
        Here is what you can do next:
        <br />
        1. Add your first product with price and image.
        <br />
        2. Set your store details and WhatsApp number.
        <br />
        3. Share your store and start receiving orders.
      </EmailParagraph>

      <EmailParagraph>
        If you need help at any point, our support team is ready to assist you.
      </EmailParagraph>

      <EmailParagraph>
        Welcome aboard,
        <br />
        The OrderForm Team
      </EmailParagraph>
    </EmailLayout>
  );
}
