import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default async function CustomersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  const store = await db.store.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!store) {
    redirect("/onboarding");
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-heading text-lg">Customer List</CardTitle>
              <CardDescription className="font-sans">
                A list of all customers who have placed orders in your store.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-heading text-lg font-medium text-foreground mb-2">No customers yet</h3>
            <p className="text-muted-foreground font-sans max-w-sm mb-6">
              When customers place orders on your store, they will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
