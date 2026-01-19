import { Text } from "@react-email/components";
import * as React from "react";
import { CodePill, EmailLayout } from "@/components/emails/email-layout";

interface VerificationEmailProps {
  validationCode?: string;
}

export default function VerificationEmail({
  validationCode = "123456",
}: VerificationEmailProps) {
  const previewText = `Your OrderForm verification code: ${validationCode}`;

  return (
    <EmailLayout
      preview={previewText}
      title="Verify your email"
      footerHint="This code expires in 10 minutes. If you didn’t request it, you can ignore this email."
    >
      <Text className="m-0 mt-3.5 text-[14px] leading-[22px] text-[#404040]">
        Use the verification code below to finish creating your account.
      </Text>

      <CodePill code={validationCode} />

      <Text className="m-0 text-[13px] leading-5 text-[#737373]">
        Tip: You can copy and paste the code. If the code doesn’t work, request a new one.
      </Text>
    </EmailLayout>
  );
}
