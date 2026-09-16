import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, MenuDivider, MenuItem, Tag } from "@blueprintjs/core";

export const NAV_SECTIONS = [
  {
    label: "Dashboard",
    items: [
      { to: "/", label: "Overview", icon: "dashboard" },
      { to: "/analytics", label: "Analytics", icon: "timeline-bar-chart" },
      { to: "/map", label: "Map Explorer", icon: "globe" },
      { to: "/plots", label: "Plots", icon: "polygon-filter" },
      { to: "/temporal", label: "Temporal", icon: "history" },
    ],
  },
  {
    label: "Plugin",
    items: [
      { to: "/plugin/vegetation", label: "RGB Vegetation Detection", icon: "layout-hierarchy" },
      { to: "/plugin/trees", label: "Tree Detection & Counting", icon: "tree" },
      { to: "/plugin/landcover", label: "Land Cover Classification", icon: "layers" },
      { to: "/plugins", label: "Manage Plugin", icon: "widget" },
    ],
  },
  {
    label: "Reports",
    items: [
      { to: "/reports", label: "Report Builder", icon: "document" },
      { to: "/export", label: "Export", icon: "export" },
      { to: "/gallery", label: "Widget Gallery", icon: "grid-view" },
    ],
  },
];

export default function Sidebar({ collapsed }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="aap-sidebar">
      <Menu className="aap-sidemenu">
        {NAV_SECTIONS.map((section, si) => (
          <div key={section.label}>
            {si > 0 ? <MenuDivider /> : null}
            <li className="aap-nav-section">{section.label}</li>
            {section.items.map((n) => {
              const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} className="aap-navlink">
                  <MenuItem icon={n.icon} text={n.label} active={active} tagName="div" />
                </Link>
              );
            })}
          </div>
        ))}
      </Menu>
      <div className="aap-sidefoot">
        <Tag minimal icon="database" fill>
          <span className="aap-mono">Module 11 · v2.0.0</span>
        </Tag>
      </div>
    </aside>
  );
}
