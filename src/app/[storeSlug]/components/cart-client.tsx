"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { storefrontPath } from "@/lib/storefront-path";
import { useStore } from "./store-provider";

type CartClientProps = {
  storeSlug: string;
  currency: string;
  productMeta: Array<{
    id: string;
    category: string | null;
  }>;
};

const ABOVE_FOLD_CART_IMAGE_COUNT = 2;

// Store-scoped key for optional checkout instructions entered in cart.
function getCartNoteStorageKey(storeSlug: string) {
  return `orderform_cart_note:${storeSlug}`;
}

export function CartClient({
  storeSlug,
  currency,
  productMeta,
}: CartClientProps) {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useStore();
  const cartNoteStorageKey = useMemo(
    () => getCartNoteStorageKey(storeSlug),
    [storeSlug],
  );
  const [specialInstructions, setSpecialInstructions] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(getCartNoteStorageKey(storeSlug)) || "";
    } catch {
      return "";
    }
  });

  const productCategoryMap = useMemo(
    () => new Map(productMeta.map((item) => [item.id, item.category])),
    [productMeta],
  );

  useEffect(() => {
    // Persist notes locally so users do not lose them before checkout.
    try {
      if (specialInstructions.trim()) {
        localStorage.setItem(cartNoteStorageKey, specialInstructions);
      } else {
        localStorage.removeItem(cartNoteStorageKey);
      }
    } catch (error) {
      console.error("Failed to save cart notes", error);
    }
  }, [cartNoteStorageKey, specialInstructions]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border border-[#CECEC9] rounded-none text-center">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
          Your cart is empty
        </h2>
        <p className="text-[#737373] text-sm mb-6 max-w-sm">
          Start shopping to add items to your cart.
        </p>
        <Link
          href={storefrontPath(storeSlug)}
          className="inline-flex items-center gap-2 h-12 px-6 bg-[#1A1A1A] text-white font-medium text-sm transition-opacity hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="hidden grid-cols-[minmax(0,1fr)_140px_150px] border-b border-[#D6D6D0] pb-3 text-[11px] uppercase tracking-[0.2em] text-[#666661] md:grid">
        <span>Product</span>
        <span className="text-center">Quantity</span>
        <span className="text-right">Total</span>
      </div>

      <div className="divide-y divide-[#DCDCD7] border-b border-[#DCDCD7]">
        {cart.map((item, index) => {
          const category =
            productCategoryMap.get(item.productId)?.trim() || "Featured";

          return (
            <div
              key={`${item.productId}-${item.variant}`}
              className="grid grid-cols-1 items-start gap-4 py-6 md:grid-cols-[minmax(0,1fr)_140px_150px] md:gap-6 md:py-8"
            >
              <div className="flex min-w-0 gap-4">
                <Link
                  href={storefrontPath(storeSlug, `/catalog/${item.productId}`)}
                  className="relative h-28 w-24 shrink-0 overflow-hidden rounded-none bg-[#ECECE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      priority={index < ABOVE_FOLD_CART_IMAGE_COUNT}
                      loading={index < ABOVE_FOLD_CART_IMAGE_COUNT ? "eager" : "lazy"}
                      className="object-cover"
                    />
                  ) : null}
                </Link>

                <div className="min-w-0 pt-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#666661]">
                    {category}
                  </p>
                  <p className="mt-2 line-clamp-2 text-base font-medium uppercase leading-snug tracking-wide text-[#111111] lg:text-lg">
                    {item.name}
                  </p>
                  {item.variant ? (
                    <p className="mt-2 text-[13px] text-[#63635E]">
                      {item.variant}
                    </p>
                  ) : null}
                  <p className="mt-2 text-base text-[#1A1A1A] lg:text-lg">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 md:justify-center">
                <div className="flex h-12 items-center border border-[#9A9A94] px-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variant,
                        item.quantity - 1,
                      )
                    }
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center text-lg text-[#555550] hover:bg-[#ECECE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                  >
                    -
                  </button>
                  <span className="inline-flex min-w-[38px] items-center justify-center text-base text-[#1A1A1A]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variant,
                        item.quantity + 1,
                      )
                    }
                    aria-label={`Increase quantity of ${item.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center text-lg text-[#555550] hover:bg-[#ECECE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.productId, item.variant)}
                  aria-label={`Remove ${item.name}`}
                  className="inline-flex h-9 w-9 items-center justify-center text-[#6A6A65] hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="pt-1 text-left text-lg font-medium text-[#111111] md:pt-2 md:text-right lg:text-xl">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <label
            htmlFor="cart-special-instructions"
            className="block text-sm uppercase tracking-[0.18em] text-[#44443F]"
          >
            Order special instructions
          </label>
          <textarea
            id="cart-special-instructions"
            rows={5}
            value={specialInstructions}
            onChange={(event) => setSpecialInstructions(event.target.value)}
            className="mt-3 w-full resize-y border border-[#9A9A94] bg-transparent p-3 text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
          />
        </div>

        <div className="flex flex-col items-start sm:items-end">
          <div className="w-full max-w-[380px] text-left sm:text-right">
            <div className="flex items-center justify-between text-[#131313]">
              <span className="text-[13px] uppercase tracking-[0.1em] lg:text-sm">
                Estimated total
              </span>
              <span className="text-xl font-medium lg:text-2xl">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#5E5E58]">
              Taxes, discounts and shipping calculated at checkout.
            </p>
            <Link
              href={storefrontPath(storeSlug, "/checkout")}
              className="mt-7 inline-flex h-[50px] w-full items-center justify-center rounded-none bg-[#0C0D10] px-6 text-lg font-medium tracking-wide text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            >
              Check out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
