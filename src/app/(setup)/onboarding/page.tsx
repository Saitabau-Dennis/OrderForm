import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Legacy onboarding route now maps to settings-based setup.
  redirect("/settings");
}
