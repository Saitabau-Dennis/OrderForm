"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Check, X } from "lucide-react"
import { storefrontPath } from "@/lib/storefront-path"
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
  const primaryHref = isCartAction
    ? storefrontPath(storeSlug, "/cart")
    : storefrontPath(storeSlug, "/wishlist")
  const primaryLabel = isCartAction
    ? `View cart (${cartCount})`
    : `View wishlist (${wishlist.length})`
  const heading = isCartAction ? "Item added to your cart" : "Item added to your wishlist"

  return (
    <div
      className="pointer-events-none fixed inset-x-3 bottom-20 z-[100] sm:inset-x-auto sm:right-6 sm:top-[118px] sm:bottom-auto sm:w-[min(460px,calc(100vw-3rem))] lg:right-8 lg:top-[124px]"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={heading}
        className="pointer-events-auto w-full border border-white/20 bg-black px-3 py-3 text-white shadow-[0_14px_40px_rgba(0,0,0,0.45)] sm:px-8 sm:py-7"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-xs tracking-wide sm:text-base">
            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
        <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/50 sm:mt-2 sm:text-xs sm:tracking-[0.12em]">
          Auto close in {secondsRemaining}s
        </p>

        <div className="mt-3 flex items-start gap-3 sm:mt-8 sm:gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-none bg-white/10 sm:h-24 sm:w-24">
            {actionModal.imageUrl ? (
              <Image src={actionModal.imageUrl} alt={actionModal.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-white/5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/55 sm:text-xs sm:tracking-[0.2em]">
              {(actionModal.category?.trim() || "Featured").slice(0, 24)}
            </p>
            <p className="mt-1 line-clamp-2 text-sm font-medium uppercase leading-snug tracking-wide sm:mt-2 sm:line-clamp-3 sm:text-xl">
              {actionModal.name}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 sm:mt-10 sm:space-y-5">
          <Link
            href={primaryHref}
            onClick={hideActionModal}
            className="flex h-10 items-center justify-center rounded-none border-2 border-white text-sm font-semibold tracking-wide text-white transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-14 sm:border-4 sm:text-xl"
          >
            {primaryLabel}
          </Link>
          <button
            type="button"
            onClick={hideActionModal}
            className="block w-full text-center text-sm tracking-wide text-white underline underline-offset-4 transition hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-xl"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  )
}
