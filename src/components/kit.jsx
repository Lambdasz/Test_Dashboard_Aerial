import { useState, useRef, useEffect } from "react";
import { Button, HTMLTable, Icon, Tag } from "@blueprintjs/core";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export function KpiCard({ label, value, unit, delta, spark = [], desc }) {
  return (
    <div className="aap-kpi">
      <div className="aap-kpi-head">
        <span className="aap-kpi-label">{label}</span>
      </div>
      <div className="aap-kpi-value">
        <span className="aap-mono">{value}</span>
        {unit ? <span className="aap-kpi-unit">{unit}</span> : null}
      </div>
      <div className="aap-kpi-foot">
        {delta ? <Tag minimal intent={delta.startsWith("-") ? "danger" : "success"}>{delta}</Tag> : <span />}
        {spark.length > 0 ? (
          <div className="aap-spark">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spark.map((v, i) => ({ i, v }))}>
                <Line type="monotone" dataKey="v" stroke="#2d72d2" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </div>
      {desc ? <p className="aap-desc">{desc}</p> : null}
    </div>
  );
}

export function ChartCard({ title, subtitle, desc, actions, children }) {
  return (
    <div className="aap-card">
      <div className="aap-card-head">
        <div>
          <h3 className="aap-card-title">{title}</h3>
          {subtitle ? <p className="aap-card-sub">{subtitle}</p> : null}
        </div>
        {actions ? <div className="aap-card-actions">{actions}</div> : null}
      </div>
      <div className="aap-card-body">{children}</div>
      {desc ? <p className="aap-desc">{desc}</p> : null}
    </div>
  );
}

export function DataTable({ columns = [], rows = [], pageSize = 8, desc }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const view = rows.slice(page * pageSize, page * pageSize + pageSize);
  return (
    <div className="aap-table-wrap">
      <div className="aap-table-scroll">
        <HTMLTable className="aap-table" striped bordered>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={c.numeric ? "aap-num" : ""}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c.key} className={c.numeric ? "aap-num aap-mono" : ""}>
                    {r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      </div>
      {pages > 1 ? (
        <div className="aap-table-foot">
          <span className="aap-muted">{rows.length} rows</span>
          <div className="aap-flex">
            <Button small icon="chevron-left" disabled={page === 0} onClick={() => setPage((p) => p - 1)} />
            <span className="aap-muted">{page + 1} / {pages}</span>
            <Button small icon="chevron-right" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} />
          </div>
        </div>
      ) : null}
      {desc ? <p className="aap-desc">{desc}</p> : null}
    </div>
  );
}

export function FilterBar({ children }) {
  return <div className="aap-filterbar">{children ?? <span className="aap-muted">Filters</span>}</div>;
}

export function Gauge({ value = 0, max = 100, unit = "", label = "" }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = 52, c = 2 * Math.PI * r;
  return (
    <div className="aap-gauge">
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(143,153,168,0.25)" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r} fill="none" stroke="#1c6e42" strokeWidth="12"
          strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="70" textAnchor="middle" className="aap-gauge-value" dy="0.35em">
          {Math.round(value)}<tspan className="aap-gauge-unit">{unit}</tspan>
        </text>
      </svg>
      {label ? <div className="aap-gauge-label">{label}</div> : null}
    </div>
  );
}

export function BeforeAfter({ height = 280, before, after, leftLabel = "Before", rightLabel = "After" }) {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);

  const move = (clientX) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  useEffect(() => {
    const onMove = (e) => dragging.current && move(e.clientX);
    const onUp = () => (dragging.current = false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div ref={ref} className="aap-ba" style={{ height }}
      onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}>
      <div className="aap-ba-layer">{before}</div>
      <div className="aap-ba-layer aap-ba-top" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>{after}</div>
      <div className="aap-ba-handle" style={{ left: `${pos}%` }}>
        <div className="aap-ba-grip"><Icon icon="drag-horizontal" size={12} /></div>
      </div>
      <Tag minimal className="aap-ba-tag aap-ba-tag-l">{leftLabel}</Tag>
      <Tag minimal className="aap-ba-tag aap-ba-tag-r">{rightLabel}</Tag>
    </div>
  );
}

export function Legend({ items = [] }) {
  return (
    <div className="aap-legend">
      <div className="aap-legend-title">Legend</div>
      {items.map((it, i) => (
        <div key={i} className="aap-legend-row">
          <span className="aap-legend-swatch" style={{ background: it.color }} />
          <span>{it.label}</span>
          {it.value != null ? <span className="aap-muted">{it.value}</span> : null}
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon = "search", title = "Nothing here", description = "" }) {
  return (
    <div style={{ textAlign: "center", padding: "28px 12px" }}>
      <Icon icon={icon} size={28} className="aap-muted" />
      <div style={{ marginTop: 8, fontWeight: 600 }}>{title}</div>
      {description ? <div className="aap-muted" style={{ marginTop: 4 }}>{description}</div> : null}
    </div>
  );
}

export function Skeleton({ lines = 3 }) {
  return (
    <div className="aap-skeleton">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="aap-skeleton-line" style={{ height: 12, width: `${90 - i * 8}%` }} />
      ))}
    </div>
  );
}

export function HeatCell({ value = 0, max = 100 }) {
  const t = Math.max(0, Math.min(1, value / max));
  const color = `rgba(205, 66, 70, ${0.15 + t * 0.75})`;
  return <div className="aap-heat-cell" style={{ background: color }}>{Math.round(value)}</div>;
}

export function Matrix({ rows = [], columns = [], values = [] }) {
  return (
    <table className="aap-matrix">
      <thead>
        <tr><th></th>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={r}>
            <th>{r}</th>
            {columns.map((_, ci) => (
              <td key={ci} style={{ background: `rgba(45, 114, 210, ${(values[ri]?.[ci] ?? 0) / 120})` }}>
                {values[ri]?.[ci] ?? 0}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function LogViewer({ entries = [] }) {
  return (
    <div className="aap-log">
      {entries.map((e, i) => (
        <div key={i} className={`aap-log-${e.level}`}>[{e.ts}] {e.level} {e.msg}</div>
      ))}
    </div>
  );
}

export function Thumb() { return <div className="aap-thumb" />; }
export function ReviewRow({ children }) { return <div className="aap-review-row">{children}</div>; }
