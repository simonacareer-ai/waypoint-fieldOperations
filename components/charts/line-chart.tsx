"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: Array<{ date: string; value: number }>;
  color?: string;
  height?: number;
}

export function LineChart({ data, color = "#2563EB", height = 200 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          className="text-xs"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--surface-primary)",
            border: "1px solid var(--border-default)",
            borderRadius: "8px",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
