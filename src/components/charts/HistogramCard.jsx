import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartCard } from "@/components/kit";

export default function HistogramCard({
  title,
  subtitle,
  actions,
  data = [],
  xKey = "bin",
  yKey = "count",
  fill = "#2d72d2",
  height = 250,
}) {
  return (
    <ChartCard title={title} subtitle={subtitle} actions={actions}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeOpacity={0.15} vertical={false} />
          <XAxis dataKey={xKey} fontSize={11} />
          <YAxis fontSize={11} />
          <Tooltip />
          <Bar dataKey={yKey} fill={fill} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
