import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Theme tokens are sourced from runtime CSS variables.
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        "brand-pine": "#00311F",
      },
      fontFamily: {
        "instrument-serif": ["var(--font-instrument-serif)"],
        "instrument-sans": ["var(--font-instrument-sans)"],
        "signika": ["var(--font-signika)"],
        "dm-sans": ["var(--font-dm-sans)"],
        "poppins": ["var(--font-poppins)"],
        "jakarta": ["var(--font-jakarta)"],
        "clash-display": ["var(--font-clash-display)"],
      },
    },
  },
  plugins: [],
};
export default config;
