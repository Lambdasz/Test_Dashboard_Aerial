import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RangeSlider } from "@blueprintjs/core";
import { ChartCard, BeforeAfter, Matrix, KpiCard } from "@/components/kit";
import { LineChartCard, BarChartCard, HeatmapGrid } from "@/components/charts/index.js";
import { OBSERVATION_DATES, LAND_CLASSES, FLIGHT_SESSIONS } from "@/data/mock";

export const Route = createFileRoute("/temporal")({ component: TemporalPage });

function TemporalPage() {
  const [range, setRange] = useState([0, OBSERVATION_DATES.length - 1]);
  const dates = OBSERVATION_DATES.slice(range[0], range[1] + 1);

  const series = dates.map((d, i) => ({
    date: d.slice(5),
    coverage: Math.round((62 + i * 3.1 + (i % 2) * 2) * 10) / 10,
  }));
  const deltas = dates.slice(1).map((d, i) => ({
    date: d.slice(5),
    delta: Math.round((FLIGHT_SESSIONS[i + 1]?.trees ?? 600) - (FLIGHT_SESSIONS[i]?.trees ?? 550)),
  }));

  const classes = LAND_CLASSES.slice(0, 4);
  const matrix = useMemo(
    () => classes.map((_, r) => classes.map((__, c) => (r === c ? 70 + r * 4 : Math.max(0, 14 - Math.abs(r - c) * 4)))),
    [],
  );
  const heat = Array.from({ length: 24 }, (_, i) => Math.round(Math.abs(Math.sin(i / 3)) * 100));

  return (
    <>
      <div className="aap-section-title">
        <div>
          <h2>Temporal Change</h2>
          <p className="aap-muted">{dates[0]} - {dates[dates.length - 1]}</p>
        </div>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3">
          <KpiCard label="Observations" value={dates.length}
            desc="Jumlah tanggal pengamatan di rentang waktu yang dipilih." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Coverage change" value="+12.4" unit="%"
            desc="Perubahan persen tutupan vegetasi antara tanggal awal sama tanggal akhir. Kalau nilainya positif, berarti lagi terjadi penghijauan." />
        </div>
        <div className="aap-span-6">
          <ChartCard
            title="Date range"
            desc="Slider buat milih rentang tanggal analisis. Semua widget di bawahnya bakal update otomatis ngikutin rentang ini."
          >
            <RangeSlider
              min={0} max={OBSERVATION_DATES.length - 1} stepSize={1}
              labelRenderer={(i) => OBSERVATION_DATES[i].slice(5)}
              value={range} onChange={setRange}
            />
          </ChartCard>
        </div>

        <div className="aap-span-7">
          <ChartCard
            title="Swipe comparison"
            subtitle={`${dates[0]} vs ${dates[dates.length - 1]}`}
            desc="Pembanding side-by-side antara dua tanggal. Dipake buat verifikasi perubahannya secara visual sebelum masuk ke analisis kuantitatif."
          >
            <BeforeAfter
              height={300}
              before={<div className="aap-fake-rgb" />}
              after={<div className="aap-fake-rgb" style={{ filter: "hue-rotate(25deg) saturate(1.3)" }} />}
              leftLabel={dates[0]} rightLabel={dates[dates.length - 1]}
            />
          </ChartCard>
        </div>
        <div className="aap-span-5">
          <LineChartCard
            title="Coverage trend"
            desc="Tren persen tutupan vegetasi sepanjang rentang waktu. Kalau naik berarti lagi pulih, kalau turun berarti lagi degradasi."
            data={series} lines={[{ key: "coverage", stroke: "#1c6e42" }]} height={280}
          />
        </div>

        <div className="aap-span-6">
          <ChartCard
            title="Transition matrix"
            subtitle="% dari kelas sumber"
            desc="Matriks transisi antar kelas tutupan lahan. Contohnya, berapa persen kelas 'vegetasi' yang berubah jadi 'tanah' antara dua tanggal. Ini keren banget buat analisis degradasi lahan."
          >
            <Matrix rows={classes.map((c) => c.label)} columns={classes.map((c) => c.label)} values={matrix} />
          </ChartCard>
        </div>
        <div className="aap-span-6">
          <BarChartCard
            title="Tree-count delta"
            desc="Perubahan jumlah pohon antar tanggal berurutan. Nilai positif berarti nambah pohonnya, nilai negatif berarti ada pohon yang hilang."
            data={deltas} xKey="date"
            bars={[{ key: "delta", fill: "#2d72d2" }]}
            height={220}
          />
        </div>

        <div className="aap-span-12">
          <HeatmapGrid
            title="Change magnitude grid"
            desc="Grid sel yang nunjukin besarnya perubahan per lokasi. Warna merah yang makin pekat berarti perubahannya makin gede. Dipake buat nandain titik-titik panas perubahannya."
            values={heat} columns={12}
          />
        </div>
      </div>
    </>
  );
}
