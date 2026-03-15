import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import Link from "next/link";
import { Suspense } from "react";
import { WaveLoader } from "@/components/ui/wave-loader";

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-2xl bg-background rounded-none md:rounded-[2rem] shadow-none md:shadow-2xl ring-0 md:ring-[10px] ring-primary/20 border-x-0 border-y-0 md:border border-black/5 overflow-hidden flex flex-col md:flex-row min-h-screen md:min-h-[420px]">
      {/* Left Side - Text */}
      <div className="w-full hidden md:flex md:w-1/2 bg-primary p-8 flex-col justify-between text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="[font-family:var(--font-goodly)] text-[2.15rem] font-semibold tracking-tight mb-12 block mt-1">
            Orderform
          </Link>
          <h1 className="font-heading text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6">
            Almost there.
          </h1>
          <p className="font-sans text-primary-foreground/75 text-sm md:text-base leading-relaxed">
            Verify your email to secure your account and start managing your store.
          </p>
        </div>

        <div className="relative z-10">
          <p className="font-sans text-primary-foreground/50 text-sm">
            &copy; {new Date().getFullYear()} Orderform. All rights reserved.
          </p>
        </div>

        {/* Abstract shapes/decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 px-5 pb-7 pt-6 sm:px-6 md:p-8 flex flex-col justify-center bg-background">
         <div className="md:hidden mb-6 rounded-2xl border border-primary/30 bg-primary p-4 text-center shadow-lg max-w-xs mx-auto w-full">
             <Link href="/" className="[font-family:var(--font-goodly)] text-[2.15rem] font-semibold tracking-tight text-primary-foreground mt-1">
              Orderform
            </Link>
            <p className="mt-2 text-xs text-primary-foreground/75">Enter the 6-digit code to complete setup.</p>
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
