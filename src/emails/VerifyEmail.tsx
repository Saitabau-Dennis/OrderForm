import * as React from "react";
import {
  CodePill,
  EmailLayout,
  EmailParagraph,
  EmailTitle,
} from "@/emails/components/EmailLayout";

type VerifyEmailProps = {
  name?: string;
  verifyUrl: string;
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

export default function VerifyEmail({ name, verifyUrl }: VerifyEmailProps) {
  const firstName = getFirstName(name);
  const code = getCodeFromUrl(verifyUrl);

  return (
    <EmailLayout preview="Verify your email to activate your OrderForm account">
      <EmailTitle>Verify your email</EmailTitle>

      <EmailParagraph>Hi {firstName},</EmailParagraph>

      <EmailParagraph>
        Use the verification details below to activate your OrderForm account.
      </EmailParagraph>

      {code ? <CodePill code={code} /> : null}

      <EmailParagraph>
        If you did not request this verification code, you can ignore this
        email.
      </EmailParagraph>

      <EmailParagraph>
        Thanks,
        <br />
        The OrderForm Team
      </EmailParagraph>
    </EmailLayout>
  );
}
