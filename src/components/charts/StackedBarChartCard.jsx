import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { ChartCard } from "@/components/kit";

export default function StackedBarChartCard({
  title,
  subtitle,
  actions,
  data = [],
  xKey = "name",
  stacks = [],
  height = 280,
  expand = false,
}) {
  return (
    <ChartCard title={title} subtitle={subtitle} actions={actions}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} stackOffset={expand ? "expand" : "none"}>
          <CartesianGrid strokeOpacity={0.15} vertical={false} />
          <XAxis dataKey={xKey} fontSize={11} />
          <YAxis
            fontSize={11}
            tickFormatter={expand ? (v) => `${Math.round(v * 100)}%` : undefined}
          />
          <Tooltip />
          <Legend />
          {stacks.map((s, i) => (
            <Bar key={i} dataKey={s.key} name={s.name ?? s.key} stackId="a" fill={s.fill} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
