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
          <p className="aap-muted">Setiap primitif yang boleh diguna semula, dipaparkan secara berasingan</p>
        </div>
      </div>

      <FilterBar />

      <div className="aap-grid">
        <div className="aap-span-3">
          <KpiCard label="KPI card" value={2184} unit="pokok"
            desc="Kad KPI standard: label, nilai, unit, delta dan sparkline pilihan. Digunakan di seluruh platform." />
        </div>
        <div className="aap-span-3">
          <ChartCard title="Gauge" desc="Tolok bulat untuk metrik 0–100 seperti litupan vegetasi.">
            <Gauge value={64} max={100} unit="%" label="Coverage" />
          </ChartCard>
        </div>
        <div className="aap-span-6">
          <ChartCard title="Chart card" subtitle="Pembalut dengan tajuk, subtajuk, aksi dan desc"
            actions={<Button small icon="more" />}
            desc="Pembalut universal untuk mana-mana carta atau kandungan. Menyediakan tajuk, aksi dan slot deskripsi.">
            <p className="aap-muted">Kandungan bebas.</p>
          </ChartCard>
        </div>

        <div className="aap-span-4"><PieChartCard title="PieChartCard" data={samplePie} desc="Carta pai/donut untuk pecahan kategori." /></div>
        <div className="aap-span-8"><BarChartCard title="BarChartCard" data={sampleBars} bars={[{ key: "v", fill: "#2d72d2" }]} desc="Carta bar untuk perbandingan kategori." /></div>
        <div className="aap-span-6"><LineChartCard title="LineChartCard" data={sampleLine} xKey="d" lines={[{ key: "v", stroke: "#1c6e42" }]} showDots desc="Carta garis untuk trend masa." /></div>
        <div className="aap-span-6"><HistogramCard title="HistogramCard" data={sampleHist} desc="Histogram untuk taburan kekerapan." /></div>
        <div className="aap-span-6">
          <StackedBarChartCard
            title="StackedBarChartCard"
            desc="Carta bar bertindan untuk komposisi kategori."
            data={[{ name: "P1", a: 30, b: 20, c: 50 }, { name: "P2", a: 45, b: 25, c: 30 }]}
            stacks={[{ key: "a", fill: "#1c6e42" }, { key: "b", fill: "#946638" }, { key: "c", fill: "#2d72d2" }]}
          />
        </div>
        <div className="aap-span-6">
          <RadarChartCard
            title="RadarChartCard"
            desc="Carta radar untuk perbandingan pelbagai metrik."
            data={sampleRadar}
            series={[{ key: "a", stroke: "#2d72d2" }, { key: "b", stroke: "#c87619" }]}
          />
        </div>
        <div className="aap-span-6">
          <ScatterChartCard
            title="ScatterChartCard"
            desc="Carta sebar untuk korelasi antara dua pemboleh ubah."
            data={sampleBars.map((b, i) => ({ x: i * 10 + 5, y: b.v, z: b.v * 2 }))}
            xLabel="x" yLabel="v"
          />
        </div>
        <div className="aap-span-6">
          <HeatmapGrid title="HeatmapGrid" values={[8, 22, 37, 55, 71, 94, 12, 45, 60, 33, 78, 90]} columns={6}
            desc="Grid haba untuk kepadatan atau magnitud perubahan." />
        </div>

        <div className="aap-span-6">
          <ChartCard title="Data table" desc="Jadual data dengan penomboran halaman.">
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
          <ChartCard title="Before / after" desc="Slider pembanding untuk dua keadaan imejan.">
            <BeforeAfter height={220} before={<div className="aap-fake-rgb" />} after={<div className="aap-fake-mask" />} leftLabel="RGB" rightLabel="Mask" />
          </ChartCard>
        </div>

        <div className="aap-span-4"><ChartCard title="Legend" desc="Petunjuk warna dan label."><Legend items={LAND_CLASSES.map((c) => ({ color: c.color, label: c.label }))} /></ChartCard></div>
        <div className="aap-span-4"><ChartCard title="Empty state" desc="Paparan apabila tiada data."><EmptyState icon="search" title="Tiada hasil" description="Laraskan penapis." /></ChartCard></div>
        <div className="aap-span-4"><ChartCard title="Skeleton" desc="Placeholder semasa memuat data."><Skeleton lines={4} /></ChartCard></div>

        <div className="aap-span-4">
          <ChartCard title="Heat cells" desc="Sel haba individu.">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
              {[8, 22, 37, 55, 71, 94].map((v) => <HeatCell key={v} value={v} max={100} />)}
            </div>
          </ChartCard>
        </div>
        <div className="aap-span-4">
          <ChartCard title="Matrix" desc="Matriks peralihan atau korelasi.">
            <Matrix rows={["Veg", "Soil", "Water"]} columns={["Veg", "Soil", "Water"]} values={[[82, 12, 6], [18, 74, 8], [4, 9, 87]]} />
          </ChartCard>
        </div>
        <div className="aap-span-4">
          <ChartCard title="Log viewer" desc="Paparan log berwarna mengikut tahap."><LogViewer entries={PLUGIN_LOG} /></ChartCard>
        </div>

        <div className="aap-span-6">
          <ChartCard title="Thumbnail & review row" desc="Baris semakan untuk terima/tolak pengesanan.">
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
          <ChartCard title="Fake RGB / mask tiles" desc="Pratonton palsu RGB dan topeng untuk mockup.">
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
