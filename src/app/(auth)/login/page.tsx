"use client"

import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { ButtonLoader } from "@/components/ui/button-loader"
import { toast } from "sonner"
import { sendVerificationCode } from "@/lib/actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (res?.error) {
        if (res.code === "unverified_email") {
          // Auto-send a fresh verification code and redirect to the verify page.
          const verificationResult = await sendVerificationCode(formData.email)
          if (verificationResult.error) {
            toast.error(verificationResult.error)
          } else {
            toast.warning("Please verify your email address — we've sent a verification code to your inbox.")
            router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
          }
        } else {
          toast.error("Invalid email or password")
        }
      } else {
        const callbackUrl = searchParams.get("callbackUrl")
        const safeRedirect =
          callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
            ? callbackUrl
            : "/dashboard"

        const redirectUrl = safeRedirect + (safeRedirect.includes("?") ? "&" : "?") + "loggedIn=true"

        router.push(redirectUrl)
        router.refresh()
      }
    } catch {
      toast.error("Something went wrong!!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl bg-background rounded-none md:rounded-[2.5rem] shadow-none md:shadow-2xl ring-0 md:ring-[12px] ring-primary/20 border-x-0 border-y-0 md:border border-black/5 overflow-hidden flex flex-col md:flex-row min-h-screen md:min-h-[480px]">
      {/* Left Side - Text */}
      <div className="w-full hidden md:flex md:w-1/2 bg-primary p-10 flex-col justify-between text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="[font-family:var(--font-adcure)] text-3xl font-semibold tracking-tight mb-12 block mt-1">
            Orderform
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-normal tracking-tight leading-tight mb-6">
            Welcome back to your store.
          </h1>
          <p className="font-sans text-primary-foreground/75 text-base md:text-lg leading-relaxed">
            Manage your products, orders, and customers all in one place.
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
      <div className="w-full md:w-1/2 px-5 pb-8 pt-7 sm:px-6 md:p-10 flex flex-col justify-center bg-background">
        <div className="max-w-sm mx-auto w-full">
          <div className="md:hidden mb-6 rounded-2xl border border-primary/30 bg-primary p-4 text-center shadow-lg">
            <Link href="/" className="[font-family:var(--font-adcure)] text-3xl font-semibold tracking-tight text-primary-foreground mt-1">
              Orderform
            </Link>
            <p className="mt-2 text-xs text-primary-foreground/75">Log in to manage your store on the go.</p>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-normal tracking-tight text-foreground mb-2">Log in</h2>
          <p className="font-sans text-sm sm:text-base text-muted-foreground mb-7 sm:mb-8">
            Enter your details to access your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors pr-10"
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
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <ButtonLoader />
                  Signing in...
                </span>
              ) : (
                "Log in"
              )}
            </Button>
          </form>

          <div className="mt-7 sm:mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-foreground hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
