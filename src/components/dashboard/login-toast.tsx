"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/dashboard/dashboard-button";

const TOAST_DURATION_MS = 9000;

export function LoginToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const toastShown = useRef(false);

  useEffect(() => {
    if (searchParams.get("loggedIn") === "true" && !toastShown.current) {
      toastShown.current = true;
      toast.custom((id) => (
        <div className="pointer-events-auto relative flex w-full items-center gap-2 overflow-hidden rounded-md border border-green-600 bg-green-600 px-4 py-3 pr-10 text-white shadow-lg">
          {/* Checkmark icon */}
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>

          <p className="text-xs font-normal">Logged in successfully</p>

          <Button
            onClick={() => toast.dismiss(id)}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/20 hover:text-white focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-black/20">
            <div
              className="h-full bg-white/70"
              style={{
                animation: `login-toast-progress ${TOAST_DURATION_MS}ms linear forwards`,
              }}
            />
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes login-toast-progress {
              from { width: 100%; }
              to { width: 0%; }
            }
          ` }} />
        </div>
      ), {
        duration: TOAST_DURATION_MS,
        position: "bottom-right",
      });

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("loggedIn");
      const paramString = newSearchParams.toString();
      router.replace(`${pathname}${paramString ? `?${paramString}` : ""}`);
    }
  }, [searchParams, router, pathname]);

  return null;
}
