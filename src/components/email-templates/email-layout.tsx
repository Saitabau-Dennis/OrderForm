import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

const EMAIL_THEME = {
  colors: {
    background: "#ffffff",
    foreground: "#0a0a0a",
    mutedForeground: "#525252",
    border: "#e5e5e5",
    primary: "#000000",
  },
} as const;

type EmailLayoutProps = {
  preview: string;
  title: string;
  children: React.ReactNode;
};

export function EmailLayout({ preview, title, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="mx-auto font-sans antialiased" style={{ backgroundColor: EMAIL_THEME.colors.background }}>
          <Container className="mx-auto my-[40px] max-w-[465px] p-[20px]">

            
            <Heading
              className="mx-0 my-[30px] p-0 text-[30px] font-semibold text-black tracking-tight"
            >
              {title}
            </Heading>

            <Section>{children}</Section>
          </Container>
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
    <Section className="my-[40px]">
      <Text
        className="m-0 text-[40px] font-bold tracking-[0.2em] font-mono"
        style={{ color: EMAIL_THEME.colors.primary }}
      >
        {code}
      </Text>
    </Section>
  );
}
