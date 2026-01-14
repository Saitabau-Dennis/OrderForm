import { Text } from "@react-email/components";
import * as React from "react";
import { CodePill, EmailLayout } from "@/components/emails/email-layout";

interface PasswordResetEmailProps {
  validationCode?: string;
}

export default function PasswordResetEmail({
  validationCode = "123456",
}: PasswordResetEmailProps) {
  const previewText = `Your OrderForm password reset code: ${validationCode}`;

  return (
    <EmailLayout
      preview={previewText}
      title="Reset your password"
      footerHint="This code expires in 10 minutes. If you didn’t request a password reset, you can ignore this email."
    >
      <Text className="m-0 mt-3.5 text-[14px] leading-[22px] text-[#404040]">
        We received a request to reset the password for your account. Enter the code below to continue.
      </Text>

      <CodePill code={validationCode} />

      <Text className="m-0 text-[13px] leading-5 text-[#737373]">
        For your security, never share this code with anyone.
      </Text>
    </EmailLayout>
  );
}
