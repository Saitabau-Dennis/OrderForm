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
    background: "#FFFFFF",
    foreground: "#1A1A1A",
    muted: "#6B7280",
    primary: "#00311F",
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
          fontFamily="Sora"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/sora/v12/xMQOuFFYT72X5wkB_18qmnndmSdSnk-DKQRDA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Sora"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/sora/v12/xMQOuFFYT72X5wkB_18qmnndmSdSnk-DKQRDA.woff2",
            format: "woff2",
          }}
          fontWeight={600}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{
        backgroundColor: EMAIL_THEME.colors.background,
        fontFamily: "'Sora', Arial, sans-serif",
        margin: 0,
        padding: "48px 24px",
      }}>
        <Container style={{
          maxWidth: "400px",
          margin: "0 auto",
          textAlign: "center",
        }}>
          <Text style={{
            fontSize: "18px",
            fontWeight: 600,
            color: EMAIL_THEME.colors.primary,
            margin: "0 0 40px 0",
          }}>
            OrderForm
          </Text>

          <Section>{children}</Section>
        </Container>
      </Body>
    </Html>
  );
}

type CodePillProps = {
  code: string;
};

export function CodePill({ code }: CodePillProps) {
  return (
    <Text style={{
      fontSize: "36px",
      fontWeight: 600,
      letterSpacing: "0.3em",
      color: EMAIL_THEME.colors.primary,
      margin: "32px 0",
      fontFamily: "'Sora', Arial, sans-serif",
    }}>
      {code}
    </Text>
  );
}

