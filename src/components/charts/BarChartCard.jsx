import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell, Legend } from "recharts";
import { ChartCard } from "@/components/kit";

export default function BarChartCard({
  title,
  subtitle,
  actions,
  data = [],
  xKey = "name",
  bars = [{ key: "value", fill: "#2d72d2" }],
  height = 260,
  colorByCell = false,
  showLegend = false,
}) {
  return (
    <ChartCard title={title} subtitle={subtitle} actions={actions}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeOpacity={0.15} vertical={false} />
          <XAxis dataKey={xKey} fontSize={11} />
          <YAxis fontSize={11} />
          <Tooltip />
          {showLegend ? <Legend /> : null}
          {bars.map((b, bi) => (
            <Bar key={bi} dataKey={b.key} name={b.name ?? b.key} fill={b.fill} radius={[3, 3, 0, 0]}>
              {colorByCell ? data.map((d, i) => <Cell key={i} fill={d.color ?? b.fill} />) : null}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
