"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Check, X } from "lucide-react"
import { useStore } from "./store-provider"

const ACTION_MODAL_AUTO_CLOSE_SECONDS = 8

export function StoreActionModal({ storeSlug }: { storeSlug: string }) {
  const pathname = usePathname()
  const { actionModal, hideActionModal, cartCount, wishlist } = useStore()
  const [secondsRemaining, setSecondsRemaining] = useState(ACTION_MODAL_AUTO_CLOSE_SECONDS)

  useEffect(() => {
    hideActionModal()
    // We want to close the popup on route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (!actionModal) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideActionModal()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [actionModal, hideActionModal])

  useEffect(() => {
    if (!actionModal) return

    setSecondsRemaining(ACTION_MODAL_AUTO_CLOSE_SECONDS)

    const intervalId = window.setInterval(() => {
      setSecondsRemaining((previous) => Math.max(previous - 1, 0))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [actionModal])

  useEffect(() => {
    if (!actionModal || secondsRemaining > 0) return
    hideActionModal()
  }, [actionModal, secondsRemaining, hideActionModal])

  if (!actionModal) return null

  const isCartAction = actionModal.type === "cart"
  const primaryHref = isCartAction ? `/${storeSlug}/cart` : `/${storeSlug}/wishlist`
  const primaryLabel = isCartAction
    ? `View cart (${cartCount})`
    : `View wishlist (${wishlist.length})`
  const heading = isCartAction ? "Item added to your cart" : "Item added to your wishlist"

  return (
    <div
      className="pointer-events-none fixed right-4 top-[112px] z-[100] w-[min(460px,calc(100vw-2rem))] sm:right-6 sm:top-[118px] lg:right-8 lg:top-[124px]"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={heading}
        className="pointer-events-auto w-full border border-white/20 bg-black px-8 py-7 text-white shadow-[0_14px_40px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-base tracking-wide">
            <Check className="h-4 w-4" />
            {heading}
          </p>
          <button
            type="button"
            onClick={hideActionModal}
            aria-label="Close popup"
            className="inline-flex h-8 w-8 items-center justify-center text-white/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-xs uppercase tracking-[0.12em] text-white/50">
          Auto close in {secondsRemaining}s
        </p>

        <div className="mt-8 flex items-start gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-none bg-white/10">
            {actionModal.imageUrl ? (
              <Image src={actionModal.imageUrl} alt={actionModal.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-white/5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">
              {(actionModal.category?.trim() || "Featured").slice(0, 24)}
            </p>
            <p className="mt-2 line-clamp-3 text-lg font-medium uppercase leading-snug tracking-wide sm:text-xl">
              {actionModal.name}
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-5">
          <Link
            href={primaryHref}
            onClick={hideActionModal}
            className="flex h-14 items-center justify-center rounded-none border-4 border-white text-xl font-semibold tracking-wide text-white transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {primaryLabel}
          </Link>
          <button
            type="button"
            onClick={hideActionModal}
            className="block w-full text-center text-xl tracking-wide text-white underline underline-offset-4 transition hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  )
}
