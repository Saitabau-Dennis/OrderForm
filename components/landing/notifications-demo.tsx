"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/ui/animated-list";
import { MessageCircle } from "lucide-react";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications = [
  {
    name: "Sarah M.",
    description: "Do you have a green one?",
    time: "Just now",
    icon: "message",
    color: "#25D366", // WhatsApp green
  },
  {
    name: "John D.",
    description: "How much is this??",
    time: "1m ago",
    icon: "message",
    color: "#007AFF", // iMessage blue
  },
  {
    name: "Mike R.",
    description: "What colors do you have?",
    time: "2m ago",
    icon: "message",
    color: "#25D366",
  },
  {
    name: "Lisa K.",
    description: "Is this still available?",
    time: "2m ago",
    icon: "message",
    color: "#E1306C", // Instagram gradient-ish (pink)
  },
  {
    name: "David W.",
    description: "Location please?",
    time: "3m ago",
    icon: "message",
    color: "#007AFF",
  },
  {
    name: "Emily S.",
    description: "Can I pay on delivery?",
    time: "5m ago",
    icon: "message",
    color: "#25D366",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white border border-black/5 shadow-sm",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: color,
          }}
        >
          <MessageCircle className="text-white size-5" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-base font-heading font-bold text-foreground">{name}</span>
            <span className="mx-1 text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground font-sans">{time}</span>
          </figcaption>
          <p className="text-sm font-normal text-muted-foreground font-sans">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function NotificationsDemo({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden rounded-lg bg-background p-6",
        className,
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
    </div>
  );
}
