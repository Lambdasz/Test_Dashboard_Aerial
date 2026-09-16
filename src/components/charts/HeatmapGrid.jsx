import { ChartCard } from "@/components/kit";
import { HeatCell } from "@/components/kit";

export default function HeatmapGrid({ title, subtitle, actions, values = [], columns = 12, max = 100 }) {
  return (
    <ChartCard title={title} subtitle={subtitle} actions={actions}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 6 }}>
        {values.map((v, i) => <HeatCell key={i} value={v} max={max} />)}
      </div>
    </ChartCard>
  );
}
