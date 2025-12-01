import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Raleway, Instrument_Serif, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-instrument-serif" });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument-sans" });

export const metadata: Metadata = {
  title: "OrderForm.store",
  description: "Turn Instagram Comments into WhatsApp Orders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${inter.variable} ${raleway.variable} ${instrumentSerif.variable} ${instrumentSans.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              success: 'bg-green-50 text-green-900 border-green-200',
              error: 'bg-red-50 text-red-900 border-red-200',
            }
          }}
        />
      </body>
    </html>
  );
}
