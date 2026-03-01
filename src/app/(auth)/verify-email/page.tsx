import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import Link from "next/link";
import { Suspense } from "react";
import { WaveLoader } from "@/components/ui/wave-loader";

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-3xl bg-background rounded-3xl md:rounded-[2.5rem] shadow-2xl ring-4 md:ring-[12px] ring-primary/20 border border-black/5 overflow-hidden flex flex-col md:flex-row min-h-[360px] md:min-h-[480px]">
      {/* Left Side - Text */}
      <div className="w-full hidden md:flex md:w-1/2 bg-primary p-10 flex-col justify-between text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="[font-family:var(--font-instrument-serif)] text-3xl font-normal tracking-tight mb-12 block mt-1">
            Orderform
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
            Almost there.
          </h1>
          <p className="font-sans text-primary-foreground/75 text-base md:text-lg leading-relaxed">
            Verify your email to secure your account and start managing your store.
          </p>
        </div>

        <div className="relative z-10">
          <p className="font-sans text-primary-foreground/50 text-sm">
            &copy; 2024 Orderform. All rights reserved.
          </p>
        </div>

        {/* Abstract shapes/decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-background">
         <div className="md:hidden mb-6 text-center max-w-sm mx-auto w-full">
             <Link href="/" className="[font-family:var(--font-instrument-serif)] text-3xl font-normal tracking-tight text-primary mt-1">
              Orderform
            </Link>
          </div>
        <Suspense
          fallback={
            <div className="flex min-h-[220px] items-center justify-center">
              <WaveLoader className="h-10" />
            </div>
          }
        >
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
