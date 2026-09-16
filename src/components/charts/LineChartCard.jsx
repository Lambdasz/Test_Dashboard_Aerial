import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { ChartCard } from "@/components/kit";

export default function LineChartCard({
  title,
  subtitle,
  actions,
  data = [],
  xKey = "date",
  lines = [{ key: "value", stroke: "#1c6e42" }],
  height = 260,
  showDots = false,
}) {
  return (
    <ChartCard title={title} subtitle={subtitle} actions={actions}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeOpacity={0.15} vertical={false} />
          <XAxis dataKey={xKey} fontSize={11} />
          <YAxis fontSize={11} />
          <Tooltip />
          {lines.length > 1 ? <Legend /> : null}
          {lines.map((l, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={l.key}
              name={l.name ?? l.key}
              stroke={l.stroke}
              strokeWidth={2}
              dot={showDots}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
