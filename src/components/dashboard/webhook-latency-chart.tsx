"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import type { WebhookLatencyDataPoint } from "@/lib/types";

const CustomTooltip = ({ active, payload, label }: TooltipContentProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-border bg-background p-2.5 text-xs shadow-sm">
      <p className="font-mono font-medium mb-1.5 text-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-muted-foreground">
          <span className="inline-block w-2 h-0.5 shrink-0" style={{ backgroundColor: entry.color as string }} />
          {entry.name}:{" "}
          <span className="font-mono font-medium text-foreground">
            {typeof entry.value === "number" && entry.name !== "Failures"
              ? `${entry.value} ms`
              : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
};

export function WebhookLatencyChart({ data }: { data: WebhookLatencyDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-geist-mono)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-geist-mono)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 6]}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-geist-mono)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={(props) => <CustomTooltip {...props} />} />
        <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "var(--font-geist-mono)" }} />
        <Bar
          yAxisId="left"
          dataKey="avgMs"
          name="Avg Latency"
          fill="var(--chart-1)"
          fillOpacity={0.7}
          barSize={14}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="p95Ms"
          name="p95 Latency"
          stroke="var(--warning)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="failureCount"
          name="Failures"
          stroke="var(--destructive)"
          strokeWidth={1.5}
          strokeDasharray="4 2"
          dot={{ r: 3, fill: "var(--destructive)" }}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
