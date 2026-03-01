import { StorefrontLoader } from "@/app/[storeSlug]/components/storefront-loader";

export default function StorefrontLoading() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-background">
      <StorefrontLoader className="scale-110" />
    </div>
  );
}
