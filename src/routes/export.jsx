import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Checkbox, Dialog, DialogBody, DialogFooter, HTMLSelect, Tag } from "@blueprintjs/core";
import { ChartCard } from "@/components/kit";
import { PLOTS, FLIGHT_SESSIONS } from "@/data/mock";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/export")({ component: ExportPage });

const FORMATS = [
  { key: "GeoJSON", desc: "Vector plots, AOI and detections", icon: "polygon-filter" },
  { key: "CSV", desc: "Tabular metrics per plot and session", icon: "th" },
  { key: "PDF", desc: "Rendered analytics report", icon: "document" },
  { key: "PNG", desc: "Map and chart raster snapshots", icon: "media" },
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
          <p className="aap-muted">Package {project.name} outputs for download</p>
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
                {format === f.key ? <Tag intent="primary" minimal>Selected</Tag> : null}
              </div>
              <Button small icon={f.icon} onClick={() => { setFormat(f.key); setOpen(true); }}>Configure</Button>
            </div>
          </div>
        ))}

        <div className="aap-span-6">
          <ChartCard title="Scope">
            <div className="aap-flex">
              <HTMLSelect
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                options={[
                  { label: "Whole project", value: "project" },
                  { label: "Single plot", value: "plot" },
                  { label: "Flight session", value: "session" },
                ]}
              />
              {scope !== "project" ? (
                <HTMLSelect value={target} onChange={(e) => setTarget(e.target.value)} options={targets} />
              ) : (
                <span className="aap-muted">{PLOTS.length} plots · {FLIGHT_SESSIONS.length} sessions</span>
              )}
            </div>
          </ChartCard>
        </div>
        <div className="aap-span-6">
          <ChartCard title="Queue">
            <p className="aap-muted">No pending export jobs.</p>
            <Button intent="primary" icon="export" onClick={() => setOpen(true)}>Start export</Button>
          </ChartCard>
        </div>
      </div>

      <Dialog isOpen={open} onClose={() => setOpen(false)} title={`Export as ${format}`}>
        <DialogBody>
          <p className="aap-muted">Scope: {scope === "project" ? project.name : target}</p>
          <Checkbox label="Include metadata sidecar" checked={meta} onChange={() => setMeta(!meta)} />
          <Checkbox label="Compress output (.zip)" checked={compress} onChange={() => setCompress(!compress)} />
        </DialogBody>
        <DialogFooter actions={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button intent="primary" icon="download" onClick={() => { setOpen(false); toast("Export queued", "success"); }}>Download</Button>
          </>
        } />
      </Dialog>
    </>
  );
}
