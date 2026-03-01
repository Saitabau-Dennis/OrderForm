"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail, sendVerificationCode } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { OTPInput } from "@/components/ui/otp-input";
import { ButtonLoader } from "@/components/ui/button-loader";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = useCallback(async (verificationCode: string) => {
    if (!email) {
      toast.error("Email is missing");
      return;
    }
    setLoading(true);

    try {
      const res = await verifyEmail(email, verificationCode);
      if (res.error) {
        toast.error(res.error);
        setLoading(false); // Stop loading on error so they can try again
        setCode(""); // Optionally clear code on error
      } else {
        toast.success("Email verified successfully");
        router.push("/login");
      }
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  }, [email, router]);

  // Auto-submit when code is complete
  useEffect(() => {
    if (code.length === 6) {
      handleVerify(code);
    }
  }, [code, handleVerify]);

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
    } catch {
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
    <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Check your email</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          We sent a verification code to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div className="w-full overflow-x-auto pb-1">
          <OTPInput
            value={code}
            onChange={setCode}
            length={6}
            disabled={loading}
            className="min-w-max mx-auto"
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying...</span>
          </div>
        )}
      </div>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resending || loading}
            className="text-primary hover:underline font-medium disabled:opacity-50 transition-colors"
          >
            {resending ? (
              <span className="inline-flex items-center gap-2">
                <ButtonLoader className="gap-0.5" dotClassName="h-1 w-1" />
                Resending...
              </span>
            ) : (
              "Click to resend"
            )}
          </button>
        </p>
      </div>
    </div>
  );
}
