import { WaveLoader } from "@/components/ui/wave-loader";

export default function DashboardLoading() {
  return (
    <div className="h-[calc(100vh-theme(spacing.20))] w-full flex items-center justify-center">
      <WaveLoader className="h-12" />
    </div>
  );
}
