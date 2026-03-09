"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useStore } from "../../components/store-provider"

type PaymentActionsProps = {
  storeSlug: string
  method: "mpesa" | "card"
}

export function PaymentActions({ storeSlug, method }: PaymentActionsProps) {
  const router = useRouter()
  const { clearCart } = useStore()

  const handlePayClick = () => {
    if (method === "mpesa") {
      toast.message("M-PESA prompt sent. Complete the payment on your phone.")
      return
    }
    toast.message("Redirecting to secure card checkout...")
  }

  const handleCompleteOrder = () => {
    // Checkout draft/cart are client-side; clear both on explicit completion.
    clearCart()
    localStorage.removeItem(`orderform_checkout_draft:${storeSlug}`)
    toast.success("Payment confirmed. Your order is complete.")
    router.push(`/${storeSlug}`)
  }

  if (method === "mpesa") {
    return (
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handlePayClick}
          className="inline-flex h-10 min-w-[86px] items-center justify-center border border-[#1A1A1A] bg-[#1A1A1A] px-4 text-base font-semibold text-white transition hover:opacity-90"
        >
          Pay
        </button>
        <button
          type="button"
          onClick={handleCompleteOrder}
          className="inline-flex h-10 min-w-[172px] items-center justify-center border border-[#CFCFC9] bg-transparent px-5 text-base font-semibold text-[#1A1A1A] transition hover:bg-[#F2F2EF]"
        >
          Complete Order
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handlePayClick}
        className="inline-flex h-10 min-w-[194px] items-center justify-center border border-[#1A1A1A] bg-[#1A1A1A] px-5 text-base font-semibold text-white transition hover:opacity-90"
      >
        Proceed to Card Checkout
      </button>
      <button
        type="button"
        onClick={handleCompleteOrder}
        className="inline-flex h-10 min-w-[172px] items-center justify-center border border-[#CFCFC9] bg-transparent px-5 text-base font-semibold text-[#1A1A1A] transition hover:bg-[#F2F2EF]"
      >
        Complete Order
      </button>
    </div>
  )
}
