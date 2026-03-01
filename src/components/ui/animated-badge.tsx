"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface AnimatedBadgeProps {
  text: string;
}

export const AnimatedBadge = ({ text }: AnimatedBadgeProps) => {
  return (
    <div className="group mb-8 inline-flex items-center rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary shadow-[0_8px_20px_rgba(0,49,31,0.14)] transition-colors hover:bg-primary/10">
      <span className="pr-2 text-[0.95rem] leading-none">🎉</span>
      <span className="mr-2 h-4 w-px bg-primary/25" />
      <span>{text}</span>
      <ChevronRight className="ml-2 h-3.5 w-3.5" />
    </div>
  );
};

AnimatedBadge.displayName = "AnimatedBadge";
