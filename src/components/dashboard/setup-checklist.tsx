import Link from "next/link";
import type { ReactNode } from "react";
import { CheckCircle2, Package, ShoppingCart, Store } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SetupChecklistProps {
  storeName?: string | null;
  isStoreConfigured: boolean;
  hasFirstProduct: boolean;
}

export function SetupChecklist({
  storeName,
  isStoreConfigured,
  hasFirstProduct,
}: SetupChecklistProps) {
  if (isStoreConfigured && hasFirstProduct) {
    return null;
  }

  const displayName = storeName?.trim() ? storeName : "Your store";
  const steps = [
    {
      icon: <Store className="h-9 w-9 text-muted-foreground" />,
      title: "Configure Your Store",
      description: "Create a unique look and feel for your online store.",
      completed: isStoreConfigured,
      actionLabel: "Configure Store",
      href: "/settings",
      disabled: false,
    },
    {
      icon: <Package className="h-9 w-9 text-muted-foreground" />,
      title: "Add your first product",
      description: "Pick your product type, write an awesome description and save it.",
      completed: hasFirstProduct,
      actionLabel: "Add Product",
      href: "/products/new",
      disabled: !isStoreConfigured,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-5xl py-1">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {displayName}
          </h2>
          <ShoppingCart className="h-12 w-12 text-muted-foreground/70 md:h-16 md:w-16" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground md:text-xl">
          Complete the <span className="text-emerald-600">{displayName}</span>{" "}
          store setup and start selling your awesome products in no time.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <SetupItem
            key={step.title}
            icon={step.icon}
            title={step.title}
            description={step.description}
            completed={step.completed}
            actionLabel={step.actionLabel}
            href={step.href}
            disabled={step.disabled}
          />
        ))}
      </div>
    </section>
  );
}

interface SetupItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  completed: boolean;
  actionLabel: string;
  href: string;
  disabled: boolean;
}

function SetupItem({
  icon,
  title,
  description,
  completed,
  actionLabel,
  href,
  disabled,
}: SetupItemProps) {
  return (
    <div className="grid min-h-[102px] grid-cols-[auto_1fr_auto] items-center gap-4 px-2 py-4 md:px-0">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border/60 bg-transparent">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground md:text-lg">{title}</p>
          {completed ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : null}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground md:text-sm">{description}</p>
      </div>

      <div className="flex w-[132px] shrink-0 justify-end">
        {completed ? (
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        ) : disabled ? (
          <Button
            type="button"
            size="sm"
            disabled
            className="h-11 w-[132px] rounded-lg border border-primary/20 bg-primary/10 text-primary/50"
          >
            {actionLabel}
          </Button>
        ) : (
          <Button
            asChild
            size="sm"
            className="h-11 w-[132px] rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href={href}>{actionLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
