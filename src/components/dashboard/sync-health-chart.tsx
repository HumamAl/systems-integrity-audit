"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
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
import type { SyncHealthDataPoint } from "@/lib/types";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-border bg-background p-2.5 text-xs shadow-sm">
      <p className="font-mono font-medium mb-1.5 text-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="inline-block w-2 h-0.5 shrink-0"
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

export function SyncHealthChart({ data }: { data: SyncHealthDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.6}
        />
        <XAxis
          dataKey="month"
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
        <Line
          type="monotone"
          dataKey="failedSyncs"
          name="Failed Syncs"
          stroke="var(--destructive)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="driftEvents"
          name="Drift Events"
          stroke="var(--warning)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="avgLagSeconds"
          name="Avg Lag (s)"
          stroke="var(--chart-1)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
