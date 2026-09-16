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
          <p className="aap-muted">Acquisition metrics and plugin usage</p>
        </div>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3"><KpiCard label="Total images" value={totalImages} /></div>
        <div className="aap-span-3"><KpiCard label="Avg altitude" value={avgAlt} unit="m" /></div>
        <div className="aap-span-3"><KpiCard label="Avg overlap" value={avgOverlap} unit="%" /></div>
        <div className="aap-span-3"><KpiCard label="Avg GSD" value={avgGSD} unit="cm" /></div>

        <div className="aap-span-8">
          <BarChartCard
            title="Images & area per site"
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
          <PieChartCard title="Plugin usage" data={pluginUse} />
        </div>

        <div className="aap-span-12">
          <div className="aap-card">
            <div className="aap-card-head"><h3 className="aap-card-title">Session table</h3></div>
            <DataTable
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
