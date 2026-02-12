"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";

interface SalesChartProps {
  className?: string;
  data?: { label: string; value: number }[];
  rangeLabel?: string;
}

export function SalesChart({ className, data: propData, rangeLabel = "Last 7 Days" }: SalesChartProps) {
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

  const maxValue = Math.max(...data.map((d) => d.value), 100);
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.value / maxValue) * 100,
  }));

  // Function to create a smooth Bézier path from points
  const getCurvePath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }
    return d;
  };

  const pathD = getCurvePath(points);
  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <Card className={cn("col-span-4 border-none shadow-none bg-transparent", className)}>
      <CardContent className="p-7">
        <div className="h-[300px] w-full pt-4 relative pl-12">
            {/* Y-axis labels */}
            <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-[10px] font-medium text-primary/20 h-[85%] w-12 pr-4 text-right">
                <span>{maxValue}</span>
                <span>{Math.round(maxValue * 0.75)}</span>
                <span>{Math.round(maxValue * 0.5)}</span>
                <span>{Math.round(maxValue * 0.25)}</span>
                <span>0</span>
            </div>

            {/* Chart Area */}
            <div className="h-full w-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between h-[85%]">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-px w-full bg-primary/5 border-dashed" />
                  ))}
                </div>

                {/* SVG Chart */}
                <svg className="w-full h-[85%] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#00311F" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#00311F" stopOpacity="0.2" />
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

                    {/* Line */}
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke="#00311F"
                        strokeWidth="0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    />
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between mt-6 text-[10px] font-medium text-primary/40 uppercase tracking-wider px-2">
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
