import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your store settings",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Find store for the current user
  const store = await db.store.findFirst({
      where: { userId: session.user.id },
      include: { deliveryZones: true }
  });

  // If no store exists, we pass null. The form should handle creating a new store.
  const storeData = store ? JSON.parse(JSON.stringify(store)) : null;

  return (
    <div className="space-y-8 animate-appear pb-10">
      {/* Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#004D31] to-[#00311F] text-primary-foreground shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
        
        <div className="relative z-10 px-8 py-10 md:px-12 md:py-14">
          <h2 className="font-instrument-serif text-4xl md:text-5xl font-medium tracking-tight">Store Settings</h2>
          <p className="mt-2 text-lg text-primary-foreground/80 font-instrument-sans max-w-xl leading-relaxed">
            Manage your store's identity, shipping configurations, and subscription details all in one place.
          </p>
        </div>
      </div>

      <div className="px-1">
        <SettingsForm initialData={storeData} userData={session.user} />
      </div>
    </div>
  );
}
