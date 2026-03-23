interface DashboardLightweightLoaderProps {
  label: string;
}

function DashboardLightweightLoader({ label }: DashboardLightweightLoaderProps) {
  return (
    <div className="flex-1 p-8 pt-0">
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div
          className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary"
          aria-hidden="true"
        />
        <p className="text-xs font-normal tracking-wide text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function DashboardOverviewLoading() {
  return <DashboardLightweightLoader label="Loading overview..." />;
}

export function OrdersPageLoading() {
  return <DashboardLightweightLoader label="Loading orders..." />;
}

export function ProductsPageLoading() {
  return <DashboardLightweightLoader label="Loading products..." />;
}

export function CustomersPageLoading() {
  return <DashboardLightweightLoader label="Loading customers..." />;
}

export function SettingsPageLoading() {
  return <DashboardLightweightLoader label="Loading settings..." />;
}
