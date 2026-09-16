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
          <p className="aap-muted">Klasifikasi tematik merentas {PLOTS.length} plot</p>
        </div>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3">
          <KpiCard label="Classes" value={LAND_CLASSES.length}
            desc="Bilangan kelas litupan tanah yang digunakan (kanopi, rumput, tanah, air, binaan, bayang)." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Classified area" value={338} unit="ha"
            desc="Jumlah keluasan yang telah diklasifikasikan oleh plugin. Berbeza daripada kawasan liputan terbang." />
        </div>
        <div className="aap-span-6">
          <ChartCard
            title="Custom classes"
            desc="Kotak input untuk menambah kelas tersuai mengikut keperluan projek (contoh: 'orchard', 'windbreak'). Kelas tersuai ini boleh digunakan untuk latihan semula model."
          >
            <TagInput values={classes} onChange={setClasses} placeholder="Tambah kelas…" />
          </ChartCard>
        </div>

        <div className="aap-span-4">
          <ChartCard
            title="Class distribution"
            desc="Pecahan setiap kelas litupan tanah. Membantu merancang keutamaan analitik: kelas mana yang dominan dalam kawasan kajian."
          >
            <PieChartCard title="" data={donut} height={250} />
            <Legend items={LAND_CLASSES.map((c) => ({ color: c.color, label: c.label }))} />
          </ChartCard>
        </div>
        <div className="aap-span-8">
          <BarChartCard
            title="Area per class"
            desc="Keluasan setiap kelas litupan tanah dalam hektar. Digunakan untuk pengiraan karbon, cukai tanah, atau perancangan guna tanah."
            data={areas} xKey="name"
            bars={[{ key: "ha", fill: "#2d72d2" }]}
            colorByCell height={250}
          />
        </div>

        <div className="aap-span-6">
          <StackedBarChartCard
            title="Composition per plot"
            subtitle="Bertindan 100%"
            desc="Komposisi kelas litupan tanah bagi setiap plot dalam bentuk peratus. Sesuai untuk perbandingan pantas antara plot tanpa terjejas oleh saiz plot."
            data={stacked} xKey="name" expand height={280}
            stacks={[
              { key: "veg", fill: "#1c6e42", name: "Vegetation" },
              { key: "soil", fill: "#946638", name: "Soil" },
              { key: "water", fill: "#2d72d2", name: "Water" },
              { key: "built", fill: "#7961db", name: "Built" },
            ]}
          />
        </div>
        <div className="aap-span-6">
          <ChartCard
            title="Thematic map"
            subtitle="Plot diwarnakan mengikut kelas dominan"
            desc="Peta tematik yang menunjukkan kelas litupan tanah dominan bagi setiap plot. Digunakan untuk pembentangan visual kepada pemegang taruh dan pengesahan spatial."
          >
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
