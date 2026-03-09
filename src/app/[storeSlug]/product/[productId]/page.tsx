import { redirect } from "next/navigation"

export default async function LegacyProductPage({
  params,
}: {
  params: Promise<{ storeSlug: string; productId: string }>
}) {
  const { storeSlug, productId } = await params
  redirect(`/${storeSlug}/products/${productId}`)
}
