"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, LockKeyhole, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "@/lib/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OTPInput } from "@/components/ui/otp-input";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing");
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
    } catch (error) {
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
        <h2 className="font-instrument-serif text-2xl font-bold mb-2">Invalid Request</h2>
        <p className="font-instrument-sans text-muted-foreground mb-6">
          We couldnt find your email address in the request. Please start over.
        </p>
        <Link href="/forgot-password">
          <Button variant="outline" className="rounded-xl h-12 px-8">
            Go to Forgot Password
          </Button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
          <ShieldCheck className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-instrument-serif text-2xl font-bold text-foreground mb-4">
          Password Reset!
        </h2>
        <p className="font-instrument-sans text-muted-foreground text-lg mb-8 max-w-[300px] mx-auto">
          Your account is now secure. You can log in with your new password.
        </p>
        <Link href="/login">
          <Button className="w-full h-12 text-base rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
            Back to Login <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-8">
        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 text-primary">
          <LockKeyhole className="w-6 h-6" />
        </div>
        <h2 className="font-instrument-serif text-2xl text-foreground mb-2">
          Reset Password
        </h2>
        <p className="font-instrument-sans text-muted-foreground">
          Enter the code sent to <span className="font-medium text-foreground">{email}</span> and your new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <OTPInput value={code} onChange={setCode} length={6} />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative group">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative group">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
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
        </div>

        <Button
          type="submit"
          disabled={loading || code.length < 6 || !password}
          className="w-full h-12 text-base rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-4xl bg-background rounded-[2.5rem] shadow-2xl ring-[12px] ring-primary/20 border border-black/5 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      {/* Left Side - Text */}
      <div className="w-full hidden md:flex md:w-1/2 bg-primary p-12 flex-col justify-between text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link
            href="/"
            className="font-instrument-serif text-2xl font-bold mb-12 block"
          >
            Orderform
          </Link>
          <h1 className="font-instrument-serif text-3xl md:text-4xl leading-tight mb-6">
            Secure your account.
          </h1>
          <p className="font-instrument-sans text-primary-foreground/70 text-lg">
            Create a strong password to keep your store safe.
          </p>
        </div>

        <div className="relative z-10">
          <p className="font-instrument-sans text-primary-foreground/50 text-sm">
            © 2026 Orderform. All rights reserved.
          </p>
        </div>

        {/* Abstract shapes/decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-background">
         <div className="md:hidden mb-8 text-center max-w-sm mx-auto w-full">
             <Link href="/" className="font-instrument-serif text-2xl font-bold text-primary">
              Orderform
            </Link>
          </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
