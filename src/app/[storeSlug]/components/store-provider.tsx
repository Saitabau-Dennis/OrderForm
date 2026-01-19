"use client";

import { useEffect } from "react";

interface StoreThemeProviderProps {
  brandColor: string;
  children: React.ReactNode;
}

export function StoreThemeProvider({ brandColor, children }: StoreThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    // Set the brand color variable
    root.style.setProperty("--store-brand", brandColor);

    // Calculate a foreground color (white or black) based on contrast could be done here
    // For now, we'll assume white text on brand color is the default desire,
    // but we can add logic if needed.
    // We can also generate lighter/darker shades if we want.

  }, [brandColor]);

  return (
    <div
      className="min-h-screen bg-gray-50 font-sans"
      style={{
        // We can also set it directly on the wrapper if we want isolation
        // @ts-ignore
        "--store-brand": brandColor,
      }}
    >
      {children}
    </div>
  );
}
