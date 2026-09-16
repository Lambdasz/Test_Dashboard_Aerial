import { createFileRoute } from "@tanstack/react-router";
import { Tag } from "@blueprintjs/core";
import { KpiCard, ChartCard, DataTable } from "@/components/kit";
import { RadarChartCard } from "@/components/charts/index.js";
import { PLOTS } from "@/data/mock";

export const Route = createFileRoute("/plots")({ component: PlotsPage });

function PlotsPage() {
  const area = Math.round(PLOTS.reduce((a, p) => a + p.area_ha, 0) * 10) / 10;
  const perim = PLOTS.reduce((a, p) => a + p.perimeter_m, 0);
  const maxTrees = Math.max(...PLOTS.map((p) => p.trees));
  const maxArea = Math.max(...PLOTS.map((p) => p.area_ha));

  const radar = ["Canopy", "Vigour", "Trees", "Area"].map((metric) => {
    const row = { metric };
    PLOTS.slice(0, 4).forEach((p) => {
      row[p.id] =
        metric === "Canopy" ? p.canopy_pct
        : metric === "Vigour" ? Math.round(p.vigour * 100)
        : metric === "Trees" ? Math.round((p.trees / maxTrees) * 100)
        : Math.round((p.area_ha / maxArea) * 100);
    });
    return row;
  });

  const ranked = [...PLOTS].sort((a, b) => b.veg_pct - a.veg_pct);
  const colors = ["#2d72d2", "#1c6e42", "#c87619", "#7961db"];

  return (
    <>
      <div className="aap-section-title">
        <div>
          <h2>Plots</h2>
          <p className="aap-muted">Geometri, komposisi, sama ranking {PLOTS.length} plot terkelola</p>
        </div>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3">
          <KpiCard label="Total area" value={area} unit="ha"
            desc="Total luas semua plot. Ini jadi dasar buat ngitung hasil dan ngerencanain operasionalnya." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Total perimeter" value={perim} unit="m"
            desc="Total keliling semua plot. Berguna buat ngerencanain kebutuhan pagar atau pemantauan batas." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Plots" value={PLOTS.length}
            desc="Jumlah plot terkelola di dalam proyek." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Trees" value={PLOTS.reduce((a, p) => a + p.trees, 0)}
            desc="Total pohon di semua plot. Didapat dari plugin Tree Detection." />
        </div>

        <div className="aap-span-8">
          <div className="aap-card">
            <div className="aap-card-head"><h3 className="aap-card-title">Plot register</h3></div>
            <DataTable
              desc="Daftar lengkap semua plot: nama, jenis tanaman, luas, keliling, jumlah pohon, sama persen kanopinya. Ini rujukan utama buat manajemen plot."
              columns={[
                { key: "id", label: "Plot" }, { key: "name", label: "Name" }, { key: "crop", label: "Crop" },
                { key: "area_ha", label: "Area (ha)", numeric: true },
                { key: "perimeter_m", label: "Perimeter (m)", numeric: true },
                { key: "trees", label: "Trees", numeric: true },
                { key: "canopy_pct", label: "Canopy %", numeric: true },
              ]}
              rows={PLOTS}
            />
          </div>
        </div>
        <div className="aap-span-4">
          <ChartCard
            title="Ranking by vegetation"
            desc="Ranking plot berdasarkan persen vegetasinya. Bantu nandain plot terbaik sama plot yang butuh intervensi."
          >
            <div className="aap-list-scroll">
              {ranked.map((p, i) => (
                <div key={p.id} className={`aap-list-item ${i === 0 ? "is-active" : ""}`}>
                  <span className="aap-mono">{i + 1}. {p.id}</span> - {p.name}
                  <span className="aap-muted"> {p.veg_pct}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="aap-span-6">
          <RadarChartCard
            title="Multi-plot profile"
            subtitle="Dinormalisasi 0-100"
            desc="Radar chart yang bandingin empat plot teratas di empat metrik: kanopi, vigor, jumlah pohon, sama luas. Tiap sumbu mewakili satu metrik, bentuk yang makin lebar berarti performanya makin bagus secara keseluruhan."
            data={radar}
            angleKey="metric"
            series={PLOTS.slice(0, 4).map((p, i) => ({ key: p.id, stroke: colors[i] }))}
          />
        </div>
        <div className="aap-span-6">
          <ChartCard
            title="Plot summary cards"
            desc="Kartu ringkasan cepet buat tiap plot. Cocok buat tampilan pas briefing atau review kilat."
          >
            <div className="aap-tiles-row">
              {PLOTS.slice(0, 4).map((p) => (
                <div key={p.id} className="aap-tile">
                  <div className="aap-mono">{p.id}</div>
                  <div className="aap-muted">{p.name}</div>
                  <div className="aap-flex" style={{ marginTop: 6 }}>
                    <Tag minimal>{p.area_ha} ha</Tag>
                    <Tag minimal intent="success">{p.canopy_pct}% canopy</Tag>
                    <Tag minimal>{p.trees} trees</Tag>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </>
  );
}
