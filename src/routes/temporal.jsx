import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RangeSlider } from "@blueprintjs/core";
import { ChartCard, BeforeAfter, Matrix, KpiCard } from "@/components/kit";
import { LineChartCard, BarChartCard, HeatmapGrid } from "@/components/charts";
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
          <p className="aap-muted">{dates[0]} → {dates[dates.length - 1]}</p>
        </div>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3">
          <KpiCard label="Observations" value={dates.length}
            desc="Bilangan tarikh pemerhatian dalam julat masa yang dipilih." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Coverage change" value="+12.4" unit="%"
            desc="Perubahan peratus litupan vegetasi antara tarikh mula dan tarikh akhir. Nilai positif bermaksud berlaku penghijauan." />
        </div>
        <div className="aap-span-6">
          <ChartCard
            title="Date range"
            desc="Slider untuk memilih julat tarikh analisis. Semua widget di bawah akan mengemas kini secara automatik mengikut julat ini."
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
            desc="Pembanding sisi-ke-sisi antara dua tarikh. Digunakan untuk mengesahkan perubahan secara visual sebelum analisis kuantitatif."
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
            desc="Aliran peratus litupan vegetasi sepanjang julat masa. Corak menaik menandakan pemulihan; corak menurun menandakan kemerosotan."
            data={series} lines={[{ key: "coverage", stroke: "#1c6e42" }]} height={280}
          />
        </div>

        <div className="aap-span-6">
          <ChartCard
            title="Transition matrix"
            subtitle="% kelas sumber"
            desc="Matriks peralihan antara kelas litupan tanah. Contoh: berapa peratus kelas 'vegetasi' bertukar menjadi 'tanah' antara dua tarikh. Sangat berguna untuk analisis degradasi tanah."
          >
            <Matrix rows={classes.map((c) => c.label)} columns={classes.map((c) => c.label)} values={matrix} />
          </ChartCard>
        </div>
        <div className="aap-span-6">
          <BarChartCard
            title="Tree-count delta"
            desc="Perubahan bilangan pokok antara tarikh berturutan. Nilai positif bermaksud pertambahan pokok; nilai negatif bermaksud kehilangan pokok."
            data={deltas} xKey="date"
            bars={[{ key: "delta", fill: "#2d72d2" }]}
            height={220}
          />
        </div>

        <div className="aap-span-12">
          <HeatmapGrid
            title="Change magnitude grid"
            desc="Grid sel yang menunjukkan magnitud perubahan mengikut lokasi. Warna merah lebih pekat menandakan perubahan yang lebih besar. Digunakan untuk mengenal pasti titik panas perubahan."
            values={heat} columns={12}
          />
        </div>
      </div>
    </>
  );
}
