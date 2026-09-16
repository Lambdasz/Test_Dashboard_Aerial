import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TagInput } from "@blueprintjs/core";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend as RLegend,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { ChartCard, Legend, KpiCard } from "@/components/kit";
import MapView from "@/components/map/MapView";
import { LAND_CLASSES, PLOTS, MAP_CENTER } from "@/data/mock";

export const Route = createFileRoute("/land-cover")({ component: LandCoverPage });

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
          <h2>Land Cover</h2>
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
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={donut} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {donut.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Legend items={LAND_CLASSES.map((c) => ({ color: c.color, label: c.label }))} />
          </ChartCard>
        </div>
        <div className="aap-span-8">
          <ChartCard title="Area per class">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={areas}>
                <CartesianGrid strokeOpacity={0.15} vertical={false} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="ha" radius={[3, 3, 0, 0]}>
                  {areas.map((a) => <Cell key={a.name} fill={a.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="aap-span-6">
          <ChartCard title="Composition per plot" subtitle="100% stacked">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stacked} stackOffset="expand">
                <CartesianGrid strokeOpacity={0.15} vertical={false} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                <Tooltip />
                <RLegend />
                <Bar dataKey="veg" stackId="a" fill="#1c6e42" />
                <Bar dataKey="soil" stackId="a" fill="#946638" />
                <Bar dataKey="water" stackId="a" fill="#2d72d2" />
                <Bar dataKey="built" stackId="a" fill="#7961db" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="aap-span-6">
          <ChartCard title="Thematic map" subtitle="Plot coloured by dominant class">
            <MapView
              center={MAP_CENTER}
              zoom={13}
              height={280}
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
