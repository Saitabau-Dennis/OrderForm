"use client";

import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

const NextTopLoader = dynamic(() => import("nextjs-toploader"), {
  ssr: false,
});

const SonnerToaster = dynamic(
  () => import("sonner").then((mod) => mod.Toaster),
  { ssr: false },
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextTopLoader
        color="#00311F"
        showSpinner={false}
        height={4}
        shadow="0 0 10px #00311F,0 0 5px #00311F"
      />
      {children}
      <SonnerToaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            success: "!bg-green-600 !text-white !border-green-600",
            error: "!bg-red-600 !text-white !border-red-600",
          },
        }}
      />
    </SessionProvider>
  );
}
Providers.displayName = "Providers"
