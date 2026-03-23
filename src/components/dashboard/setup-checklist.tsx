import Link from "next/link";
import type { ReactNode } from "react";
import { CheckCircle2, Package, Store } from "lucide-react";

import { Button } from "@/components/dashboard/dashboard-button";

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
        icon: <Store className="h-7 w-7 text-muted-foreground" />,
      title: "Configure Your Store",
      description: "Create a unique look and feel for your online store.",
      completed: isStoreConfigured,
      actionLabel: "Configure Store",
      href: "/settings",
      disabled: false,
    },
    {
        icon: <Package className="h-7 w-7 text-muted-foreground" />,
      title: "Add your first product",
      description: "Pick your product type, write an awesome description and save it.",
      completed: hasFirstProduct,
      actionLabel: "Add Product",
      href: "/products/new",
      disabled: !isStoreConfigured,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-2xl py-1">
      <div className="mb-5 text-center">
        <div className="flex items-center justify-start gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {displayName}&apos;s Store
          </h2>
          <span className="text-xl text-[#1A1A1A]">🛒</span>
        </div>
          <p className="mt-2 text-xs text-muted-foreground md:text-sm">
          Complete the <span className="text-emerald-600">{displayName}</span>{" "}
          store setup and start selling your awesome products in no time.
        </p>
      </div>

      <div className="space-y-2">
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
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-border/50 bg-muted/30 px-5 py-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center ">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {completed ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : null}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="flex shrink-0 justify-end">
        {completed ? (
          <CheckCircle2 className="h-9 w-9 text-emerald-500" />
        ) : disabled ? (
          <Button
            type="button"
            size="sm"
            disabled
            className="h-9 w-[120px] rounded-lg border border-primary/20 bg-primary/10 text-xs text-primary/50"
          >
            {actionLabel}
          </Button>
        ) : (
          <Button
            asChild
            size="sm"
            className="h-9 w-[120px] rounded-lg bg-primary text-xs text-primary-foreground hover:bg-primary/90"
          >
            <Link href={href}>{actionLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
