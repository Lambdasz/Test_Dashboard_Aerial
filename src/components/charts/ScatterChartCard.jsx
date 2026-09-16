import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ZAxis } from "recharts";
import { ChartCard } from "@/components/kit";

export default function ScatterChartCard({
  title, subtitle, desc, actions,
  data = [], xKey = "x", yKey = "y", zKey = "z",
  xLabel = "x", yLabel = "y", fill = "#2d72d2", height = 300,
}) {
  return (
    <ChartCard title={title} subtitle={subtitle} desc={desc} actions={actions}>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey={xKey} name={xLabel} fontSize={11} />
          <YAxis dataKey={yKey} name={yLabel} fontSize={11} />
          <ZAxis dataKey={zKey} range={[40, 200]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} fill={fill} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
