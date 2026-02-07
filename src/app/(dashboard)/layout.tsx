import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const store = await db.store.findFirst({
      where: { userId: session.user.id }
  });

  if (store && !store.whatsappNumber) {
    redirect("/onboarding");
  }

  const storeData = store
    ? {
        name: store.name,
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