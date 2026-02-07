import { notFound } from "next/navigation";
import db from "@/lib/db";
import { StoreProvider } from "./components/store-context";
import { StoreCart } from "./components/store-cart";

export default async function StoreRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;

  const store = await db.store.findUnique({
    where: { slug: storeSlug },
  });

  if (!store) {
    notFound();
  }

  return (
    <StoreProvider
      currency={store.currency}
      brandColor={store.brandColor || "#000000"}
      secondaryColor={store.secondaryColor || "#95D5B2"}
      storeName={store.name}
      whatsappNumber={store.whatsappNumber || ""}
      storeId={store.id}
    >
      {children}
      <StoreCart
        storeName={store.name}
        whatsappNumber={store.whatsappNumber || ""}
        storeId={store.id}
      />
    </StoreProvider>
  );
}
