import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Checkbox, Dialog, DialogBody, DialogFooter, HTMLSelect, InputGroup } from "@blueprintjs/core";
import { ChartCard } from "@/components/kit";
import { PLOTS, OBSERVATION_DATES } from "@/data/mock";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

const SECTIONS = ["Vegetation", "Trees", "Land Cover", "Plots", "Temporal"];

function ReportsPage() {
  const { project, toast } = useApp();
  const [title, setTitle] = useState("Laporan Kanopi Musiman");
  const [checked, setChecked] = useState(["Vegetation", "Trees", "Plots"]);
  const [from, setFrom] = useState(OBSERVATION_DATES[0]);
  const [to, setTo] = useState(OBSERVATION_DATES[OBSERVATION_DATES.length - 1]);
  const [plots, setPlots] = useState([PLOTS[0].id, PLOTS[1].id]);
  const [open, setOpen] = useState(false);

  const toggle = (s) => setChecked((c) => (c.includes(s) ? c.filter((x) => x !== s) : [...c, s]));

  return (
    <>
      <div className="aap-section-title">
        <div>
          <h2>Reports</h2>
          <p className="aap-muted">Bikin sama preview laporan buat {project.name}</p>
        </div>
        <Button intent="primary" icon="download" onClick={() => setOpen(true)}>Ekspor</Button>
      </div>

      <div className="aap-grid">
        <div className="aap-span-4">
          <ChartCard
            title="Builder"
            desc="Form bikin laporan. User milih judul, seksi, rentang tanggal, sama plotnya. Tiap pilihan langsung ngaruh ke preview di sebelah kanan."
          >
            <div className="aap-stack">
              <InputGroup value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul laporan" />
              <div>
                <div className="aap-muted">Seksi</div>
                {SECTIONS.map((s) => (
                  <Checkbox key={s} label={s} checked={checked.includes(s)} onChange={() => toggle(s)} />
                ))}
              </div>
              <div className="aap-flex">
                <HTMLSelect value={from} onChange={(e) => setFrom(e.target.value)} options={OBSERVATION_DATES} />
                <span className="aap-muted">-</span>
                <HTMLSelect value={to} onChange={(e) => setTo(e.target.value)} options={OBSERVATION_DATES} />
              </div>
              <div>
                <div className="aap-muted">Plot</div>
                {PLOTS.map((p) => (
                  <Checkbox
                    key={p.id} label={`${p.id} - ${p.name}`}
                    checked={plots.includes(p.id)}
                    onChange={() => setPlots((v) => (v.includes(p.id) ? v.filter((x) => x !== p.id) : [...v, p.id]))}
                  />
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

        <div className="aap-span-8">
          <div className="aap-report-preview">
            <h1>{title || "Laporan tanpa judul"}</h1>
            <p className="aap-muted">{project.name} · {from} - {to} · {plots.length} plot</p>
            {checked.length === 0 ? <p className="aap-muted">Belum ada seksi yang dipilih.</p> : null}
            {checked.includes("Vegetation") ? (<><h4>Vegetasi</h4><p>Rata-rata ExG 0.318; tutupan hijau 64.2% di plot terpilih.</p></>) : null}
            {checked.includes("Trees") ? (<><h4>Pohon</h4><p>2,184 tajuk kedeteksi, rata-rata keyakinan 0.71.</p></>) : null}
            {checked.includes("Land Cover") ? (<><h4>Tutupan Lahan</h4><p>Kanopi 31%, rumput 22%, tanah 18%, air 9%.</p></>) : null}
            {checked.includes("Plots") ? (
              <><h4>Plot</h4><ul>
                {PLOTS.filter((p) => plots.includes(p.id)).map((p) => (
                  <li key={p.id}>{p.id} - {p.name}: {p.area_ha} ha, {p.trees} pohon</li>
                ))}
              </ul></>
            ) : null}
            {checked.includes("Temporal") ? (<><h4>Temporal</h4><p>Tutupan naik 12.4 poin di rentang waktu yang dipilih.</p></>) : null}
          </div>
        </div>
      </div>

      <Dialog isOpen={open} onClose={() => setOpen(false)} title="Ekspor laporan">
        <DialogBody><p>Generate "{title}" dengan {checked.length} seksi buat {plots.length} plot.</p></DialogBody>
        <DialogFooter actions={
          <>
            <Button onClick={() => setOpen(false)}>Batal</Button>
            <Button intent="primary" onClick={() => { setOpen(false); toast("Laporan masuk antrian", "success"); }}>Bikin PDF</Button>
          </>
        } />
      </Dialog>
    </>
  );
}
