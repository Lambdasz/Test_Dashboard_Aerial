import { createFileRoute } from "@tanstack/react-router";
import { KpiCard, DataTable } from "@/components/kit";
import { BarChartCard, LineChartCard, PieChartCard } from "@/components/charts";
import { FLIGHT_SESSIONS, IMAGES, PLOTS, PLUGINS, OBSERVATION_DATES } from "@/data/mock";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const totalImages = IMAGES.length;
  const totalArea = Math.round(FLIGHT_SESSIONS.reduce((a, s) => a + s.area_ha, 0));
  const avgVeg = Math.round(PLOTS.reduce((a, p) => a + p.veg_pct, 0) / PLOTS.length);
  const totalTrees = PLOTS.reduce((a, p) => a + p.trees, 0);

  const perSession = FLIGHT_SESSIONS.slice(0, 10).map((s) => ({ name: s.id, images: s.images }));
  const timeline = OBSERVATION_DATES.map((d) => ({
    date: d.slice(5),
    images: FLIGHT_SESSIONS.filter((s) => s.date === d).reduce((a, s) => a + s.images, 0),
  }));
  const quality = [
    { name: "Good", value: 72, color: "#1c6e42" },
    { name: "Fair", value: 20, color: "#c87619" },
    { name: "Poor", value: 8, color: "#cd4246" },
  ];
  const summaryRows = FLIGHT_SESSIONS.slice(0, 8).map((s) => ({
    id: s.id, date: s.date, site: s.site,
    images: s.images, area: `${s.area_ha} ha`,
    quality: `${Math.round((s.quality.good / s.images) * 100)}%`,
  }));

  return (
    <>
      <div className="aap-section-title">
        <div>
          <h2>Dashboard</h2>
          <p className="aap-muted">Project overview across imagery, plugins and analytics</p>
        </div>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3"><KpiCard label="Images" value={totalImages} /></div>
        <div className="aap-span-3"><KpiCard label="Flight sessions" value={FLIGHT_SESSIONS.length} /></div>
        <div className="aap-span-3"><KpiCard label="Area covered" value={totalArea} unit="ha" /></div>
        <div className="aap-span-3"><KpiCard label="Plugins" value={PLUGINS.filter((p) => p.enabled).length} unit={`of ${PLUGINS.length}`} /></div>
        <div className="aap-span-3"><KpiCard label="Avg vegetation" value={avgVeg} unit="%" /></div>
        <div className="aap-span-3"><KpiCard label="Trees detected" value={totalTrees} /></div>
        <div className="aap-span-3"><KpiCard label="Plots" value={PLOTS.length} /></div>
        <div className="aap-span-3"><KpiCard label="Observations" value={OBSERVATION_DATES.length} /></div>

        <div className="aap-span-8">
          <BarChartCard
            title="Images per flight session"
            data={perSession}
            xKey="name"
            bars={[{ key: "images", fill: "#2d72d2" }]}
          />
        </div>
        <div className="aap-span-4">
          <PieChartCard title="Image quality" data={quality} />
        </div>

        <div className="aap-span-12">
          <LineChartCard
            title="Acquisition timeline"
            data={timeline}
            lines={[{ key: "images", stroke: "#1c6e42" }]}
            showDots
            height={220}
          />
        </div>

        <div className="aap-span-12">
          <div className="aap-card">
            <div className="aap-card-head">
              <h3 className="aap-card-title">Dataset summary</h3>
            </div>
            <DataTable
              columns={[
                { key: "id", label: "Session" },
                { key: "date", label: "Date" },
                { key: "site", label: "Site" },
                { key: "images", label: "Images", numeric: true },
                { key: "area", label: "Area", numeric: true },
                { key: "quality", label: "Good %", numeric: true },
              ]}
              rows={summaryRows}
            />
          </div>
        </div>
      </div>
    </>
  );
}
