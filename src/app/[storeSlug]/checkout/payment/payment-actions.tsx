"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { storefrontPath } from "@/lib/storefront-path"
import {
  abandonMockPayment,
  completeMockPayment,
  startMockPayment,
} from "@/lib/actions/mock-payments"
import { useStore } from "../../components/store-provider"

type PaymentActionsProps = {
  storeSlug: string
  orderId?: string | null
  method: "mpesa" | "card"
}

export function PaymentActions({ storeSlug, orderId, method }: PaymentActionsProps) {
  const router = useRouter()
  const { clearCart } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAwaitingCallback, setIsAwaitingCallback] = useState(false)
  const pendingTimerRef = useRef<number | null>(null)
  const shouldMarkAbandonedRef = useRef(false)

  useEffect(() => {
    return () => {
      if (pendingTimerRef.current !== null) {
        window.clearTimeout(pendingTimerRef.current)
      }
      if (shouldMarkAbandonedRef.current && orderId) {
        void abandonMockPayment({
          orderId,
          storeSlug,
          reason: "customer_left_payment_page",
        })
      }
    }
  }, [orderId, storeSlug])

  const finalizeOrderCompletion = () => {
    shouldMarkAbandonedRef.current = false
    setIsAwaitingCallback(false)
    clearCart()
    localStorage.removeItem(`orderform_checkout_draft:${storeSlug}`)
    toast.success("Payment confirmed. Your order is complete.")
    router.push(storefrontPath(storeSlug))
  }

  const handlePayClick = async () => {
    if (!orderId) {
      toast.error("Missing order reference. Please return to checkout.")
      return
    }

    setIsSubmitting(true)
    const started = await startMockPayment({ orderId, storeSlug, method })
    setIsSubmitting(false)

    if (!started.success) {
      toast.error(started.error || "Could not start payment.")
      return
    }

    if (started.state === "already_paid") {
      finalizeOrderCompletion()
      return
    }

    shouldMarkAbandonedRef.current = true

    if (method === "mpesa") {
      toast.message("M-PESA prompt sent. Waiting for payment confirmation...")
    } else {
      toast.message("Opening secure card checkout...")
    }

    setIsAwaitingCallback(true)
    pendingTimerRef.current = window.setTimeout(async () => {
      pendingTimerRef.current = null
      const completed = await completeMockPayment({ orderId, storeSlug, method })
      if (!completed.success) {
        setIsAwaitingCallback(false)
        toast.error(completed.error || "Payment confirmation failed.")
        return
      }
      finalizeOrderCompletion()
    }, method === "mpesa" ? 6000 : 3000)
  }

  if (method === "mpesa") {
    return (
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handlePayClick}
          disabled={isSubmitting || isAwaitingCallback || !orderId}
          className="inline-flex h-10 min-w-[86px] items-center justify-center border border-[#1A1A1A] bg-[#1A1A1A] px-4 text-base font-semibold text-white transition hover:opacity-90"
        >
          {isAwaitingCallback ? "Waiting..." : "Pay"}
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handlePayClick}
        disabled={isSubmitting || isAwaitingCallback || !orderId}
        className="inline-flex h-10 min-w-[194px] items-center justify-center border border-[#1A1A1A] bg-[#1A1A1A] px-5 text-base font-semibold text-white transition hover:opacity-90"
      >
        {isAwaitingCallback ? "Processing..." : "Proceed to Card Checkout"}
      </button>
    </div>
  )
}
