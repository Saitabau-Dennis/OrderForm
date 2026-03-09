import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

const EMAIL_THEME = {
  colors: {
    pageBackground: "#FFFFFF",
    cardBackground: "#FFFFFF",
    foreground: "#111827",
    muted: "#6B7280",
    primary: "#0F172A",
    accent: "#00311F",
    border: "#E5E7EB",
    soft: "#F8FAFC",
  },
  fontFamily:
    "'Liberation Sans', 'Segoe UI', Helvetica, Arial, sans-serif",
} as const;

type EmailLayoutProps = {
  preview: string;
  children: React.ReactNode;
};

type EmailTextProps = {
  children: React.ReactNode;
};

type CodePillProps = {
  code: string;
};

type EmailFooterProps = {
  appName?: string;
  supportEmail?: string;
};

// Shared wrapper for all transactional emails to keep visual and spacing consistency.
export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>

      <Body
        style={{
          backgroundColor: EMAIL_THEME.colors.pageBackground,
          fontFamily: EMAIL_THEME.fontFamily,
          margin: 0,
          padding: "32px 12px",
          color: EMAIL_THEME.colors.foreground,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: EMAIL_THEME.colors.cardBackground,
          }}
        >
          <Section
            style={{
              backgroundColor: EMAIL_THEME.colors.cardBackground,
              padding: "20px 24px",
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: "24px",
                lineHeight: "30px",
                fontWeight: 700,
                color: EMAIL_THEME.colors.foreground,
              }}
            >
              Orderform
            </Text>
          </Section>

          <Section style={{ padding: "28px 24px 8px" }}>{children}</Section>

          <EmailFooter appName="Orderform" supportEmail="support@orderform.com" />

          <Text
            style={{
              fontSize: "12px",
              lineHeight: "18px",
              color: EMAIL_THEME.colors.muted,
              textAlign: "center",
              margin: "16px 0 0",
            }}
          >
            Transactional email. Please do not reply to this message unless stated otherwise.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function EmailTitle({ children }: EmailTextProps) {
  return (
    <Text
      style={{
        fontSize: "24px",
        lineHeight: "30px",
        fontWeight: 700,
        color: EMAIL_THEME.colors.primary,
        margin: "0 0 12px",
      }}
    >
      {children}
    </Text>
  );
}

export function EmailParagraph({ children }: EmailTextProps) {
  return (
    <Text
      style={{
        fontSize: "16px",
        lineHeight: "22px",
        color: EMAIL_THEME.colors.muted,
        margin: "0 0 10px",
      }}
    >
      {children}
    </Text>
  );
}

export function EmailLinkFallback({ href }: { href: string }) {
  return (
    <>
      <Text
        style={{
          fontSize: "13px",
          lineHeight: "20px",
          color: EMAIL_THEME.colors.muted,
          margin: "0 0 6px",
        }}
      >
        If the button does not work, use this link:
      </Text>
      <Text
        style={{
          fontSize: "13px",
          lineHeight: "20px",
          color: EMAIL_THEME.colors.primary,
          wordBreak: "break-all",
          margin: "0 0 14px",
        }}
      >
        {href}
      </Text>
    </>
  );
}

export function CodePill({ code }: CodePillProps) {
  return (
    <Section
      style={{
        margin: "18px 0",
        textAlign: "center",
      }}
    >
      <Text
        style={{
          fontSize: "28px",
          lineHeight: "32px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: EMAIL_THEME.colors.accent,
          margin: 0,
          fontFamily:
            "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
        }}
      >
        {code}
      </Text>
    </Section>
  );
}

export function EmailDivider() {
  return (
    <Hr
      style={{
        borderColor: EMAIL_THEME.colors.border,
        margin: "18px 0",
      }}
    />
  );
}

export function EmailFooter({
  appName = "Orderform",
  supportEmail = "support@orderform.com",
}: EmailFooterProps) {
  return (
    <Section style={{ padding: "8px 24px 24px" }}>
      <Hr
        style={{
          borderColor: EMAIL_THEME.colors.border,
          margin: "0 0 16px",
        }}
      />
      <Text
        style={{
          fontSize: "13px",
          lineHeight: "20px",
          color: EMAIL_THEME.colors.muted,
          margin: "0 0 6px",
        }}
      >
        Need help? Contact {supportEmail}
      </Text>
      <Text
        style={{
          fontSize: "12px",
          lineHeight: "18px",
          color: EMAIL_THEME.colors.muted,
          margin: 0,
        }}
      >
        © {new Date().getFullYear()} {appName}. All rights reserved.
      </Text>
    </Section>
  );
}
