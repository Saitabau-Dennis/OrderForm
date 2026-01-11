"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { sendPasswordResetCode } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

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
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-background rounded-3xl md:rounded-[2.5rem] shadow-2xl ring-4 md:ring-[12px] ring-primary/20 border border-black/5 overflow-hidden flex flex-col md:flex-row min-h-[400px] md:min-h-[600px]">
      {/* Left Side - Text */}
      <div className="w-full hidden md:flex md:w-1/2 bg-primary p-12 flex-col justify-between text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="font-instrument-serif text-2xl font-bold mb-12 block">
            Orderform
          </Link>
                    <h1 className="font-instrument-serif text-3xl md:text-4xl leading-tight mb-6">
            Reset your password.
          </h1>
          <p className="font-instrument-sans text-primary-foreground/70 text-lg">
            Don't worry, we'll help you get back to managing your store in no time.
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
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-background">
        <div className="max-w-sm mx-auto w-full">
          <div className="md:hidden mb-6 text-center">
             <Link href="/" className="font-instrument-serif text-2xl font-bold text-primary">
              Orderform
            </Link>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>

          <h2 className="font-instrument-serif text-2xl text-foreground mb-2">Forgot password?</h2>
          <p className="font-instrument-sans text-muted-foreground mb-8">
            Enter your email address and we'll send you a code to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Loader2 className="w-4 h-4 animate-spin" />
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
