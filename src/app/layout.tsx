import type { Metadata } from "next";
import { Inter, Sora, Outfit, Signika, DM_Sans, Instrument_Serif, Poppins, Plus_Jakarta_Sans, Bungee, Montserrat, Azeret_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const signika = Signika({ subsets: ["latin"], variable: "--font-signika" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins"
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta"
});
const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-brand-display"
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});
const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-azeret-mono",
});
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: "italic",
  variable: "--font-instrument-serif"
});

const clashDisplay = localFont({
  src: "../../public/Fonts/ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash-display",
});

const adcure = localFont({
  src: "../../public/Fonts/adcure-font/adcure.otf",
  variable: "--font-adcure",
});

const goodly = localFont({
  src: [
    {
      path: "../../public/Fonts/goodly-font/goodly-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Fonts/goodly-font/goodly-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/Fonts/goodly-font/goodly-semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/Fonts/goodly-font/goodly-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-goodly",
});


export const metadata: Metadata = {
  title: "OrderForm.store",
  description: "Turn Instagram Comments into WhatsApp Orders.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    google: "notranslate",
  },
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning translate="no" className="notranslate">
      <body className={`${inter.variable} ${sora.variable} ${outfit.variable} ${signika.variable} ${dmSans.variable} ${instrumentSerif.variable} ${poppins.variable} ${jakarta.variable} ${bungee.variable} ${montserrat.variable} ${azeretMono.variable} ${GeistSans.variable} ${clashDisplay.variable} ${adcure.variable} ${goodly.variable} notranslate font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
