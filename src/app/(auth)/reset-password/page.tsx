"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, LockKeyhole, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { resetPassword, verifyResetCode } from "@/lib/actions/auth";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { OTPInput } from "@/components/ui/otp-input";
import { WaveLoader } from "@/components/ui/wave-loader";
import { ButtonLoader } from "@/components/ui/button-loader";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordRequirements = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "One number", test: (p: string) => /[0-9]/.test(p) },
    { label: "One special character (!@#$%^&*)", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  const isPasswordStrong = passwordRequirements.every((req) => req.test(password));

  const handleVerifyCode = useCallback(async (verificationCode: string) => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await verifyResetCode(email, verificationCode);
      if (res.error) {
        toast.error(res.error);
        setLoading(false);
        setCode(""); // Clear invalid code
      } else {
        toast.success("Code verified");
        setStep(2);
        setLoading(false);
      }
    } catch {
      toast.error("Failed to verify code");
      setLoading(false);
    }
  }, [email]);

  // Auto-verify code when it reaches length 6
  useEffect(() => {
    if (code.length === 6 && step === 1) {
      handleVerifyCode(code);
    }
  }, [code, step, handleVerifyCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing");
      return;
    }

    if (!isPasswordStrong) {
      toast.error("Please meet all password requirements");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword(email, code, password);
      if (res.error) {
        toast.error(res.error);
      } else {
        setSuccess(true);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="font-heading text-2xl font-normal tracking-tight mb-2">Invalid Request</h2>
        <p className="font-sans text-muted-foreground mb-6">
          We couldnt find your email address in the request. Please start over.
        </p>
        <Link href="/forgot-password">
          <Button variant="outline" size="lg" className="px-8">
            Go to Forgot Password
          </Button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center animate-in fade-in zoom-in-95 duration-500 max-w-sm mx-auto">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_0_8px_rgba(34,197,94,0.1)] border-4 border-white">
          <div className="w-full h-full rounded-full flex items-center justify-center animate-in zoom-in duration-300 delay-150">
             <ShieldCheck className="w-12 h-12 text-green-600 stroke-[2.5]" />
          </div>
        </div>

        <h2 className="font-heading text-3xl font-normal text-foreground mb-4 tracking-tight">
          All Secure!
        </h2>

        <div className="space-y-2 mb-10">
            <p className="font-sans text-muted-foreground text-lg">
            Your password has been successfully reset.
            </p>
            <p className="text-sm text-muted-foreground/80">
                You can now log in with your new credentials.
            </p>
        </div>

        <Link href="/login">
          <Button size="lg" className="w-full h-14 text-base font-semibold group">
            Back to Login <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-7 sm:mb-8">
        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 text-primary">
          <LockKeyhole className="w-6 h-6" />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-normal tracking-tight text-foreground mb-2">
          {step === 1 ? "Enter Code" : "Reset Password"}
        </h2>
        <p className="font-sans text-sm sm:text-base text-muted-foreground">
          {step === 1
            ? <span>Enter the verification code sent to <span className="font-medium text-foreground">{email}</span></span>
            : "Create a new strong password for your account."
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {step === 1 && (
          <div className="space-y-3">
            <OTPInput
              value={code}
              onChange={setCode}
              length={6}
              disabled={loading}
            />

            {/* Status row */}
            <div className="h-5 flex items-center justify-center">
              {loading ? (
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                  "bg-primary/10 text-primary border border-primary/20 animate-pulse"
                )}>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Verifying…
                </span>
              ) : code.length > 0 && code.length < 6 ? (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {6 - code.length} digit{6 - code.length !== 1 ? "s" : ""} remaining
                </span>
              ) : null}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-all pr-10 group-hover:bg-muted/80"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {password && !isPasswordStrong && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Use 8+ characters with uppercase, lowercase, number & special character
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative group">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-all pr-10 group-hover:bg-muted/80"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !password || !isPasswordStrong}
              size="lg"
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <ButtonLoader />
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-3xl bg-background rounded-none md:rounded-[2.5rem] shadow-none md:shadow-2xl ring-0 md:ring-[12px] ring-primary/20 border-x-0 border-y-0 md:border border-black/5 overflow-hidden flex flex-col md:flex-row min-h-screen md:min-h-[480px]">
      {/* Left Side - Text */}
      <div className="w-full hidden md:flex md:w-1/2 bg-primary p-10 flex-col justify-between text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link
            href="/"
            className="[font-family:var(--font-adcure)] text-3xl font-semibold tracking-tight mb-12 block mt-1"
          >
            Orderform
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-normal tracking-tight leading-tight mb-6">
            Secure your account.
          </h1>
          <p className="font-sans text-primary-foreground/75 text-base md:text-lg leading-relaxed">
            Create a strong password to keep your store safe.
          </p>
        </div>

        <div className="relative z-10">
          <p className="font-sans text-primary-foreground/50 text-sm">
            &copy; 2026 Orderform. All rights reserved.
          </p>
        </div>

        {/* Abstract shapes/decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 px-5 pb-8 pt-7 sm:px-6 md:p-10 flex flex-col justify-center bg-background">
         <div className="md:hidden mb-6 rounded-2xl border border-primary/30 bg-primary p-4 text-center shadow-lg max-w-sm mx-auto w-full">
             <Link href="/" className="[font-family:var(--font-adcure)] text-3xl font-semibold tracking-tight text-primary-foreground mt-1">
              Orderform
            </Link>
            <p className="mt-2 text-xs text-primary-foreground/75">Use your verification code to secure your account again.</p>
          </div>
        <Suspense
          fallback={
            <div className="flex min-h-[220px] items-center justify-center">
              <WaveLoader className="h-10" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
