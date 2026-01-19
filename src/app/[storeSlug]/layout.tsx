import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import { Store } from "@/lib/models/Store";
import { StoreWrapper } from "./components/store-wrapper";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  await dbConnect();

  // We need to await params in Next.js 15
  const { storeSlug } = await params;

  const store = await Store.findOne({ slug: storeSlug });

  if (!store) {
    notFound();
  }

  const serializedStore = JSON.parse(JSON.stringify(store));

  return (
    <StoreWrapper store={serializedStore}>
      {children}
    </StoreWrapper>
  );
}
