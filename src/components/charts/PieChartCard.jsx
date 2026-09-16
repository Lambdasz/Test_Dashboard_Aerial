import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@/components/kit";

export default function PieChartCard({ title, subtitle, desc, data = [], inner = 55, outer = 90, height = 260, actions }) {
  return (
    <ChartCard title={title} subtitle={subtitle} desc={desc} actions={actions}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={inner} outerRadius={outer} paddingAngle={2}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
