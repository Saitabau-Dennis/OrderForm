import { notFound } from "next/navigation"
import Image from "next/image"
import db from "@/lib/db"
import { formatOrderId } from "@/lib/utils"
import { StoreNavbar } from "../../components/store-navbar"
import { StoreFooter } from "../../components/store-footer"
import { StoreBreadcrumbs } from "../../components/store-breadcrumbs"
import { PaymentActions } from "./payment-actions"

type PaymentPageProps = {
  params: Promise<{ storeSlug: string }>
  searchParams: Promise<{
    method?: string
    orderId?: string
    orderReference?: string
    total?: string
    date?: string
  }>
}

export default async function PaymentPage({ params, searchParams }: PaymentPageProps) {
  const { storeSlug } = await params
  const { method, orderId, orderReference, total, date } = await searchParams

  const store = await db.store.findUnique({
    where: { slug: storeSlug },
  })

  if (!store) {
    notFound()
  }

  const categoryRows = await db.product.findMany({
    where: { storeId: store.id, isAvailable: true, category: { not: null } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  })

  const categories = categoryRows
    .map((entry) => entry.category?.trim() || "")
    .filter(Boolean)

  const safeStore = {
    name: store.name,
    brandColor: store.brandColor,
    slug: store.slug,
    categories,
    socialLinks: {
      instagramUrl: store.instagramUrl,
      facebookUrl: store.facebookUrl,
      tiktokUrl: store.tiktokUrl,
      xUrl: store.xUrl,
    },
  }

  const selectedMethod = method === "card" ? "card" : "mpesa"
  // Order details are optional here because user may arrive from stale/shared links.
  const order = orderId
    ? await db.order.findFirst({
      where: {
        id: orderId,
        storeId: store.id,
      },
      select: {
        orderNumber: true,
        displayId: true,
        totalAmount: true,
        createdAt: true,
      },
    })
    : null

  const displayOrderNumber = order
    ? formatOrderId(order.displayId || order.orderNumber)
    : (orderReference || "PENDING")
  // Fallback precedence: DB order -> query param -> current date.
  const displayDate = order
    ? new Date(order.createdAt).toLocaleDateString("en-KE", { month: "long", day: "numeric", year: "numeric" })
    : date
      ? new Date(date).toLocaleDateString("en-KE", { month: "long", day: "numeric", year: "numeric" })
      : new Date().toLocaleDateString("en-KE", { month: "long", day: "numeric", year: "numeric" })
  const parsedTotal = order ? Number(order.totalAmount) : Number(total || 0)
  const displayTotal = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: store.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(parsedTotal) ? parsedTotal : 0)

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <StoreNavbar store={safeStore} />

      <main className="flex-1 w-full px-3 py-7 sm:px-5 md:py-10 lg:px-7">
        <div className="mx-auto w-full max-w-[1240px]">
          <StoreBreadcrumbs
            items={[
              { label: "Home", href: `/${store.slug}` },
              { label: "Cart", href: `/${store.slug}/cart` },
              { label: "Checkout", href: `/${store.slug}/checkout` },
              { label: "Payment" },
            ]}
            className="mb-4"
          />

          <div className="border border-[#DADAD5] bg-transparent p-4 sm:p-6 md:p-8">
          <div className="grid gap-4 border-b border-[#E0E0DB] pb-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetaItem label="Order Number:" value={displayOrderNumber} />
            <MetaItem label="Date:" value={displayDate} />
            <MetaItem label="Total:" value={displayTotal} />
            <MetaItem label="Payment Method:" value={selectedMethod === "mpesa" ? "M-PESA" : "CARD"} />
          </div>

          {selectedMethod === "mpesa" ? (
            <section className="pt-6">
              <h2 className="text-[18px] font-medium leading-tight text-[#1A1A1A] md:text-[18px]">Payment Instructions</h2>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-[13px] leading-relaxed text-[#666661] md:text-[14px]">
                <li>Click on the <strong>Pay</strong> button in order to initiate the M-PESA payment.</li>
                <li>Check your mobile phone for a prompt asking you to enter your M-PESA pin.</li>
                <li>If there is <strong>NO PROMPT</strong> on your phone, the M-PESA balance could be insufficient, top up the M-PESA account and try again.</li>
                <li>Enter your <strong>M-PESA PIN</strong> and the amount specified on the notification will be deducted from your M-PESA account when you press send.</li>
                <li>When you enter the pin and click on send, you will receive an M-PESA payment confirmation message on your mobile phone.</li>
                <li>After receiving the confirmation message please click <strong>Complete Order</strong> below to finish your order.</li>
              </ol>

              <PaymentActions storeSlug={store.slug} method="mpesa" />
            </section>
          ) : (
            <section className="pt-6">
              <h2 className="text-[24px] font-semibold leading-tight text-[#1A1A1A] md:text-[27px]">Card Payment</h2>
              <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-[#666661] md:text-[15px]">
                Proceed to secure card checkout and complete payment using Visa, Mastercard, Amex, Apple Pay or M-PESA card channels.
              </p>

              <div className="mt-5 rounded border border-[#DDDDD8] bg-white/80 p-3 sm:p-4">
                <p className="mb-2 text-center text-xs font-semibold text-[#1D2D73] sm:text-sm">Secured by paystack</p>
                <Image
                  src="/images/paystack-ke.png"
                  alt="Card payment options"
                  width={720}
                  height={120}
                  className="mx-auto h-auto w-full max-w-[640px] object-contain"
                />
              </div>

              <PaymentActions storeSlug={store.slug} method="card" />
            </section>
          )}
        </div>
        </div>
      </main>

      <StoreFooter
        storeName={store.name}
        socialLinks={safeStore.socialLinks}
      />
    </div>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 border-r border-dashed border-[#D5D5CF] pr-4 last:border-r-0">
      <p className="text-[10px] uppercase tracking-[0.12em] text-[#6E6E68] sm:text-[11px]">{label}</p>
      <p className="text-[18px] font-semibold leading-none text-[#1A1A1A] md:text-[20px]">{value}</p>
    </div>
  )
}
