"use client";

import { cva } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

const bouncingDotsVariant = cva("flex items-center justify-center gap-2", {
  variants: {
    messagePlacement: {
      bottom: "flex-col",
      right: "flex-row",
      left: "flex-row-reverse",
    },
  },
  defaultVariants: {
    messagePlacement: "bottom",
  },
});

type MessagePlacement = "bottom" | "left" | "right";

interface WaveLoaderProps {
  dots?: number;
  color?: string;
  message?: string;
  messagePlacement?: MessagePlacement;
}

export function WaveLoader({
  dots = 3,
  color = "#00311F",
  message,
  messagePlacement = "bottom",
  className,
  ...props
}: HTMLMotionProps<"div"> & WaveLoaderProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "w-full p-4",
        bouncingDotsVariant({ messagePlacement }),
        className
      )}
    >
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: dots }).map((_, index) => (
          <motion.div
            key={index}
            className="h-3 w-3 rounded-full bg-foreground"
            style={{ backgroundColor: color }}
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 0.6,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            {...props}
          />
        ))}
      </div>
      {message ? <div>{message}</div> : null}
    </div>
  );
}
