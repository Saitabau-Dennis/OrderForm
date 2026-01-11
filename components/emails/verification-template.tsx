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
  Img,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  validationCode?: string;
}

export default function VerificationEmail({
  validationCode = "123456",
}: VerificationEmailProps) {
  const previewText = `Your verification code is ${validationCode}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded-3xl my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[20px] mb-[20px]">
              <div className="flex justify-center">
                 <div className="w-12 h-12 rounded-full border-4 border-[#22c55e] flex items-center justify-center mb-4">
                    <div className="w-6 h-6 rounded-full bg-black"></div>
                 </div>
              </div>
              <Heading className="text-black text-[20px] font-bold text-center tracking-tight p-0 my-0 mx-0">
                Order<span className="text-[#22c55e]">Form</span>
              </Heading>
            </Section>
            
            <Heading className="text-black text-[22px] font-medium text-center p-0 my-[20px] mx-0">
              Verify your email address
            </Heading>

            <Text className="text-[#666666] text-[14px] leading-[24px] text-center">
              Please enter the following verification code to complete your registration.
            </Text>
            
            <Section className="text-center my-[32px]">
              <div className="inline-block px-8 py-4 rounded-full border-2 border-[#eaeaea] bg-slate-50">
                 <Text className="text-black text-3xl font-bold tracking-[8px] m-0 font-mono">
                    {validationCode}
                 </Text>
              </div>
            </Section>

            <Text className="text-[#666666] text-[13px] leading-[24px] text-center">
               This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.
            </Text>
            
            <Hr className="border-[#eaeaea] my-[26px] mx-0 w-full" />
            
            <Text className="text-[#a1a1aa] text-[12px] leading-[20px] text-center">
               © {new Date().getFullYear()} OrderForm. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
