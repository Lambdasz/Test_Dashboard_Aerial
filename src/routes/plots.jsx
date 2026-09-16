import { createFileRoute } from "@tanstack/react-router";
import { Tag } from "@blueprintjs/core";
import { KpiCard, ChartCard, DataTable } from "@/components/kit";
import { RadarChartCard } from "@/components/charts";
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
          <p className="aap-muted">Geometri, komposisi dan kedudukan {PLOTS.length} plot terurus</p>
        </div>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3"><KpiCard label="Total area" value={area} unit="ha"
          desc="Jumlah keluasan semua plot. Asas kepada pengiraan hasil dan perancangan operasi." /></div>
        <div className="aap-span-3"><KpiCard label="Total perimeter" value={perim} unit="m"
          desc="Jumlah perimeter semua plot. Berguna untuk merancang keperluan pagar atau pemantauan sempadan." /></div>
        <div className="aap-span-3"><KpiCard label="Plots" value={PLOTS.length}
          desc="Bilangan plot terurus dalam projek." /></div>
        <div className="aap-span-3"><KpiCard label="Trees" value={PLOTS.reduce((a, p) => a + p.trees, 0)}
          desc="Jumlah pokok merentas semua plot. Diperoleh daripada plugin Tree Detection." /></div>

        <div className="aap-span-8">
          <div className="aap-card">
            <div className="aap-card-head"><h3 className="aap-card-title">Plot register</h3></div>
            <DataTable
              desc="Daftar lengkap semua plot: nama, jenis tanaman, keluasan, perimeter, pokok dan peratus kanopi. Rujukan utama untuk pengurusan plot."
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
            desc="Kedudukan plot mengikut peratus vegetasi. Membantu mengenal pasti plot terbaik dan plot yang memerlukan intervensi."
          >
            <div className="aap-list-scroll">
              {ranked.map((p, i) => (
                <div key={p.id} className={`aap-list-item ${i === 0 ? "is-active" : ""}`}>
                  <span className="aap-mono">{i + 1}. {p.id}</span> — {p.name}
                  <span className="aap-muted"> {p.veg_pct}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="aap-span-6">
          <RadarChartCard
            title="Multi-plot profile"
            subtitle="Dinormalkan 0–100"
            desc="Carta radar yang membandingkan empat plot teratas merentas empat metrik: kanopi, vigor, bilangan pokok dan keluasan. Setiap paksi mewakili satu metrik; bentuk yang lebih luas menandakan prestasi keseluruhan yang lebih baik."
            data={radar}
            angleKey="metric"
            series={PLOTS.slice(0, 4).map((p, i) => ({ key: p.id, stroke: colors[i] }))}
          />
        </div>
        <div className="aap-span-6">
          <ChartCard
            title="Plot summary cards"
            desc="Kad ringkasan pantas untuk setiap plot. Sesuai untuk paparan taklimat dan semakan pantas."
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
