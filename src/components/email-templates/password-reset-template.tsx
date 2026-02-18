import { Text } from "@react-email/components";
import * as React from "react";
import { CodePill, EmailLayout } from "@/components/email-templates/email-layout";

interface PasswordResetEmailProps {
  validationCode?: string;
}

export default function PasswordResetEmail({
  validationCode = "123456",
}: PasswordResetEmailProps) {
  return (
    <EmailLayout preview={`Your OrderForm password reset code is ${validationCode}`}>
      <Text
        style={{
          fontSize: "24px",
          lineHeight: "32px",
          fontWeight: 700,
          color: "#101828",
          margin: "0 0 10px",
          textAlign: "center",
        }}
      >
        Reset your password
      </Text>

      <Text
        style={{
          fontSize: "14px",
          lineHeight: "22px",
          color: "#4B5563",
          margin: "0 0 2px",
          textAlign: "center",
        }}
      >
        Use the code below to reset your OrderForm account password.
      </Text>

      <CodePill code={validationCode} label="Reset Code" />

      <Text
        style={{
          fontSize: "13px",
          lineHeight: "20px",
          color: "#6B7280",
          margin: "0",
          textAlign: "center",
        }}
      >
        This code expires in 10 minutes. If you did not request a password
        reset, you can ignore this email.
      </Text>
    </EmailLayout>
  );
}
