import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button, SegmentedControl, Slider } from "@blueprintjs/core";
import { ChartCard, DataTable, Gauge, BeforeAfter, Legend, KpiCard } from "@/components/kit";
import { HistogramCard } from "@/components/charts";
import { PLOTS, LAND_CLASSES } from "@/data/mock";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/plugin/vegetation")({ component: VegetationPage });

function VegetationPage() {
  const { toast } = useApp();
  const [index, setIndex] = useState("ExG");
  const [threshold, setThreshold] = useState(0.35);

  const histogram = useMemo(
    () => Array.from({ length: 12 }, (_, i) => {
      const bin = i / 12;
      return { bin: bin.toFixed(2), pixels: Math.round(40000 * Math.exp(-Math.pow(bin - 0.45, 2) / 0.02)) + i * 120 };
    }),
    [],
  );

  const coverage = useMemo(() => {
    const total = histogram.reduce((a, b) => a + b.pixels, 0);
    const above = histogram.filter((h) => Number(h.bin) >= threshold).reduce((a, b) => a + b.pixels, 0);
    return Math.round((above / total) * 1000) / 10;
  }, [histogram, threshold]);

  const rows = PLOTS.map((p) => ({
    id: p.id, name: p.name,
    veg: `${p.veg_pct}%`, soil: `${p.soil_pct}%`,
    canopy: `${p.canopy_pct}%`, vigour: p.vigour,
  }));

  return (
    <>
      <div className="aap-section-title">
        <div>
          <h2>RGB Vegetation Detection</h2>
          <p className="aap-muted">{index} mask pada threshold {threshold.toFixed(2)}</p>
        </div>
        <Button icon="refresh" onClick={() => toast("Recomputed vegetation mask", "success")}>Recompute</Button>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3">
          <KpiCard label="Green coverage" value={coverage} unit="%"
            desc="Peratus litupan vegetasi yang dikesan pada threshold semasa. Nilai ini berubah secara langsung apabila pengguna melaraskan slider." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Mean index" value={0.318}
            desc="Purata nilai indeks vegetasi (contoh ExG) bagi seluruh imejan. Bacaan tinggi menandakan lebih banyak piksel hijau." />
        </div>
        <div className="aap-span-6">
          <ChartCard
            title="Index & threshold"
            desc="Panel kawalan untuk memilih indeks (ExG / ExR / VARI) dan melaraskan threshold pengesanan. Perubahan terus mempengaruhi topeng vegetasi dan metrik di bawah."
          >
            <div className="aap-stack">
              <SegmentedControl
                options={[{ label: "ExG", value: "ExG" }, { label: "ExR", value: "ExR" }, { label: "VARI", value: "VARI" }]}
                value={index} onValueChange={setIndex}
              />
              <Slider min={0} max={1} stepSize={0.01} labelStepSize={0.25} value={threshold} onChange={setThreshold} />
            </div>
          </ChartCard>
        </div>

        <div className="aap-span-8">
          <ChartCard
            title="RGB vs vegetation mask"
            subtitle="Tarik untuk bandingkan"
            desc="Pembanding sisi-ke-sisi antara imejan RGB asal dan topeng vegetasi yang dijana. Digunakan untuk pengesahan visual bahawa plugin mengesan vegetasi dengan tepat."
          >
            <BeforeAfter
              height={320}
              before={<div className="aap-fake-rgb" />}
              after={<div className="aap-fake-mask" />}
              leftLabel="RGB" rightLabel={`${index} mask`}
            />
          </ChartCard>
        </div>
        <div className="aap-span-4">
          <ChartCard
            title="Coverage gauge"
            desc="Tolok bulat yang memaparkan peratus litupan vegetasi secara pantas. Berguna semasa taklimat dengan pemegang taruh."
          >
            <Gauge value={coverage} max={100} unit="%" label="Vegetated area" />
            <Legend items={LAND_CLASSES.slice(0, 3).map((c) => ({ color: c.color, label: c.label }))} />
          </ChartCard>
        </div>

        <div className="aap-span-6">
          <HistogramCard
            title="Green-pixel histogram"
            desc="Taburan bilangan piksel hijau mengikut julat nilai indeks. Digunakan untuk memilih threshold optimum — puncak histogram menunjukkan nilai indeks yang dominan."
            data={histogram} xKey="bin" yKey="pixels" fill="#1c6e42"
          />
        </div>
        <div className="aap-span-6">
          <div className="aap-card">
            <div className="aap-card-head"><h3 className="aap-card-title">Mask statistics per plot</h3></div>
            <DataTable
              desc="Statistik topeng vegetasi bagi setiap plot: peratus vegetasi, tanah, kanopi dan vigor. Digunakan untuk perbandingan antara plot selepas pengesanan."
              columns={[
                { key: "id", label: "Plot" }, { key: "name", label: "Name" },
                { key: "veg", label: "Veg", numeric: true }, { key: "soil", label: "Soil", numeric: true },
                { key: "canopy", label: "Canopy", numeric: true }, { key: "vigour", label: "Vigour", numeric: true },
              ]}
              rows={rows}
            />
          </div>
        </div>
      </div>
    </>
  );
}
