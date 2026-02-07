"use client"

import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
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
        toast.error("Invalid email or password")
      } else {
        toast.success("Logged in successfully")
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      toast.error("Something went wrong!!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl bg-background rounded-3xl md:rounded-[2.5rem] shadow-2xl ring-4 md:ring-[12px] ring-primary/20 border border-black/5 overflow-hidden flex flex-col md:flex-row min-h-[360px] md:min-h-[480px]">
      {/* Left Side - Text */}
      <div className="w-full hidden md:flex md:w-1/2 bg-primary p-10 flex-col justify-between text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="font-instrument-serif text-2xl font-bold mb-12 block">
            Orderform
          </Link>
          <h1 className="font-instrument-serif text-3xl md:text-4xl leading-tight mb-6">
            Welcome back to your store.
          </h1>
          <p className="font-instrument-sans text-primary-foreground/70 text-lg">
            Manage your products, orders, and customers all in one place.
          </p>
        </div>

        <div className="relative z-10">
          <p className="font-instrument-sans text-primary-foreground/50 text-sm">
            &copy; 2026 Orderform. All rights reserved.
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
            <Link href="/" className="font-instrument-serif text-2xl font-bold text-primary">
              Orderform
            </Link>
          </div>
          <h2 className="font-instrument-serif text-2xl text-foreground mb-2">Log in</h2>
          <p className="font-instrument-sans text-muted-foreground mb-8">
            Enter your details to access your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
              className="w-full h-12 text-base rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </span>
              ) : (
                "Log in"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
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
