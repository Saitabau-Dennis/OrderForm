import { redirect } from "next/navigation"
import { storefrontPath } from "@/lib/storefront-path"

export default async function LegacyProductPage({
  params,
}: {
  params: Promise<{ storeSlug: string; productId: string }>
}) {
  const { storeSlug, productId } = await params
  redirect(storefrontPath(storeSlug, `/catalog/${productId}`))
}
