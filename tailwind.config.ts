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
        primary: "#30382F", // Hunter Green
        cream: "#FFFBDF", // Cream
        "brand-beige": "#FFF7E6",
        "brand-pine": "#00311F",
      },
      fontFamily: {
        "instrument-serif": ["var(--font-instrument-serif)"],
        "instrument-sans": ["var(--font-instrument-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;
