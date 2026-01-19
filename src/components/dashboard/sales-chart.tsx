"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface SalesChartProps {
  className?: string;
  data?: { label: string; value: number }[];
}

export function SalesChart({ className, data: propData }: SalesChartProps) {
  // Default empty/zero data if none provided
  const data = propData || [
    { label: "Sun", value: 0 },
    { label: "Mon", value: 0 },
    { label: "Tue", value: 0 },
    { label: "Wed", value: 0 },
    { label: "Thu", value: 0 },
    { label: "Fri", value: 0 },
    { label: "Sat", value: 0 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value), 100); // Dynamic max value, min 100
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.value / maxValue) * 100;
    return `${x},${y}`;
  });

  const pathD = `M ${points.map((p, i) => {
    const [x, y] = p.split(",");
    return `${x} ${y}`;
  }).join(" L ")}`;

  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sales Overview</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              This week
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full pt-4 relative pl-12">
            {/* Y-axis labels */}
            <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-muted-foreground h-[85%] w-12 pr-2 text-right">
                <span>{maxValue}</span>
                <span>{maxValue * 0.75}</span>
                <span>{maxValue * 0.5}</span>
                <span>{maxValue * 0.25}</span>
                <span>0</span>
            </div>

            {/* Chart Area */}
            <div className="h-full w-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between h-[85%]">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-px w-full bg-border/50 border-dashed" />
                  ))}
                </div>

                {/* SVG Chart */}
                <svg className="w-full h-[85%] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Area */}
                    <motion.path
                        d={areaD}
                        fill="url(#gradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                    {data.map((d) => (
                        <span key={d.label}>{d.label}</span>
                    ))}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
