"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function ResendButton({ email: initialEmail }: { email?: string }) {
  const [email, setEmail] = useState(initialEmail || "")
  const [loading, setLoading] = useState(false)
  const [showInput, setShowInput] = useState(false)

  const handleResend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: initialEmail || email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      toast.success("Verification email sent! Please check your inbox.")
      setShowInput(false)
      if (!initialEmail) setEmail("")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (initialEmail) {
    return (
      <Button
        variant="outline"
        onClick={() => handleResend()}
        disabled={loading}
        className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </span>
        ) : (
          "Resend Verification Email"
        )}
      </Button>
    )
  }

  if (!showInput) {
    return (
      <Button
        variant="outline"
        onClick={() => setShowInput(true)}
        className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50"
      >
        Resend Verification Email
      </Button>
    )
  }

  return (
    <form onSubmit={handleResend} className="space-y-3 animate-in fade-in slide-in-from-top-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors"
        required
        autoFocus
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowInput(false)}
          className="flex-1 h-12 rounded-xl"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 h-12 bg-black text-white rounded-xl hover:bg-black/90"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Link"}
        </Button>
      </div>
    </form>
  )
}
