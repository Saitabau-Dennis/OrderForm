"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { ButtonLoader } from "@/components/ui/button-loader"
import { WaveLoader } from "@/components/ui/wave-loader"
import { toast } from "sonner"


export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    storeName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1 && formData.storeName) {
      setStep(2)
    } else if (step === 2 && formData.email) {
      setStep(3)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const passwordRequirements = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "One number", test: (p: string) => /[0-9]/.test(p) },
    { label: "One special character (!@#$%^&*)", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ]

  const isPasswordStrong = passwordRequirements.every(req => req.test(formData.password))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPasswordStrong) {
      toast.error("Please meet all password requirements")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: formData.storeName,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      toast.success("Registration successful! Please verify your email.")
      setLoading(false)
      setRedirecting(true)

      // Small delay before redirect for better UX
      setTimeout(() => {
        window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`
      }, 1500)
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Store Details"
      case 2: return "Contact Info"
      case 3: return "Security"
      default: return ""
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 1: return "First, let's name your store."
      case 2: return "How can we reach you?"
      case 3: return "Secure your account."
      default: return ""
    }
  }

  // Show redirecting loader after successful registration
  if (redirecting) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 gap-6">
        <div className="h-12 flex items-center justify-center">
          <WaveLoader />
        </div>
        <div className="text-center space-y-2">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">Account Created!</h2>
          <p className="font-sans text-muted-foreground text-sm">
            Redirecting you to verify your email...
          </p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center  p-4">
        <div className="bg-background p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 border border-border">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Registration Successful!</h2>
            <p className="font-sans text-muted-foreground text-lg leading-relaxed">
              We've sent a verification link to <strong className="text-foreground">{formData.email}</strong>.
              Please check your inbox to activate your account.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full py-4 px-6 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              Go to Login
            </Link>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl bg-background rounded-3xl md:rounded-[2.5rem] shadow-2xl ring-4 md:ring-[12px] ring-primary/20 border border-black/5 overflow-hidden flex flex-col md:flex-row min-h-[360px] md:min-h-[480px]">
      {/* Left Side - Text */}
      <div className="w-full hidden md:flex md:w-1/2 bg-primary p-10 flex-col justify-between text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="font-logo text-2xl font-semibold tracking-tight mb-12 block">
            Orderform
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
            Start your journey with us.
          </h1>
          <p className="font-sans text-primary-foreground/75 text-base md:text-lg leading-relaxed">
            Create your store in minutes and start selling to your customers on WhatsApp.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex gap-2 mb-4" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} aria-label={`Step ${step} of 3`}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 w-12 rounded-full transition-colors ${step >= i ? "bg-primary-foreground" : "bg-primary-foreground/20"}`}
              />
            ))}
          </div>
          <p className="font-sans text-primary-foreground/50 text-sm">
            Step {step} of 3: {getStepTitle()}
          </p>
        </div>

        {/* Abstract shapes/decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-background">
        <div className="max-w-sm mx-auto w-full">
          <div className="md:hidden mb-6 text-center">
             <Link href="/" className="font-logo text-2xl font-semibold tracking-tight text-primary">
              Orderform
            </Link>
            <div className="flex gap-2 justify-center mt-4 mb-2" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} aria-label={`Step ${step} of 3`}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 w-8 rounded-full transition-colors ${step >= i ? "bg-primary" : "bg-primary/20"}`}
              />
            ))}
            </div>
            <p className="font-sans text-muted-foreground text-xs">
              Step {step} of 3
            </p>
          </div>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground mb-2">Create account</h2>
          <p className="font-sans text-muted-foreground mb-8">
            {getStepDescription()}
          </p>

          <form className="space-y-6" onSubmit={step < 3 ? handleNext : handleSubmit}>
            {step === 1 && (
              <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  placeholder="My Awesome Store"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                  autoFocus
                  required
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                  autoFocus
                  required
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors pr-10"
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Password hint - simple message */}
                  {formData.password && !isPasswordStrong && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Use 8+ characters with uppercase, lowercase, number & special character
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                  className="h-12 px-6 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 text-base rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <ButtonLoader />
                  </span>
                ) : step < 3 ? (
                  <span className="flex items-center gap-2">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-foreground hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
