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
          <p className="aap-muted">Ringkasan umum projek: imejan, plugin dan analitik</p>
        </div>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3">
          <KpiCard label="Images" value={totalImages}
            desc="Jumlah keseluruhan imejan RGB yang telah diimport ke dalam projek ini. Nilai ini menjadi asas kepada semua analitik." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Flight sessions" value={FLIGHT_SESSIONS.length}
            desc="Bilangan sesi penerbangan drone. Setiap sesi mewakili satu misi pengumpulan imejan pada tarikh dan lokasi tertentu." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Area covered" value={totalArea} unit="ha"
            desc="Jumlah keluasan tanah yang diliputi oleh semua sesi penerbangan, dalam hektar. Berguna untuk menganggarkan skop liputan projek." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Plugins" value={PLUGINS.filter((p) => p.enabled).length} unit={`of ${PLUGINS.length}`}
            desc="Bilangan plugin analitik yang aktif berbanding jumlah yang dipasang. Plugin yang tidak aktif tidak akan menyumbang kepada hasil analitik." />
        </div>

        <div className="aap-span-3">
          <KpiCard label="Avg vegetation" value={avgVeg} unit="%"
            desc="Purata peratus litupan vegetasi merentas semua plot. Diperoleh daripada plugin RGB Vegetation Detection." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Trees detected" value={totalTrees}
            desc="Jumlah pokok yang dikesan oleh plugin Tree Detection & Counting merentas semua plot." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Plots" value={PLOTS.length}
            desc="Bilangan plot (petak kajian) yang ditakrifkan dalam projek. Setiap plot menjadi unit analisis untuk perbandingan." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Observations" value={OBSERVATION_DATES.length}
            desc="Bilangan tarikh pemerhatian yang tersedia. Semakin banyak tarikh, semakin kaya analisis perubahan temporal." />
        </div>

        <div className="aap-span-8">
          <BarChartCard
            title="Images per flight session"
            desc="Carta bar ini menunjukkan bilangan imej yang diambil dalam setiap sesi penerbangan. Digunakan untuk mengenal pasti sesi yang produktif atau sesi yang mungkin gagal (imej terlalu sedikit), serta untuk merancang keperluan storan dan pemprosesan."
            data={perSession}
            xKey="name"
            bars={[{ key: "images", fill: "#2d72d2" }]}
          />
        </div>
        <div className="aap-span-4">
          <PieChartCard
            title="Image quality"
            desc="Carta pai ini memaparkan pecahan kualiti imej: Good (baik), Fair (sederhana) dan Poor (buruk). Membantu pengguna memutuskan sama ada perlu menapis atau mengambil semula imej sebelum analitik dijalankan."
            data={quality}
          />
        </div>

        <div className="aap-span-12">
          <LineChartCard
            title="Acquisition timeline"
            desc="Carta garis ini menunjukkan jumlah imejan mengikut tarikh pemerhatian. Digunakan untuk memantau kesinambungan pengumpulan data sepanjang musim dan mengesan jurang (gap) dalam siri temporal."
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
              desc="Jadual ringkasan ini menyenaraikan setiap sesi penerbangan bersama bilangan imej, keluasan dan peratus kualiti. Digunakan sebagai rujukan pantas apabila memilih sesi untuk analitik lanjutan."
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
