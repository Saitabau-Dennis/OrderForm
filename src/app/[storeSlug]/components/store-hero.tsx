"use client";

import { useStore } from "./store-context";

interface StoreHeroProps {
  name: string;
  description?: string;
}

export function StoreHero({ name, description }: StoreHeroProps) {
  const { brandColor } = useStore();

  return (
    <section className="relative overflow-hidden font-jakarta" style={{ backgroundColor: "#F8F6F3" }}>
      {/* Gradient orbs */}
      <div
        className="absolute top-[-30%] right-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.07] blur-[120px]"
        style={{ backgroundColor: brandColor }}
      />
      <div
        className="absolute bottom-[-30%] left-[-15%] w-[40vw] h-[40vw] rounded-full opacity-[0.05] blur-[100px]"
        style={{ backgroundColor: brandColor }}
      />

      <div className="container mx-auto px-5 md:px-8 relative z-10 pt-36 pb-28 md:pt-44 md:pb-36">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-stone-900 leading-[0.9] tracking-[-0.04em] font-jakarta mb-8">
            {name}
          </h1>

          <div className="flex items-center gap-2 mb-8">
            <div className="h-[2px] w-6 rounded-full" style={{ backgroundColor: brandColor, opacity: 0.3 }} />
            <div className="h-[2px] w-12 rounded-full" style={{ backgroundColor: brandColor, opacity: 0.6 }} />
            <div className="h-[2px] w-6 rounded-full" style={{ backgroundColor: brandColor, opacity: 0.3 }} />
          </div>

          <div className="max-w-lg">
            {description ? (
              <div
                className="text-base md:text-[17px] text-stone-400 leading-relaxed prose prose-p:my-0"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-base md:text-[17px] text-stone-400 leading-relaxed">
                Explore our curated collection of quality products,
                designed for people who appreciate the finer things.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}