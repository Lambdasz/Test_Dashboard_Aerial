import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@blueprintjs/core";
import {
  KpiCard, ChartCard, DataTable, FilterBar, Gauge, BeforeAfter, Legend,
  EmptyState, Skeleton, HeatCell, Matrix, LogViewer, Thumb, ReviewRow,
} from "@/components/kit";
import { PieChartCard, BarChartCard, LineChartCard, StackedBarChartCard, HistogramCard, RadarChartCard, ScatterChartCard, HeatmapGrid } from "@/components/charts";
import { PLOTS, LAND_CLASSES, PLUGIN_LOG } from "@/data/mock";

export const Route = createFileRoute("/gallery")({ component: GalleryPage });

const sampleBars = [{ name: "A", v: 12 }, { name: "B", v: 24 }, { name: "C", v: 18 }, { name: "D", v: 30 }];
const samplePie = [
  { name: "Veg", value: 42, color: "#1c6e42" },
  { name: "Soil", value: 28, color: "#946638" },
  { name: "Water", value: 18, color: "#2d72d2" },
  { name: "Built", value: 12, color: "#7961db" },
];
const sampleLine = [{ d: "Apr", v: 62 }, { d: "May", v: 66 }, { d: "Jun", v: 70 }, { d: "Jul", v: 74 }];
const sampleHist = [{ bin: "0.1", count: 3 }, { bin: "0.2", count: 8 }, { bin: "0.3", count: 15 }, { bin: "0.4", count: 22 }, { bin: "0.5", count: 18 }];
const sampleRadar = [
  { metric: "Canopy", a: 62, b: 48 },
  { metric: "Vigour", a: 74, b: 55 },
  { metric: "Trees", a: 81, b: 60 },
  { metric: "Area", a: 55, b: 72 },
];

function GalleryPage() {
  return (
    <>
      <div className="aap-section-title">
        <div>
          <h2>Component Gallery</h2>
          <p className="aap-muted">Every reusable primitive in isolation</p>
        </div>
      </div>

      <FilterBar />

      <div className="aap-grid">
        {/* Primitives */}
        <div className="aap-span-3"><KpiCard label="KPI card" value={2184} unit="trees" /></div>
        <div className="aap-span-3"><ChartCard title="Gauge"><Gauge value={64} max={100} unit="%" label="Coverage" /></ChartCard></div>
        <div className="aap-span-6">
          <ChartCard title="Chart card" subtitle="Wrapper with title, subtitle, actions" actions={<Button small icon="more" />}>
            <p className="aap-muted">Arbitrary children.</p>
          </ChartCard>
        </div>

        {/* Charts */}
        <div className="aap-span-4"><PieChartCard title="PieChartCard" data={samplePie} /></div>
        <div className="aap-span-8"><BarChartCard title="BarChartCard" data={sampleBars} bars={[{ key: "v", fill: "#2d72d2" }]} /></div>
        <div className="aap-span-6"><LineChartCard title="LineChartCard" data={sampleLine} xKey="d" lines={[{ key: "v", stroke: "#1c6e42" }]} showDots /></div>
        <div className="aap-span-6"><HistogramCard title="HistogramCard" data={sampleHist} /></div>
        <div className="aap-span-6">
          <StackedBarChartCard
            title="StackedBarChartCard"
            data={[{ name: "P1", a: 30, b: 20, c: 50 }, { name: "P2", a: 45, b: 25, c: 30 }]}
            stacks={[{ key: "a", fill: "#1c6e42" }, { key: "b", fill: "#946638" }, { key: "c", fill: "#2d72d2" }]}
          />
        </div>
        <div className="aap-span-6">
          <RadarChartCard
            title="RadarChartCard"
            data={sampleRadar}
            series={[{ key: "a", stroke: "#2d72d2" }, { key: "b", stroke: "#c87619" }]}
          />
        </div>
        <div className="aap-span-6">
          <ScatterChartCard
            title="ScatterChartCard"
            data={sampleBars.map((b, i) => ({ x: i * 10 + 5, y: b.v, z: b.v * 2 }))}
            xLabel="x" yLabel="v"
          />
        </div>
        <div className="aap-span-6">
          <HeatmapGrid title="HeatmapGrid" values={[8, 22, 37, 55, 71, 94, 12, 45, 60, 33, 78, 90]} columns={6} />
        </div>

        {/* Structural primitives */}
        <div className="aap-span-6">
          <ChartCard title="Data table">
            <DataTable
              columns={[
                { key: "id", label: "Plot" },
                { key: "name", label: "Name" },
                { key: "area_ha", label: "Area", numeric: true },
              ]}
              rows={PLOTS.slice(0, 5)}
            />
          </ChartCard>
        </div>
        <div className="aap-span-6">
          <ChartCard title="Before / after">
            <BeforeAfter height={220} before={<div className="aap-fake-rgb" />} after={<div className="aap-fake-mask" />} leftLabel="RGB" rightLabel="Mask" />
          </ChartCard>
        </div>

        <div className="aap-span-4">
          <ChartCard title="Legend"><Legend items={LAND_CLASSES.map((c) => ({ color: c.color, label: c.label }))} /></ChartCard>
        </div>
        <div className="aap-span-4">
          <ChartCard title="Empty state"><EmptyState icon="search" title="No results" description="Adjust filters." /></ChartCard>
        </div>
        <div className="aap-span-4">
          <ChartCard title="Skeleton"><Skeleton lines={4} /></ChartCard>
        </div>

        <div className="aap-span-4">
          <ChartCard title="Heat cells">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
              {[8, 22, 37, 55, 71, 94].map((v) => <HeatCell key={v} value={v} max={100} />)}
            </div>
          </ChartCard>
        </div>
        <div className="aap-span-4">
          <ChartCard title="Matrix">
            <Matrix rows={["Veg", "Soil", "Water"]} columns={["Veg", "Soil", "Water"]} values={[[82, 12, 6], [18, 74, 8], [4, 9, 87]]} />
          </ChartCard>
        </div>
        <div className="aap-span-4">
          <ChartCard title="Log viewer"><LogViewer entries={PLUGIN_LOG} /></ChartCard>
        </div>

        <div className="aap-span-6">
          <ChartCard title="Thumbnail & review row">
            <ReviewRow>
              <Thumb />
              <div>
                <div className="aap-mono">TD-001</div>
                <div className="aap-muted">PLOT-01 · conf 0.82</div>
              </div>
              <div className="aap-flex" style={{ marginLeft: "auto" }}>
                <Button small intent="success" icon="tick" />
                <Button small intent="danger" icon="cross" />
              </div>
            </ReviewRow>
          </ChartCard>
        </div>
        <div className="aap-span-6">
          <ChartCard title="Fake RGB / mask tiles">
            <div className="aap-tiles-row">
              <div style={{ width: 180, height: 120 }}><div className="aap-fake-rgb" /></div>
              <div style={{ width: 180, height: 120 }}><div className="aap-fake-mask" /></div>
            </div>
          </ChartCard>
        </div>
      </div>
    </>
  );
}
