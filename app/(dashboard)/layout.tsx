import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Store } from "@/lib/models/Store";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  const store = await Store.findOne({ userId: session.user.id });

  const storeData = store
    ? {
        slug: store.slug,
        configured: !!store.whatsappNumber,
      }
    : null;

  return (
    <DashboardShell user={session.user} store={storeData}>
      {children}
    </DashboardShell>
  );
}
