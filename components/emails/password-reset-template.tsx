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

interface PasswordResetEmailProps {
  validationCode?: string;
}

export default function PasswordResetEmail({
  validationCode = "123456",
}: PasswordResetEmailProps) {
  const previewText = `Your password reset code is ${validationCode}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded-3xl my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[20px] mb-[20px]">
              <div className="flex justify-center">
                 <div className="w-12 h-12 rounded-full border-4 border-orange-500 flex items-center justify-center mb-4">
                    <div className="w-6 h-6 rounded-full bg-black"></div>
                 </div>
              </div>
              <Heading className="text-black text-[20px] font-bold text-center tracking-tight p-0 my-0 mx-0">
                Order<span className="text-orange-500">Form</span>
              </Heading>
            </Section>
            
            <Heading className="text-black text-[22px] font-medium text-center p-0 my-[20px] mx-0">
              Reset your password
            </Heading>

            <Text className="text-[#666666] text-[14px] leading-[24px] text-center">
              We received a request to reset your password. Use the code below to proceed:
            </Text>
            
            <Section className="text-center my-[32px]">
              <div className="inline-block px-8 py-4 rounded-full border-2 border-[#eaeaea] bg-slate-50">
                 <Text className="text-black text-3xl font-bold tracking-[8px] m-0 font-mono">
                    {validationCode}
                 </Text>
              </div>
            </Section>

            <Text className="text-[#666666] text-[13px] leading-[24px] text-center">
               This code will expire in 10 minutes for your security.
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
