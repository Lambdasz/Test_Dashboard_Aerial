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
  const [title, setTitle] = useState("Seasonal Canopy Report");
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
          <p className="aap-muted">Compose and preview a deliverable for {project.name}</p>
        </div>
        <Button intent="primary" icon="download" onClick={() => setOpen(true)}>Export</Button>
      </div>

      <div className="aap-grid">
        <div className="aap-span-4">
          <ChartCard title="Builder">
            <div className="aap-stack">
              <InputGroup value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Report title" />
              <div>
                <div className="aap-muted">Sections</div>
                {SECTIONS.map((s) => (
                  <Checkbox key={s} label={s} checked={checked.includes(s)} onChange={() => toggle(s)} />
                ))}
              </div>
              <div className="aap-flex">
                <HTMLSelect value={from} onChange={(e) => setFrom(e.target.value)} options={OBSERVATION_DATES} />
                <span className="aap-muted">→</span>
                <HTMLSelect value={to} onChange={(e) => setTo(e.target.value)} options={OBSERVATION_DATES} />
              </div>
              <div>
                <div className="aap-muted">Plots</div>
                {PLOTS.map((p) => (
                  <Checkbox
                    key={p.id} label={`${p.id} — ${p.name}`}
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
            <h1>{title || "Untitled report"}</h1>
            <p className="aap-muted">{project.name} · {from} → {to} · {plots.length} plots</p>
            {checked.length === 0 ? <p className="aap-muted">No sections selected.</p> : null}
            {checked.includes("Vegetation") ? (<><h4>Vegetation</h4><p>Mean ExG 0.318; green coverage 64.2% across selected plots.</p></>) : null}
            {checked.includes("Trees") ? (<><h4>Trees</h4><p>2,184 crowns detected, mean confidence 0.71.</p></>) : null}
            {checked.includes("Land Cover") ? (<><h4>Land Cover</h4><p>Canopy 31%, grass 22%, bare soil 18%, water 9%.</p></>) : null}
            {checked.includes("Plots") ? (
              <><h4>Plots</h4><ul>
                {PLOTS.filter((p) => plots.includes(p.id)).map((p) => (
                  <li key={p.id}>{p.id} — {p.name}: {p.area_ha} ha, {p.trees} trees</li>
                ))}
              </ul></>
            ) : null}
            {checked.includes("Temporal") ? (<><h4>Temporal</h4><p>Coverage rose 12.4 points over the selected window.</p></>) : null}
          </div>
        </div>
      </div>

      <Dialog isOpen={open} onClose={() => setOpen(false)} title="Export report">
        <DialogBody><p>Render “{title}” with {checked.length} sections for {plots.length} plots.</p></DialogBody>
        <DialogFooter actions={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button intent="primary" onClick={() => { setOpen(false); toast("Report queued", "success"); }}>Generate PDF</Button>
          </>
        } />
      </Dialog>
    </>
  );
}
