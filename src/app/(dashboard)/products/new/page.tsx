import Link from "next/link";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { Button } from "@/components/dashboard/dashboard-button";
import { NewProductPageClient } from "@/components/dashboard/new-product-page-client";

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const store = await db.store.findFirst({
    where: { userId: session.user.id },
    select: {
      whatsappNumber: true,
    },
  });

  const isStoreConfigured = Boolean(store?.whatsappNumber?.trim());

  if (!isStoreConfigured) {
    return (
      <div className="min-h-[calc(100vh-4rem)] animate-appear p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Configure your store first
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Before adding products, finish your store setup in settings so your products are ready for customers.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button asChild variant="outline" className="h-10 px-4">
              <Link href="/dashboard">View Checklist</Link>
            </Button>
            <Button asChild className="h-10 px-4">
              <Link href="/settings">Go to Settings</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <NewProductPageClient />;
}
