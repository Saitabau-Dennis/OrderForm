import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";
import * as React from "react";

const EMAIL_THEME = {
  colors: {
    background: "#F5F5F5",
    card: "#FFFFFF",
    border: "#E5E5E5",
    foreground: "#000000",
    mutedForeground: "#404040",
    subtleForeground: "#737373",
    primary: "#00311F",
  },
} as const;

type EmailLayoutProps = {
  preview: string;
  title: string;
  children: React.ReactNode;
  footerHint?: string;
};

export function EmailLayout({ preview, title, children, footerHint }: EmailLayoutProps) {
  const year = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="my-auto mx-auto font-sans" style={{ backgroundColor: EMAIL_THEME.colors.background }}>
          <Section className="py-8 px-3">
            <Container className="mx-auto max-w-[520px]">
              <Section
                className="border border-solid rounded-[22px] overflow-hidden"
                style={{
                  backgroundColor: EMAIL_THEME.colors.card,
                  borderColor: EMAIL_THEME.colors.border,
                  boxShadow: "0 12px 34px rgba(0,0,0,0.08)",
                }}
              >
                <Section className="px-7 pt-6">
                  <Section className="mb-[18px]">
                    <Text
                      className="m-0 inline-block px-3 py-1.5 rounded-full text-[12px] font-semibold tracking-[0.08em]"
                      style={{ backgroundColor: EMAIL_THEME.colors.primary, color: "#FFFFFF" }}
                    >
                      ORDERFORM
                    </Text>
                  </Section>

                  <Heading
                    className="m-0 text-[22px] leading-[30px] font-semibold tracking-tight"
                    style={{ color: EMAIL_THEME.colors.foreground }}
                  >
                    {title}
                  </Heading>
                </Section>

                <Section className="px-7 pb-2">{children}</Section>

                <Hr className="my-2.5 mx-0 w-full" style={{ borderColor: EMAIL_THEME.colors.border }} />

                <Section className="px-7 pb-[22px]">
                  {footerHint ? (
                    <Text
                      className="m-0 text-[12px] leading-[18px]"
                      style={{ color: EMAIL_THEME.colors.mutedForeground }}
                    >
                      {footerHint}
                    </Text>
                  ) : null}

                  <Text
                    className="m-0 mt-2.5 text-[12px] leading-[18px]"
                    style={{ color: EMAIL_THEME.colors.subtleForeground }}
                  >
                    © {year} OrderForm. All rights reserved.
                  </Text>
                </Section>
              </Section>
            </Container>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}

type CodePillProps = {
  code: string;
};

export function CodePill({ code }: CodePillProps) {
  return (
    <Section className="my-[22px]">
      <Section
        className="border border-solid rounded-2xl px-[18px] py-3.5"
        style={{ backgroundColor: EMAIL_THEME.colors.background, borderColor: EMAIL_THEME.colors.border }}
      >
        <Text
          className="m-0 text-center text-[28px] leading-[34px] font-bold font-mono"
          style={{ color: EMAIL_THEME.colors.foreground, letterSpacing: "0.35em" }}
        >
          {code}
        </Text>
      </Section>
    </Section>
  );
}
