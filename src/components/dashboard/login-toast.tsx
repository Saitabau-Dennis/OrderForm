"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function LoginToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const toastShown = useRef(false);

  useEffect(() => {
    if (searchParams.get("loggedIn") === "true" && !toastShown.current) {
      toastShown.current = true;
      toast.custom((id) => (
        <div className="relative flex w-full max-w-[356px] items-center gap-3 overflow-hidden rounded-lg border border-green-600 bg-green-600 p-4 text-white shadow-lg pointer-events-auto">
          {/* Checkmark icon */}
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white">
            <svg
              className="h-3.5 w-3.5 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="flex flex-col">
            <p className="text-[14px] font-medium leading-none">Logged in successfully</p>
          </div>

          <button
            onClick={() => toast.dismiss(id)}
            className="absolute right-3 top-4 shrink-0 rounded-md text-white/80 transition-colors hover:text-white focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-black/10">
            <div
              className="h-full bg-white rounded-r-full"
              style={{
                animation: "toast-progress 4000ms linear forwards",
              }}
            />
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes toast-progress {
              from { width: 100%; }
              to { width: 0%; }
            }
          ` }} />
        </div>
      ), {
        duration: 4000,
        position: "top-right",
      });

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("loggedIn");
      const paramString = newSearchParams.toString();
      router.replace(`${pathname}${paramString ? `?${paramString}` : ""}`);
    }
  }, [searchParams, router, pathname]);

  return null;
}
