import type { Metadata } from "next";
import { Inter, Sora, Outfit, Signika, DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const signika = Signika({ subsets: ["latin"], variable: "--font-signika" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const instrumentSerif = Instrument_Serif({ 
  weight: "400", 
  subsets: ["latin"], 
  style: "italic",
  variable: "--font-instrument-serif" 
});


export const metadata: Metadata = {
  title: "OrderForm.store",
  description: "Turn Instagram Comments into WhatsApp Orders.",
};

import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} ${outfit.variable} ${signika.variable} ${dmSans.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        <NextTopLoader color="#00311F" showSpinner={false} height={4} shadow="0 0 10px #00311F,0 0 5px #00311F" />
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              success: '!bg-green-600 !text-white !border-green-600',
              error: '!bg-red-600 !text-white !border-red-600',
            }
          }}
        />
      </body>
    </html>
  );
}
