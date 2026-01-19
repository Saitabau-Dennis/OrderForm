"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail, sendVerificationCode } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { OTPInput } from "@/components/ui/otp-input";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is missing");
      return;
    }
    setLoading(true);

    try {
      const res = await verifyEmail(email, code);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Email verified successfully");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is missing");
      return;
    }
    setResending(true);
    try {
      const res = await sendVerificationCode(email);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Verification code sent");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground mb-4">Email not found. Please register again.</p>
        <Link href="/register">
          <Button>Go to Registration</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-muted-foreground mt-2">
          We sent a code to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>



      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <OTPInput
            value={code}
            onChange={setCode}
            length={6}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading || code.length < 6}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Verify Email
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-primary hover:underline font-medium disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
}
