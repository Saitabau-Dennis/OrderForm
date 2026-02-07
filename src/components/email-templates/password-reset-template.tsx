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
    <EmailLayout preview={`Your code is ${validationCode}`}>
      <Text style={{
        fontSize: "15px",
        lineHeight: "24px",
        color: "#4B5563",
        margin: "0 0 8px 0",
        fontFamily: "'Sora', Arial, sans-serif",
      }}>
        Your password reset code is
      </Text>

      <CodePill code={validationCode} />

      <Text style={{
        fontSize: "13px",
        color: "#9CA3AF",
        margin: 0,
        fontFamily: "'Sora', Arial, sans-serif",
      }}>
        Expires in 10 minutes
      </Text>
    </EmailLayout>
  );
}
