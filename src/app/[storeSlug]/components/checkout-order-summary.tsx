import Image from "next/image"
import { Loader2 } from "lucide-react"
import type { CheckoutLineItem, PaymentMethod } from "./checkout-form-types"

type CheckoutOrderSummaryProps = {
  checkoutItems: CheckoutLineItem[]
  checkoutSubtotal: number
  shippingMethodLabel: string
  grandTotal: number
  brandColor: string
  paymentMethod: PaymentMethod
  isLoading: boolean
  formatPrice: (price: number) => string
  onPaymentMethodChange: (method: PaymentMethod) => void
  onSubmit: () => void
}

const PAYMENT_OPTIONS: Array<{
  id: PaymentMethod
  label: string
  imageSrc: string
  imageAlt: string
}> = [
  {
    id: "mpesa",
    label: "M-PESA",
    imageSrc: "/images/mpesa.jpg",
    imageAlt: "M-PESA",
  },
  {
    id: "card",
    label: "Debit/Credit Cards",
    imageSrc: "/images/paystack-ke.png",
    imageAlt: "Card payment options",
  },
]

export function CheckoutOrderSummary({
  checkoutItems,
  checkoutSubtotal,
  shippingMethodLabel,
  grandTotal,
  brandColor,
  paymentMethod,
  isLoading,
  formatPrice,
  onPaymentMethodChange,
  onSubmit,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="xl:col-span-5 xl:sticky xl:top-10">
      <div className="border border-[#DADAD5]">
        <div className="border-b border-[#DADAD5] px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="text-[28px] font-semibold tracking-tight text-[#1A1A1A] sm:text-[32px] lg:text-[36px]">Your Order</h2>
        </div>

        <div className="px-4 py-4 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] border-b border-[#E2E2DD] pb-3 text-[13px] font-semibold text-[#4E4E49]">
            <span>Product</span>
            <span>Subtotal</span>
          </div>

          <div className="divide-y divide-[#E8E8E5]">
            {checkoutItems.map((item) => (
              <div key={`checkout-item-${item.productId}-${item.variant || "default"}`} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-4 text-sm">
                <p className="min-w-0 text-[#4A4A45]">
                  <span className="line-clamp-1">{item.name}</span>
                  <span className="text-xs text-[#70706A]"> × {item.quantity}</span>
                </p>
                <span className="font-semibold text-[#1A1A1A]">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-0 border-t border-[#DADAD5]">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] py-4 text-[29px] font-semibold text-[#1A1A1A]">
              <span className="text-[17px]">Subtotal</span>
              <span className="text-[17px]">{formatPrice(checkoutSubtotal)}</span>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] border-t border-[#E8E8E5] py-4 text-[15px] text-[#4E4E49]">
              <span className="font-semibold">Shipment</span>
              <span className="font-semibold">{shippingMethodLabel}</span>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] border-t border-[#DADAD5] py-4">
              <span className="text-xl font-semibold text-[#1A1A1A]">Total</span>
              <span className="text-xl font-semibold text-[#1A1A1A]" style={{ color: brandColor || "#1A1A1A" }}>
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#DADAD5] px-4 py-5 sm:px-6">
          <div className="space-y-5">
            {PAYMENT_OPTIONS.map((option) => {
              const isActive = paymentMethod === option.id
              return (
                <label
                  key={option.id}
                  className={`block cursor-pointer border px-3 py-3 transition-colors ${
                    isActive ? "border-[#1A1A1A] bg-[#F7F6F2]" : "border-[#DFDFD9] bg-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment-method"
                      value={option.id}
                      checked={isActive}
                      onChange={() => onPaymentMethodChange(option.id)}
                      className="h-4 w-4 accent-[#1A1A1A]"
                    />
                    <p className="text-base leading-none font-medium text-[#1A1A1A]">{option.label}</p>
                    {option.id === "mpesa" ? (
                      <Image
                        src={option.imageSrc}
                        alt={option.imageAlt}
                        width={64}
                        height={24}
                        style={{ width: "auto" }}
                        className="h-6 w-auto object-contain"
                      />
                    ) : null}
                  </div>

                  {isActive ? (
                    <div className="ml-7 mt-2 bg-[#F2F1ED] px-3 py-2 text-sm text-[#4B4B46]">
                      {option.id === "mpesa"
                        ? "Place order and pay using M-PESA."
                        : "Proceed to secure card checkout after placing order."}
                    </div>
                  ) : null}

                  {option.id === "card" ? (
                    <div className="ml-7 mt-2 rounded border border-[#DDDDD8] bg-card px-3 py-3">
                      <div className="flex items-center justify-center">
                        <Image
                          src="/images/paystack-ke.png"
                          alt="Visa, Mastercard, Amex, M-PESA and Apple Pay"
                          width={520}
                          height={92}
                          className="h-auto w-full max-w-[520px] object-contain"
                        />
                      </div>
                    </div>
                  ) : null}
                </label>
              )
            })}
          </div>
        </div>

        <div className="border-t border-[#DADAD5] px-4 py-5 sm:px-6 sm:py-6">
          <p className="max-w-[520px] text-sm leading-relaxed text-[#666661] sm:text-[16px]">
            Your personal data will be used to process your order, support your experience and for other purposes described in our privacy policy.
          </p>
          <div className="mt-5 flex justify-start sm:justify-end">
            <button
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
              className="inline-flex h-12 min-w-[170px] items-center justify-center border border-[#1A1A1A] bg-transparent px-6 text-lg font-medium text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 sm:text-xl"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
