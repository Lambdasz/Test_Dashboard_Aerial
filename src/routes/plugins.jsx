import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button, HTMLTable, Switch, Tag } from "@blueprintjs/core";
import { ChartCard, KpiCard, LogViewer, Legend } from "@/components/kit";
import { PLUGINS, PLUGIN_LOG } from "@/data/mock";

export const Route = createFileRoute("/plugins")({ component: PluginsPage });

function PluginsPage() {
  const [state, setState] = useState(() => Object.fromEntries(PLUGINS.map((p) => [p.id, p.enabled])));
  const [selected, setSelected] = useState(PLUGINS[0].id);
  const plugin = PLUGINS.find((p) => p.id === selected);
  const enabled = PLUGINS.filter((p) => state[p.id]).length;

  return (
    <>
      <div className="aap-section-title">
        <div>
          <h2>Manage Plugins</h2>
          <p className="aap-muted">{enabled} of {PLUGINS.length} plugins enabled</p>
        </div>
        <Button icon="add" intent="primary">Install plugin</Button>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3"><KpiCard label="Installed" value={PLUGINS.length} /></div>
        <div className="aap-span-3"><KpiCard label="Enabled" value={enabled} /></div>
        <div className="aap-span-3"><KpiCard label="Warnings" value={2} /></div>
        <div className="aap-span-3"><KpiCard label="Errors" value={1} /></div>

        <div className="aap-span-8">
          <ChartCard title="Installed plugins">
            <HTMLTable className="aap-table" striped bordered>
              <thead>
                <tr><th>Name</th><th>Version</th><th>Inputs</th><th>Outputs</th><th>Enabled</th><th></th></tr>
              </thead>
              <tbody>
                {PLUGINS.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="aap-mono">{p.version}</td>
                    <td>{p.inputs.map((i) => <Tag key={i} minimal>{i}</Tag>)}</td>
                    <td>{p.outputs.map((o) => <Tag key={o} minimal intent="success">{o}</Tag>)}</td>
                    <td><Switch checked={state[p.id]} onChange={() => setState({ ...state, [p.id]: !state[p.id] })} /></td>
                    <td><Button small icon="cog" onClick={() => setSelected(p.id)} /></td>
                  </tr>
                ))}
              </tbody>
            </HTMLTable>
          </ChartCard>
        </div>
        <div className="aap-span-4">
          <ChartCard title={plugin?.name} subtitle={`v${plugin?.version}`}>
            <p className="aap-muted">{plugin?.description}</p>
            <Legend items={(plugin?.outputs ?? []).map((o, i) => ({
              color: ["#1c6e42", "#2d72d2", "#c87619"][i % 3], label: o,
            }))} />
          </ChartCard>
        </div>

        <div className="aap-span-12">
          <ChartCard title="Execution log"><LogViewer entries={PLUGIN_LOG} /></ChartCard>
        </div>
      </div>
    </>
  );
}
