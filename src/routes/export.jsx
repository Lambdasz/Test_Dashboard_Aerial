import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Checkbox, Dialog, DialogBody, DialogFooter, HTMLSelect, Tag } from "@blueprintjs/core";
import { ChartCard } from "@/components/kit";
import { PLOTS, FLIGHT_SESSIONS } from "@/data/mock";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/export")({ component: ExportPage });

const FORMATS = [
  { key: "GeoJSON", desc: "Vektor plot, AOI, sama deteksi", icon: "polygon-filter" },
  { key: "CSV", desc: "Metrik tabel per plot sama sesi", icon: "th" },
  { key: "PDF", desc: "Laporan analitik siap pakai", icon: "document" },
  { key: "PNG", desc: "Snapshot peta sama chart", icon: "media" },
];

function ExportPage() {
  const { project, toast } = useApp();
  const [format, setFormat] = useState("GeoJSON");
  const [scope, setScope] = useState("project");
  const [target, setTarget] = useState(PLOTS[0].id);
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState(true);
  const [compress, setCompress] = useState(false);

  const targets = scope === "plot" ? PLOTS.map((p) => p.id) : FLIGHT_SESSIONS.map((s) => s.id);

  return (
    <>
      <div className="aap-section-title">
        <div>
          <h2>Export</h2>
          <p className="aap-muted">Bungkus output {project.name} buat diunduh</p>
        </div>
        <Tag minimal>{format} · {scope}</Tag>
      </div>

      <div className="aap-grid">
        {FORMATS.map((f) => (
          <div className="aap-span-3" key={f.key}>
            <div className="aap-card" onClick={() => setFormat(f.key)} style={{ cursor: "pointer" }}>
              <div className="aap-card-head">
                <div>
                  <h3 className="aap-card-title">{f.key}</h3>
                  <p className="aap-card-sub">{f.desc}</p>
                </div>
                {format === f.key ? <Tag intent="primary" minimal>Dipilih</Tag> : null}
              </div>
              <Button small icon={f.icon} onClick={() => { setFormat(f.key); setOpen(true); }}>Konfigurasi</Button>
              <p className="aap-desc">
                {f.key === "GeoJSON" && "Format vektor buat GIS. Isinya batas plot, AOI, sama titik deteksi pohonnya."}
                {f.key === "CSV" && "File tabel buat analisis statistik lanjutan di Excel atau Python/pandas."}
                {f.key === "PDF" && "Laporan siap cetak yang gabungin chart, peta, sama ringkasan analitiknya."}
                {f.key === "PNG" && "Snapshot gambar peta atau chart buat dimasukin ke presentasi."}
              </p>
            </div>
          </div>
        ))}

        <div className="aap-span-6">
          <ChartCard
            title="Scope"
            desc="Pemilih scope ekspor: seluruh proyek, satu plot, atau satu sesi terbang. Pilih scope yang lebih kecil biar ekspornya lebih cepet."
          >
            <div className="aap-flex">
              <HTMLSelect
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                options={[
                  { label: "Seluruh proyek", value: "project" },
                  { label: "Satu plot", value: "plot" },
                  { label: "Sesi terbang", value: "session" },
                ]}
              />
              {scope !== "project" ? (
                <HTMLSelect value={target} onChange={(e) => setTarget(e.target.value)} options={targets} />
              ) : (
                <span className="aap-muted">{PLOTS.length} plot · {FLIGHT_SESSIONS.length} sesi</span>
              )}
            </div>
          </ChartCard>
        </div>
        <div className="aap-span-6">
          <ChartCard
            title="Queue"
            desc="Antrian ekspor. Kalau nggak ada tugas, user bisa mulai ekspor baru."
          >
            <p className="aap-muted">Belum ada tugas ekspor yang ngantri.</p>
            <Button intent="primary" icon="export" onClick={() => setOpen(true)}>Mulai ekspor</Button>
          </ChartCard>
        </div>
      </div>

      <Dialog isOpen={open} onClose={() => setOpen(false)} title={`Ekspor sebagai ${format}`}>
        <DialogBody>
          <p className="aap-muted">Scope: {scope === "project" ? project.name : target}</p>
          <Checkbox label="Sertakan sidecar metadata" checked={meta} onChange={() => setMeta(!meta)} />
          <Checkbox label="Kompres outputnya (.zip)" checked={compress} onChange={() => setCompress(!compress)} />
        </DialogBody>
        <DialogFooter actions={
          <>
            <Button onClick={() => setOpen(false)}>Batal</Button>
            <Button intent="primary" icon="download" onClick={() => { setOpen(false); toast("Ekspor masuk antrian", "success"); }}>Unduh</Button>
          </>
        } />
      </Dialog>
    </>
  );
}
