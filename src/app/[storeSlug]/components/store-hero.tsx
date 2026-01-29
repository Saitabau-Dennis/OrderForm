"use client";

import { useStore } from "./store-context";

interface StoreHeroProps {
  name: string;
  description?: string;
}

export function StoreHero({ name, description }: StoreHeroProps) {
  const { brandColor } = useStore();

  return (
    <div className="bg-white pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div
            className="group flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.25em] bg-white border border-gray-100 mb-10 shadow-sm hover:shadow-md transition-all cursor-default"
            style={{ color: brandColor }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: brandColor }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: brandColor }}></span>
            </span>
            WhatsApp Shopping
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 font-sora tracking-tighter leading-[1] mb-8">
            {name}
          </h1>

          <div className="space-y-6 max-w-2xl mx-auto">
            {description ? (
              <div
                className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed prose prose-p:my-0 prose-p:leading-relaxed prose-strong:font-semibold prose-headings:font-bold text-center"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed">
                Welcome to our store. Explore our curated collection of quality products and enjoy a seamless shopping experience.
              </p>
            )}
          </div>

          <div
            className="h-1.5 w-24 rounded-full opacity-10 mt-10"
            style={{ backgroundColor: brandColor }}
          />
        </div>
      </div>
    </div>
  );
}