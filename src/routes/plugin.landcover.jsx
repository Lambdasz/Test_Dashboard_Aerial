import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TagInput } from "@blueprintjs/core";
import { ChartCard, Legend, KpiCard } from "@/components/kit";
import { PieChartCard, BarChartCard, StackedBarChartCard } from "@/components/charts";
import MapView from "@/components/map/MapView";
import { LAND_CLASSES, PLOTS, MAP_CENTER } from "@/data/mock";

export const Route = createFileRoute("/plugin/landcover")({ component: LandCoverPage });

const SHARES = [31, 22, 18, 9, 12, 8];

function dominant(p) {
  const pairs = [
    ["veg", p.veg_pct, "#1c6e42"],
    ["soil", p.soil_pct, "#946638"],
    ["water", p.water_pct, "#2d72d2"],
    ["built", p.built_pct, "#7961db"],
  ];
  return pairs.sort((a, b) => b[1] - a[1])[0];
}

function LandCoverPage() {
  const [classes, setClasses] = useState(["orchard", "windbreak"]);

  const donut = LAND_CLASSES.map((c, i) => ({ name: c.label, value: SHARES[i], color: c.color }));
  const areas = LAND_CLASSES.map((c, i) => ({ name: c.label, ha: Math.round(SHARES[i] * 3.4 * 10) / 10, color: c.color }));
  const stacked = PLOTS.map((p) => ({
    name: p.id.replace("PLOT-", "P"),
    veg: p.veg_pct, soil: p.soil_pct, water: p.water_pct, built: p.built_pct,
  }));

  return (
    <>
      <div className="aap-section-title">
        <div>
          <h2>Land Cover Classification</h2>
          <p className="aap-muted">Thematic classification across {PLOTS.length} plots</p>
        </div>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3"><KpiCard label="Classes" value={LAND_CLASSES.length} /></div>
        <div className="aap-span-3"><KpiCard label="Classified area" value={338} unit="ha" /></div>
        <div className="aap-span-6">
          <ChartCard title="Custom classes" subtitle="Add labels for re-training">
            <TagInput values={classes} onChange={setClasses} placeholder="Add class…" />
          </ChartCard>
        </div>

        <div className="aap-span-4">
          <ChartCard title="Class distribution">
            <PieChartCard title="" data={donut} height={250} />
            <Legend items={LAND_CLASSES.map((c) => ({ color: c.color, label: c.label }))} />
          </ChartCard>
        </div>
        <div className="aap-span-8">
          <BarChartCard
            title="Area per class"
            data={areas}
            xKey="name"
            bars={[{ key: "ha", fill: "#2d72d2" }]}
            colorByCell
            height={250}
          />
        </div>

        <div className="aap-span-6">
          <StackedBarChartCard
            title="Composition per plot"
            subtitle="100% stacked"
            data={stacked}
            xKey="name"
            expand
            height={280}
            stacks={[
              { key: "veg", fill: "#1c6e42", name: "Vegetation" },
              { key: "soil", fill: "#946638", name: "Soil" },
              { key: "water", fill: "#2d72d2", name: "Water" },
              { key: "built", fill: "#7961db", name: "Built" },
            ]}
          />
        </div>
        <div className="aap-span-6">
          <ChartCard title="Thematic map" subtitle="Plot coloured by dominant class">
            <MapView
              center={MAP_CENTER} zoom={13} height={280}
              polygons={PLOTS.map((p) => {
                const [key, val, color] = dominant(p);
                return { positions: p.positions, color, label: p.name, detail: `${key} ${val}%` };
              })}
            />
          </ChartCard>
        </div>
      </div>
    </>
  );
}
