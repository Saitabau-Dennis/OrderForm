import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-3xl text-sm font-medium transition-all duration-200 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-2 border-primary-foreground/20 hover:bg-primary/90 active:translate-y-0.5 shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground border-2 border-destructive-foreground/20 hover:bg-destructive/90 active:translate-y-0.5 shadow-none",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-none",
        ghost: "hover:bg-accent hover:text-accent-foreground shadow-none",
        link: "text-primary underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs rounded-2xl",
        lg: "h-14 px-10 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const DashboardButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
DashboardButton.displayName = "DashboardButton";

export { DashboardButton as Button, buttonVariants };
