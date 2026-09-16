import { createFileRoute } from "@tanstack/react-router";
import { KpiCard, DataTable } from "@/components/kit";
import { BarChartCard, PieChartCard } from "@/components/charts";
import { FLIGHT_SESSIONS, PLUGINS } from "@/data/mock";

export const Route = createFileRoute("/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const totalImages = FLIGHT_SESSIONS.reduce((a, s) => a + s.images, 0);
  const avgAlt = Math.round(FLIGHT_SESSIONS.reduce((a, s) => a + s.altitude_m, 0) / FLIGHT_SESSIONS.length);
  const avgOverlap = Math.round(FLIGHT_SESSIONS.reduce((a, s) => a + s.overlap, 0) / FLIGHT_SESSIONS.length);
  const avgGSD = (FLIGHT_SESSIONS.reduce((a, s) => a + s.gsd_cm, 0) / FLIGHT_SESSIONS.length).toFixed(2);

  const perSite = Object.values(
    FLIGHT_SESSIONS.reduce((acc, s) => {
      acc[s.site] = acc[s.site] || { name: s.site, images: 0, area: 0 };
      acc[s.site].images += s.images;
      acc[s.site].area += s.area_ha;
      return acc;
    }, {}),
  );

  const pluginUse = PLUGINS.slice(0, 6).map((p, i) => ({
    name: p.name.split(" ")[0],
    value: 10 + i * 4 + (p.enabled ? 6 : 0),
    color: ["#2d72d2", "#1c6e42", "#c87619", "#7961db", "#cd4246", "#5f6b7c"][i % 6],
  }));

  const rows = FLIGHT_SESSIONS.slice(0, 10).map((s) => ({
    id: s.id, date: s.date, site: s.site, pilot: s.pilot,
    alt: `${s.altitude_m} m`, overlap: `${s.overlap}%`, gsd: `${s.gsd_cm} cm`,
  }));

  return (
    <>
      <div className="aap-section-title">
        <div>
          <h2>Project Analytics</h2>
          <p className="aap-muted">Metrik pengambilalihan imejan dan penggunaan plugin</p>
        </div>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3">
          <KpiCard label="Total images" value={totalImages}
            desc="Jumlah keseluruhan imej merentas semua sesi. Menjadi asas kepada beban pemprosesan yang diperlukan." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Avg altitude" value={avgAlt} unit="m"
            desc="Purata ketinggian penerbangan drone. Mempengaruhi resolusi spatial (GSD) dan liputan setiap imej." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Avg overlap" value={avgOverlap} unit="%"
            desc="Purata pertindihan antara imej. Overlap tinggi diperlukan untuk menghasilkan orthomosaic yang baik." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Avg GSD" value={avgGSD} unit="cm"
            desc="Purata Ground Sample Distance — saiz sebenar satu piksel di atas tanah. Semakin kecil, semakin terperinci analitik." />
        </div>

        <div className="aap-span-8">
          <BarChartCard
            title="Images & area per site"
            desc="Carta bar berkembar ini membandingkan bilangan imej dan keluasan mengikut tapak. Digunakan untuk mengenal pasti tapak yang paling banyak diliputi dan merancang lawatan susulan."
            data={perSite}
            bars={[
              { key: "images", fill: "#2d72d2", name: "Images" },
              { key: "area", fill: "#1c6e42", name: "Area (ha)" },
            ]}
            showLegend
            height={280}
          />
        </div>
        <div className="aap-span-4">
          <PieChartCard
            title="Plugin usage"
            desc="Pecahan penggunaan plugin dalam projek ini. Membantu mengenal pasti plugin yang paling kerap digunakan dan yang mungkin boleh dinyahaktifkan."
            data={pluginUse}
          />
        </div>

        <div className="aap-span-12">
          <div className="aap-card">
            <div className="aap-card-head"><h3 className="aap-card-title">Session table</h3></div>
            <DataTable
              desc="Jadual ini menyenaraikan semua sesi bersama juruterbang, ketinggian, overlap dan GSD. Digunakan untuk audit teknikal dan pemilihan sesi untuk pemprosesan semula."
              columns={[
                { key: "id", label: "Session" },
                { key: "date", label: "Date" },
                { key: "site", label: "Site" },
                { key: "pilot", label: "Pilot" },
                { key: "alt", label: "Altitude", numeric: true },
                { key: "overlap", label: "Overlap", numeric: true },
                { key: "gsd", label: "GSD", numeric: true },
              ]}
              rows={rows}
            />
          </div>
        </div>
      </div>
    </>
  );
}
