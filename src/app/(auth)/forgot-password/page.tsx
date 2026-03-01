"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { sendPasswordResetCode } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { ButtonLoader } from "@/components/ui/button-loader";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await sendPasswordResetCode(email);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Reset code sent to your email");
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-background rounded-none md:rounded-[2.5rem] shadow-none md:shadow-2xl ring-0 md:ring-[12px] ring-primary/20 border-x-0 border-y-0 md:border border-black/5 overflow-hidden flex flex-col md:flex-row min-h-screen md:min-h-[480px]">
      {/* Left Side - Text */}
      <div className="w-full hidden md:flex md:w-1/2 bg-primary p-10 flex-col justify-between text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="[font-family:var(--font-instrument-serif)] text-3xl font-normal tracking-tight mb-12 block mt-1">
            Orderform
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
            Reset your password.
          </h1>
          <p className="font-sans text-primary-foreground/75 text-base md:text-lg leading-relaxed">
            Don&apos;t worry, we&apos;ll help you get back to managing your store in no time.
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
      <div className="w-full md:w-1/2 px-5 pb-8 pt-7 sm:px-6 md:p-10 flex flex-col justify-center bg-background">
        <div className="max-w-sm mx-auto w-full">
          <div className="md:hidden mb-6 rounded-2xl border border-primary/30 bg-primary p-4 text-center shadow-lg">
             <Link href="/" className="[font-family:var(--font-instrument-serif)] text-3xl font-normal tracking-tight text-primary-foreground mt-1">
              Orderform
            </Link>
            <p className="mt-2 text-xs text-primary-foreground/75">Request a code and reset your password quickly.</p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>

          <h2 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-2">Forgot password?</h2>
          <p className="font-sans text-sm sm:text-base text-muted-foreground mb-7 sm:mb-8">
            Enter your email address and we&apos;ll send you a code to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <ButtonLoader />
                  Sending code...
                </span>
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
