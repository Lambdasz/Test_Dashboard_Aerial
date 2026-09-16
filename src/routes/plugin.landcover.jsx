import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TagInput } from "@blueprintjs/core";
import { ChartCard, Legend, KpiCard } from "@/components/kit";
import { PieChartCard, BarChartCard, StackedBarChartCard } from "@/components/charts/index.js";
import MapView from "@/components/map/MapView.jsx";
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
          <p className="aap-muted">Klasifikasi tematik di {PLOTS.length} plot</p>
        </div>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3">
          <KpiCard label="Classes" value={LAND_CLASSES.length}
            desc="Jumlah kelas tutupan lahan yang dipake (kanopi, rumput, tanah, air, bangunan, bayangan)." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Classified area" value={338} unit="ha"
            desc="Total luas area yang udah diklasifikasiin plugin. Beda sama luas cakupan terbangnya ya." />
        </div>
        <div className="aap-span-6">
          <ChartCard
            title="Custom classes"
            desc="Kotak input buat nambah kelas custom sesuai kebutuhan proyek (contohnya 'orchard', 'windbreak'). Kelas custom ini bisa dipake buat retrain modelnya."
          >
            <TagInput values={classes} onChange={setClasses} placeholder="Tambah kelas..." />
          </ChartCard>
        </div>

        <div className="aap-span-4">
          <ChartCard
            title="Class distribution"
            desc="Pembagian tiap kelas tutupan lahan. Bantu ngerencanain prioritas analitik: kelas mana sih yang dominan di area kajiannya."
          >
            <PieChartCard title="" data={donut} height={250} />
            <Legend items={LAND_CLASSES.map((c) => ({ color: c.color, label: c.label }))} />
          </ChartCard>
        </div>
        <div className="aap-span-8">
          <BarChartCard
            title="Area per class"
            desc="Luas tiap kelas tutupan lahan dalam hektar. Kepake buat hitung karbon, pajak tanah, atau perencanaan tata guna lahan."
            data={areas} xKey="name"
            bars={[{ key: "ha", fill: "#2d72d2" }]}
            colorByCell height={250}
          />
        </div>

        <div className="aap-span-6">
          <StackedBarChartCard
            title="Composition per plot"
            subtitle="Stacked 100%"
            desc="Komposisi kelas tutupan lahan per plot dalam bentuk persen. Cocok buat perbandingan cepet antar plot tanpa keganggu sama ukuran plotnya."
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
            subtitle="Plot diwarnain sesuai kelas dominannya"
            desc="Peta tematik yang nunjukin kelas tutupan lahan dominan per plot. Dipake buat presentasi visual ke stakeholder sama verifikasi spasial."
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
