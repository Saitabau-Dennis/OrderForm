import * as React from "react";
import {
  CodePill,
  EmailLayout,
  EmailParagraph,
  EmailTitle,
} from "@/emails/components/EmailLayout";

type PasswordResetEmailProps = {
  name?: string;
  resetUrl: string;
};

// Personalizes copy without requiring full name input.
function getFirstName(name?: string) {
  if (!name) return "there";
  const first = name.trim().split(/\s+/)[0];
  return first || "there";
}

function getCodeFromUrl(url: string) {
  try {
    return new URL(url).searchParams.get("code") ?? undefined;
  } catch {
    return undefined;
  }
}

export default function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  const firstName = getFirstName(name);
  const code = getCodeFromUrl(resetUrl);

  return (
    <EmailLayout preview="Reset your OrderForm password securely">
      <EmailTitle>Password reset request</EmailTitle>

      <EmailParagraph>Hi {firstName},</EmailParagraph>

      <EmailParagraph>
        We received a request to reset your password. Use the reset details
        below to continue.
      </EmailParagraph>

      {code ? <CodePill code={code} /> : null}

      <EmailParagraph>
        If you did not request a password reset code, you can ignore this
        email.
      </EmailParagraph>

      <EmailParagraph>
        Regards,
        <br />
        The OrderForm Team
      </EmailParagraph>
    </EmailLayout>
  );
}
