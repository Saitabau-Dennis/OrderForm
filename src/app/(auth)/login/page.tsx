import { Suspense } from "react";
import { WaveLoader } from "@/components/ui/wave-loader";
import { LoginFormClient } from "./login-form-client";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[220px] items-center justify-center">
          <WaveLoader className="h-10" />
        </div>
      }
    >
      <LoginFormClient />
    </Suspense>
  );
}
