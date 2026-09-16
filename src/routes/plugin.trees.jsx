import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button, RangeSlider, Tag } from "@blueprintjs/core";
import { KpiCard, ChartCard, Thumb, ReviewRow, Legend } from "@/components/kit";
import { HistogramCard, BarChartCard } from "@/components/charts/index.js";
import MapView from "@/components/map/MapView.jsx";
import { TREE_DETECTIONS, PLOTS, MAP_CENTER } from "@/data/mock";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/plugin/trees")({ component: TreesPage });

const conf = (c) => (c >= 0.8 ? "#1c6e42" : c >= 0.6 ? "#c87619" : "#cd4246");

function TreesPage() {
  const { toast } = useApp();
  const [range, setRange] = useState([0.5, 1]);

  const visible = TREE_DETECTIONS.filter((t) => t.confidence >= range[0] && t.confidence <= range[1]);

  const hist = useMemo(() => {
    const bins = Array.from({ length: 10 }, (_, i) => ({ bin: (i / 10).toFixed(1), count: 0 }));
    TREE_DETECTIONS.forEach((t) => { bins[Math.min(9, Math.floor(t.confidence * 10))].count += 1; });
    return bins;
  }, []);

  const perPlot = PLOTS.map((p) => ({ name: p.id.replace("PLOT-", "P"), trees: p.trees }));

  return (
    <>
      <div className="aap-section-title">
        <div>
          <h2>Tree Detection & Counting</h2>
          <p className="aap-muted">Deteksi tajuk pohon dengan filter keyakinan dan review manual</p>
        </div>
        <Tag minimal>{visible.length} ditampilin</Tag>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3">
          <KpiCard label="Detections" value={TREE_DETECTIONS.length}
            desc="Total deteksi tajuk pohon yang dilakuin plugin. Tiap deteksi nyumbang ke hitungan pohon akhirnya." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Mean confidence" value={0.71}
            desc="Rata-rata keyakinan model terhadap deteksinya. Kalau nilainya rendah, berarti perlu dicek manual." />
        </div>
        <div className="aap-span-6">
          <ChartCard
            title="Confidence range"
            desc="Filter rentang keyakinan. User bisa nyempitin rentangnya biar cuma liat deteksi kualitas tinggi sebelum hitungan akhir dibikin."
          >
            <RangeSlider min={0} max={1} stepSize={0.05} labelStepSize={0.25} value={range} onChange={setRange} />
            <Legend items={[
              { color: "#1c6e42", label: "High >= 0.80" },
              { color: "#c87619", label: "Medium >= 0.60" },
              { color: "#cd4246", label: "Low < 0.60" },
            ]} />
          </ChartCard>
        </div>

        <div className="aap-span-6">
          <HistogramCard
            title="Confidence histogram"
            desc="Distribusi keyakinan deteksi. Kalau banyak yang di bawah 0.5, berarti modelnya mungkin perlu dilatih ulang."
            data={hist} xKey="bin" yKey="count"
          />
        </div>
        <div className="aap-span-6">
          <ChartCard
            title="Detections map"
            desc="Peta lokasi deteksi pohon. Warna titiknya nunjukin tingkat keyakinan. Dipake buat nandain kluster atau area yang bermasalah."
          >
            <MapView
              center={MAP_CENTER} zoom={14} height={250}
              markers={visible.map((t) => ({
                id: t.id, lat: t.lat, lng: t.lng,
                color: conf(t.confidence), label: t.id,
                detail: `conf ${t.confidence}\ncrown ${t.crown_m} m`,
              }))}
            />
          </ChartCard>
        </div>

        <div className="aap-span-6">
          <ChartCard
            title="Review queue"
            desc="Daftar review manual. Tiap deteksi bisa diterima atau ditolak. Penting banget buat quality control sebelum angka pohonnya diumumin."
          >
            {visible.slice(0, 8).map((t) => (
              <ReviewRow key={t.id}>
                <Thumb />
                <div>
                  <div className="aap-mono">{t.id}</div>
                  <div className="aap-muted">{t.plot} · h {t.height_m} m · conf {t.confidence}</div>
                </div>
                <div className="aap-flex" style={{ marginLeft: "auto" }}>
                  <Button small intent="success" icon="tick" onClick={() => toast(`${t.id} diterima`, "success")} />
                  <Button small intent="danger" icon="cross" onClick={() => toast(`${t.id} ditolak`, "warning")} />
                </div>
              </ReviewRow>
            ))}
          </ChartCard>
        </div>
        <div className="aap-span-6">
          <BarChartCard
            title="Trees per plot"
            desc="Jumlah pohon yang kedeteksi per plot. Dipake buat bandingin kepadatan pohon antar plot, sekalian nandain plot yang butuh review lanjutan."
            data={perPlot} xKey="name"
            bars={[{ key: "trees", fill: "#1c6e42" }]}
            height={260}
          />
        </div>
      </div>
    </>
  );
}
