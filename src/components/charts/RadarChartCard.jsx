import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/components/kit";

export default function RadarChartCard({
  title,
  subtitle,
  actions,
  data = [],
  angleKey = "metric",
  series = [],
  height = 300,
}) {
  return (
    <ChartCard title={title} subtitle={subtitle} actions={actions}>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data}>
          <PolarGrid strokeOpacity={0.2} />
          <PolarAngleAxis dataKey={angleKey} fontSize={11} />
          <PolarRadiusAxis domain={[0, 100]} fontSize={10} />
          <Tooltip />
          <Legend />
          {series.map((s, i) => (
            <Radar key={i} dataKey={s.key} name={s.name ?? s.key} stroke={s.stroke} fill={s.stroke} fillOpacity={0.15} />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
