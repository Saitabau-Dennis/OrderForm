import type { ReactNode } from "react";

export type SendEmailResult =
  | { success: true; id?: string }
  | { success: false; error: unknown };

export type SendEmailPayload = {
  to: string;
  subject: string;
  react: ReactNode;
};
