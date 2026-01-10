import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)", // Powered by CSS variable
        "primary-foreground": "var(--primary-foreground)",
        cream: "#FFFBDF", // Cream
        "brand-pine": "#00311F",
      },
      fontFamily: {
        "instrument-serif": ["var(--font-instrument-serif)"],
        "instrument-sans": ["var(--font-instrument-sans)"],
        "signika": ["var(--font-signika)"],
        "dm-sans": ["var(--font-dm-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;
