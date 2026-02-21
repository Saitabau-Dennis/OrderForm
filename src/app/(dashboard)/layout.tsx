import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardFontScope } from "@/components/dashboard/dashboard-font-scope";
import { LoginToast } from "@/components/dashboard/login-toast";

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
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      whatsappNumber: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  const storeData = store
    ? {
        name: store.name,
        slug: store.slug,
        configured: Boolean(store.whatsappNumber?.trim()),
        hasFirstProduct: store._count.products > 0,
      }
    : null;

  return (
    <DashboardFontScope>
      <DashboardShell user={session.user} store={storeData}>
        {children}
      </DashboardShell>
      <LoginToast />
    </DashboardFontScope>
  );
}
