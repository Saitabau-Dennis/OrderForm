import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { Users, MousePointerClick, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AnalyticsPage() {
  const metrics = [
    {
      title: "Total Visitors",
      value: "0",
      change: "0%",
      trend: "neutral",
      icon: Users,
      description: "Total unique visitors",
    },
    {
      title: "Bounce Rate",
      value: "0%",
      change: "0%",
      trend: "neutral", // down is good for bounce rate
      icon: MousePointerClick,
      description: "Percentage of single-page visits",
    },
    {
      title: "Avg. Session Duration",
      value: "0m 0s",
      change: "0%",
      trend: "neutral",
      icon: Clock,
      description: "Average time spent on site",
    },
    {
      title: "Conversion Rate",
      value: "0%",
      change: "0%",
      trend: "neutral",
      icon: ArrowUpRight,
      description: "Visitor to customer conversion",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Detailed insights into your store's performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-muted-foreground font-medium">{metric.change}</span>
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <SalesChart className="lg:col-span-7" />
      </div>
    </div>
  );
}
