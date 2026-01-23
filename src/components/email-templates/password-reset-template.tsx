import { Text } from "@react-email/components";
import * as React from "react";
import { CodePill, EmailLayout } from "@/components/email-templates/email-layout";

interface PasswordResetEmailProps {
  validationCode?: string;
}

export default function PasswordResetEmail({
  validationCode = "123456",
}: PasswordResetEmailProps) {
  const previewText = `Your password reset code is ${validationCode}. Use this to securely reset your OrderForm password.`;

  return (
    <EmailLayout
      preview={previewText}
      title="Reset your password"
    >
      <Text className="m-0 text-[16px] leading-[26px] text-black">
        We received a request to reset your password. Use the code below to securely set a new password.
      </Text>

      <CodePill code={validationCode} />

      <Text className="m-0 text-[14px] leading-[24px] text-[#525252]">
        This code will expire in 10 minutes.
      </Text>
    </EmailLayout>
  );
}
