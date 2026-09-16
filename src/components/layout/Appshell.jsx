import { useEffect, useMemo, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Alignment, Button, Callout, Classes, Dialog, DialogBody, Divider, Icon,
  InputGroup, Menu, MenuDivider, MenuItem, Navbar, Popover, Tag,
} from "@blueprintjs/core";
import { PLUGIN_ALERTS, PLUGINS, PROJECTS } from "@/data/mock";
import { useApp } from "@/lib/app-state";
import Sidebar, { NAV_SECTIONS } from "./Sidebar";

const FLAT_NAV = NAV_SECTIONS.flatMap((s) => s.items);

function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const needle = q.toLowerCase();
    const pages = FLAT_NAV.filter((n) => n.label.toLowerCase().includes(needle)).map((n) => ({ ...n, kind: "Page" }));
    const plugins = PLUGINS.filter((p) => p.name.toLowerCase().includes(needle)).map((p) => ({
      to: "/plugins", label: p.name, icon: "widget", kind: "Plugin",
    }));
    return [...pages, ...plugins].slice(0, 9);
  }, [q]);

  return (
    <Dialog isOpen={open} onClose={onClose} title="Command palette" icon="search" className="aap-palette">
      <DialogBody>
        <InputGroup
          autoFocus large leftIcon="chevron-right"
          placeholder="Jump to a page, plugin or result…"
          value={q} onChange={(e) => setQ(e.target.value)}
        />
        <Menu className="aap-palette-menu">
          {results.map((r) => (
            <Link key={`${r.kind}-${r.label}`} to={r.to} onClick={onClose} className="aap-palette-link">
              <MenuItem icon={r.icon} text={r.label} labelElement={<Tag minimal>{r.kind}</Tag>} tagName="div" />
            </Link>
          ))}
          {results.length === 0 ? <MenuItem disabled text="No matches" /> : null}
        </Menu>
        <p className="aap-muted aap-palette-hint">
          Tip: press <code className={Classes.CODE}>⌘K</code> anywhere to open this palette.
        </p>
      </DialogBody>
    </Dialog>
  );
}

export function AppShell({ children }) {
  const { dark, toggleDark, project, setProjectId, toasts, dismiss } = useApp();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const errors = PLUGIN_ALERTS.filter((a) => a.intent === "danger").length;

  return (
    <div className={`aap-shell ${dark ? "bp6-dark aap-dark" : "aap-light"}`}>
      <Navbar className="aap-navbar">
        <Navbar.Group align={Alignment.LEFT}>
          <Button minimal icon="menu" aria-label="Toggle sidebar" onClick={() => setCollapsed((c) => !c)} />
          <Navbar.Heading className="aap-brand">
            <span className="aap-brand-mark"><Icon icon="send-to-map" size={15} /></span>
            <span>Aerial<strong>Analytics</strong></span>
          </Navbar.Heading>
          <Divider />
          <Popover
            minimal placement="bottom-start"
            content={
              <Menu>
                <MenuDivider title="Switch project" />
                {PROJECTS.map((p) => (
                  <MenuItem
                    key={p.id}
                    icon={p.id === project.id ? "tick" : "blank"}
                    text={p.name} label={p.status}
                    onClick={() => setProjectId(p.id)}
                  />
                ))}
              </Menu>
            }
          >
            <Button minimal rightIcon="caret-down" icon="projects" text={project.name} className="aap-project-switch" />
          </Popover>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <Button minimal icon="search" className="aap-search-btn" onClick={() => setPaletteOpen(true)}>
            <span className="aap-search-label">Search…</span>
            <Tag minimal className="aap-kbd">⌘K</Tag>
          </Button>
          <Popover
            minimal placement="bottom-end"
            content={
              <div className="aap-health">
                <div className="aap-health-head">Plugin health</div>
                {PLUGIN_ALERTS.map((a) => (
                  <Callout key={a.id} intent={a.intent} title={a.title} compact className="aap-health-item">
                    <span className="aap-muted">{a.plugin}</span> — {a.detail}
                  </Callout>
                ))}
              </div>
            }
          >
            <Button minimal aria-label="Plugin health" className="aap-bell">
              <Icon icon="notifications" />
              {errors > 0 ? <span className="aap-bell-dot" /> : null}
            </Button>
          </Popover>
          <Button minimal icon={dark ? "flash" : "moon"} aria-label="Toggle theme" onClick={toggleDark} />
          <Popover
            minimal placement="bottom-end"
            content={
              <Menu>
                <MenuDivider title="M. Okonkwo · Analyst" />
                <MenuItem icon="user" text="Profile" />
                <MenuItem icon="cog" text="Preferences" />
                <MenuItem icon="log-out" text="Sign out" />
              </Menu>
            }
          >
            <button className="aap-avatar" aria-label="User menu">MO</button>
          </Popover>
        </Navbar.Group>
      </Navbar>

      <div className={`aap-body ${collapsed ? "is-collapsed" : ""}`}>
        <Sidebar collapsed={collapsed} />
        <main className="aap-main">{children}</main>
      </div>

      <div className="aap-toasts">
        {toasts.map((t) => (
          <Callout key={t.id} intent={t.intent} compact className="aap-toast" icon={t.intent === "danger" ? "error" : "tick-circle"}>
            {t.message}
            <Button minimal small icon="cross" onClick={() => dismiss(t.id)} />
          </Callout>
        ))}
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
