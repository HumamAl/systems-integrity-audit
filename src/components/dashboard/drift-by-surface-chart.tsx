"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import type { DriftBySurfaceDataPoint } from "@/lib/types";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-border bg-background p-2.5 text-xs shadow-sm">
      <p className="font-mono font-medium mb-1.5 text-foreground truncate max-w-[160px]">
        {label}
      </p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="inline-block w-2 h-2 rounded-[2px] shrink-0"
            style={{ backgroundColor: entry.color as string }}
          />
          {entry.name}:{" "}
          <span className="font-mono font-medium text-foreground">
            {entry.value}
          </span>
        </p>
      ))}
    </div>
  );
};

// Shorten surface names for bar chart X-axis
const shortenSurface = (s: string) => {
  if (s.includes("HubSpot")) return "HubSpot";
  if (s.includes("Firebase")) return "Firebase";
  if (s.includes("Node.js")) return "Node.js";
  if (s.includes("WordPress")) return "WordPress";
  if (s.includes("React")) return "React FE";
  return s;
};

export function DriftBySurfaceChart({
  data,
}: {
  data: DriftBySurfaceDataPoint[];
}) {
  const chartData = data.map((d) => ({
    ...d,
    label: shortenSurface(d.surface),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 8, bottom: 0, left: -20 }}
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.6}
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-geist-mono)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-geist-mono)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={(props) => <CustomTooltip {...props} />} />
        <Legend
          wrapperStyle={{ fontSize: "10px", fontFamily: "var(--font-geist-mono)" }}
        />
        <Bar
          dataKey="openCount"
          name="Open"
          fill="var(--destructive)"
          radius={[2, 2, 0, 0]}
          stackId="a"
        />
        <Bar
          dataKey="resolvedCount"
          name="Resolved"
          fill="var(--success)"
          radius={[2, 2, 0, 0]}
          stackId="a"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
