import { createFileRoute } from "@tanstack/react-router";
import { KpiCard, DataTable } from "@/components/kit";
import { BarChartCard, LineChartCard, PieChartCard } from "@/components/charts/index.js";
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
          <p className="aap-muted">Ringkasan gede buat seluruh proyek: imej, plugin, sama hasil analitik</p>
        </div>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3">
          <KpiCard label="Images" value={totalImages}
            desc="Total semua imej RGB yang udah masuk ke proyek ini. Angka ini jadi pondasi buat semua analitik yang bakal jalan." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Flight sessions" value={FLIGHT_SESSIONS.length}
            desc="Berapa banyak sesi terbang drone yang udah dilakuin. Tiap sesi itu satu misi pengambilan imej di tanggal dan lokasi tertentu." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Area covered" value={totalArea} unit="ha"
            desc="Total luas tanah yang kecover semua sesi terbang, dalam hektar. Berguna buat ngira-ngira seberapa gede cakupan proyeknya." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Plugins" value={PLUGINS.filter((p) => p.enabled).length} unit={`of ${PLUGINS.length}`}
            desc="Jumlah plugin analitik yang aktif versus total yang kepasang. Plugin yang lagi mati nggak bakal nyumbang hasil ke dashboard." />
        </div>

        <div className="aap-span-3">
          <KpiCard label="Avg vegetation" value={avgVeg} unit="%"
            desc="Rata-rata persen tutupan vegetasi di semua plot. Didapat dari plugin RGB Vegetation Detection." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Trees detected" value={totalTrees}
            desc="Total pohon yang kedeteksi plugin Tree Detection & Counting di semua plot." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Plots" value={PLOTS.length}
            desc="Jumlah plot (petak kajian) yang didefinisiin di proyek ini. Tiap plot nanti jadi unit buat perbandingan antar wilayah." />
        </div>
        <div className="aap-span-3">
          <KpiCard label="Observations" value={OBSERVATION_DATES.length}
            desc="Berapa banyak tanggal pengamatan yang tersedia. Makin banyak tanggal, makin kaya analisis perubahan waktunya." />
        </div>

        <div className="aap-span-8">
          <BarChartCard
            title="Images per flight session"
            desc="Bar chart ini nunjukin berapa imej yang diambil di tiap sesi terbang. Dipake buat nandain sesi yang produktif atau sesi yang mungkin gagal (imejnya dikit banget), sekalian buat ngira-ngira kebutuhan penyimpanan dan pemrosesan."
            data={perSession}
            xKey="name"
            bars={[{ key: "images", fill: "#2d72d2" }]}
          />
        </div>
        <div className="aap-span-4">
          <PieChartCard
            title="Image quality"
            desc="Pie chart ini nampilin pembagian kualitas imej: Good (bagus), Fair (lumayan), Poor (jelek). Bantu user buat mutusin perlu nggak nyaring atau ambil ulang imej sebelum analitik dijalanin."
            data={quality}
          />
        </div>

        <div className="aap-span-12">
          <LineChartCard
            title="Acquisition timeline"
            desc="Line chart ini nunjukin jumlah imej per tanggal pengamatan. Dipake buat mantau kelangsungan pengumpulan data sepanjang musim dan ngeh deteksi kalau ada lubang (gap) di seri waktunya."
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
              desc="Tabel ringkasan ini nge-list tiap sesi terbang bareng jumlah imej, luas, sama persen kualitasnya. Kepake buat rujukan cepet pas mau milih sesi buat analitik lanjutan."
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
