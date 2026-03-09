import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your store settings",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
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
    <div className="flex-1 space-y-4 p-8 pt-0 animate-appear">
      <SettingsForm initialData={storeData} userData={session.user} />
    </div>
  );
}
