import { WaveLoader } from "@/components/ui/wave-loader";

export default function StorefrontLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <WaveLoader className="h-12" />
    </div>
  );
}
