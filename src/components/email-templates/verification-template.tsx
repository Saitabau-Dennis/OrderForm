import { Text } from "@react-email/components";
import * as React from "react";
import { CodePill, EmailLayout } from "@/components/email-templates/email-layout";

interface VerificationEmailProps {
  validationCode?: string;
}

export default function VerificationEmail({
  validationCode = "123456",
}: VerificationEmailProps) {
  const previewText = `Your verification code is ${validationCode}. Confirm your email to start selling on OrderForm.`;

  return (
    <EmailLayout
      preview={previewText}
      title="Verify your email address"
    >
      <Text className="m-0 text-[16px] leading-[26px] text-black">
        Please use the verification code below to confirm your email address and activate your account.
      </Text>

      <CodePill code={validationCode} />

      <Text className="m-0 text-[14px] leading-[24px] text-[#525252]">
        This code will expire in 10 minutes.
      </Text>
    </EmailLayout>
  );
}
