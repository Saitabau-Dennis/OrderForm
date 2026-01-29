import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { Store } from "lucide-react";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  try {
    const store = await db.store.findFirst({
      where: { userId: session.user.id },
      include: { deliveryZones: true }
    });

    if (store?.whatsappNumber) {
      redirect("/dashboard");
    }

    const initialData = store ? JSON.parse(JSON.stringify(store)) : null;

    return (
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <OnboardingWizard initialData={initialData} />
      </div>
    );
  } catch (error) {
    console.error("Onboarding DB Error:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-500">
        <div className="h-24 w-24 bg-[#00311F]/5 rounded-full flex items-center justify-center mb-6">
          <Store className="w-10 h-10 text-[#00311F] opacity-20" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#00311F] font-sora tracking-tight mb-3">
          We're getting things ready for you.
        </h2>
        <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed mb-8">
          It looks like our connection is a bit slow right now. Please refresh the page to continue setting up your store.
        </p>
        <a 
          href="/onboarding"
          className="bg-[#00311F] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Try Again
        </a>
      </div>
    );
  }
}