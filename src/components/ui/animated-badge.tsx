"use client";

import React from "react";
import { motion } from "motion/react";

interface AnimatedBadgeProps {
  text: string;
}

export const AnimatedBadge = ({ text }: AnimatedBadgeProps) => {
  return (
    <div className="bg-primary/5 no-underline group mb-8 cursor-default relative shadow-xl shadow-primary/5 rounded-full p-px text-xs font-semibold leading-6 text-primary inline-block">
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,var(--primary)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-20"></span>
      </span>
      <div className="relative flex space-x-2 items-center z-10 rounded-full bg-white py-1 px-4 ring-1 ring-primary/10">
        <span className="text-sm">🛍️</span>
        <span className="text-primary/90">{text}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary/70"
        >
          <motion.path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M10.75 8.75L14.25 12L10.75 15.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          ></motion.path>
        </svg>
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transition-opacity duration-500 group-hover:opacity-40"></span>
    </div>
  );
};
