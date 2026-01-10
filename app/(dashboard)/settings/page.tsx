import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Store } from "@/lib/models/Store";
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

  await dbConnect();

  // Find store for the current user
  const store = await Store.findOne({ userId: session.user.id });

  // If no store exists, we pass null. The form should handle creating a new store.
  const storeData = store ? JSON.parse(JSON.stringify(store)) : null;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-sans">Store Settings</h2>
      </div>
      <SettingsForm initialData={storeData} />
    </div>
  );
}
