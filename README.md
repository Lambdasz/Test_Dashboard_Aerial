# Aerial Analytics Platform - Module 11 (Skeletal Blueprint)

## What this is

This is NOT a finished production application. This repository is a skeletal blueprint and wireframe mockup created to explore and communicate what the final Aerial Analytics Platform interface could look like.

Its purpose is to:

- Visualise how outputs from the other 10 modules (project manager, plugin system, map explorer, vegetation detection, coverage analytics, condition analysis, tree detection, land-cover classification, plot analytics, temporal change) might be presented in a unified dashboard.
- Prototype the information architecture, navigation flow, and layout for the Dashboard and Reporting module, before any real backend, data pipeline, or plugin integration is built.
- Serve as a shared reference for the project team, the lecturer, and the PM to discuss what data each module needs to hand over and how it should be displayed.

## What is real vs. fake

| Layer                                                   | Status                                                                |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| Layout, navigation, sidebar, app shell                  | Functional (React + Vite + Blueprint.js)                              |
| Charts, gauges, tables, map wrappers                    | Functional components, reusable                                       |
| Route pages (Dashboard, Plugins, Plots, Temporal, etc.) | Rendered with mock data                                               |
| All data (src/data/mock.js)                             | Mock and synthetic only. No real drone imagery, no real plugin output |
| Plugin execution, detection, classification             | Not implemented. Only the UI surface is present                       |
| Backend, database, file import, authentication          | Out of scope for this mockup                                          |
| Map tiles                                               | Real basemap (CARTO / Esri), but no real georeferenced imagery        |

## Why a skeletal blueprint

The Aerial Analytics Platform is a multi-group assignment. Each module is built independently. Module 11 (this repo) is the connective tissue, the layer that will eventually consume outputs from every other module and present them to the user.

Because the other modules do not exist yet at the time of writing, we cannot wire real data into this dashboard. So instead, this mockup:

1. Assumes a plausible data contract for each module.
2. Renders what that data might look like on screen.
3. Documents (via the desc props on every chart and widget, written in Bahasa Indonesia) the intended purpose of each visual element.

Every widget in this app carries an italic description explaining what it is for in the context of the full project. This makes the mockup self-documenting. Anyone reviewing it can understand the intent without a separate spec.

## What the reviewer should take away

- The visual language of the final platform (scientific, data-dense, map-centric).
- The section structure: Dashboard, Plugin (one page per plugin), Reports.
- The component library: reusable KPI cards, chart cards, tables, gauges, before/after sliders, heatmaps, matrices, log viewers.
- The cross-module data contract implied by each widget's desc.

## Stack

- Vite + React (JSX, no TypeScript)
- @tanstack/react-router (file-based routes)
- Blueprint.js v6
- Recharts (charts)
- react-leaflet + leaflet (maps)

## Run

```bash
npm install
npm run dev
```
