import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import Link from "next/link";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      {/* Left Side - Text */}
      <div className="w-full md:w-1/2 bg-primary p-12 flex flex-col justify-between text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="font-instrument-serif text-2xl font-bold mb-12 block">
            Orderform
          </Link>
          <h1 className="font-instrument-serif text-4xl md:text-5xl leading-tight mb-6">
            Almost there.
          </h1>
          <p className="font-instrument-sans text-primary-foreground/70 text-lg">
            Verify your email to secure your account and start managing your store.
          </p>
        </div>

        <div className="relative z-10">
          <p className="font-instrument-sans text-primary-foreground/50 text-sm">
            © 2024 Orderform. All rights reserved.
          </p>
        </div>

        {/* Abstract shapes/decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
