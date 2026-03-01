import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Font,
} from "@react-email/components";
import * as React from "react";

const EMAIL_THEME = {
  colors: {
    pageBackground: "#F6F7F9",
    cardBackground: "#FFFFFF",
    foreground: "#101828",
    muted: "#6B7280",
    primary: "#00311F",
    border: "#E5E7EB",
  },
} as const;

type EmailLayoutProps = {
  preview: string;
  children: React.ReactNode;
};

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Montserrat"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://cdn.jsdelivr.net/npm/@fontsource/montserrat/files/montserrat-latin-400-normal.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Montserrat"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://cdn.jsdelivr.net/npm/@fontsource/montserrat/files/montserrat-latin-600-normal.woff2",
            format: "woff2",
          }}
          fontWeight={600}
          fontStyle="normal"
        />
        <Font
          fontFamily="Montserrat"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://cdn.jsdelivr.net/npm/@fontsource/montserrat/files/montserrat-latin-700-normal.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: EMAIL_THEME.colors.pageBackground,
          fontFamily: "'Montserrat', Arial, sans-serif",
          margin: 0,
          padding: "28px 14px",
        }}
      >
        <Container
          style={{
            maxWidth: "520px",
            margin: "0 auto",
          }}
        >
          <Section
            style={{
              border: `1px solid ${EMAIL_THEME.colors.border}`,
              borderRadius: "12px",
              backgroundColor: EMAIL_THEME.colors.cardBackground,
              padding: "28px 24px",
            }}
          >
            <Text
              style={{
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                fontSize: "24px",
                lineHeight: "28px",
                fontWeight: 400,
                color: EMAIL_THEME.colors.primary,
                margin: "0 0 20px",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              Orderform
            </Text>
            <Section>{children}</Section>
          </Section>

          <Text
            style={{
              fontSize: "12px",
              lineHeight: "18px",
              color: EMAIL_THEME.colors.muted,
              textAlign: "center",
              margin: "12px 0 0",
            }}
          >
            This email was sent by OrderForm.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

type CodePillProps = {
  code: string;
  label: string;
};

export function CodePill({ code, label }: CodePillProps) {
  return (
    <Section
      style={{
        border: `1px solid ${EMAIL_THEME.colors.border}`,
        borderRadius: "10px",
        padding: "14px 12px",
        backgroundColor: "#F9FAFB",
        textAlign: "center",
        margin: "18px 0",
      }}
    >
      <Text
        style={{
          fontSize: "11px",
          lineHeight: "16px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 600,
          color: EMAIL_THEME.colors.muted,
          margin: "0 0 6px",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: "30px",
          lineHeight: "36px",
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: EMAIL_THEME.colors.primary,
          margin: 0,
          fontFamily: "'Montserrat', Arial, sans-serif",
        }}
      >
        {code}
      </Text>
    </Section>
  );
}
