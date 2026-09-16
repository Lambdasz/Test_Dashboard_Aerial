function rnd(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}
function pick(seed, arr) {
    return arr[Math.floor(rnd(seed) * arr.length)];
}
function round(n, d = 0) {
    const f = Math.pow(10, d);
    return Math.round(n * f) / f;
}

export const PROJECTS = [
    { id: "P-01", name: "Ridgeline Orchard", status: "Active", area_ha: 412, sessions: 7 },
    { id: "P-02", name: "Creek Valley Farm", status: "Active", area_ha: 268, sessions: 5 },
    { id: "P-03", name: "North Block Nursery", status: "Archived", area_ha: 154, sessions: 6 },
];

export const PLUGINS = [
    { id: "pl-1", name: "Vegetation Index", version: "1.4.2", enabled: true, description: "ExG/ExR/VARI mask generation", inputs: ["RGB"], outputs: ["Mask", "Stats"] },
    { id: "pl-2", name: "Tree Detector", version: "2.1.0", enabled: true, description: "Crown detection & counting", inputs: ["RGB"], outputs: ["Points", "Counts"] },
    { id: "pl-3", name: "Land Cover Classifier", version: "3.0.1", enabled: true, description: "6-class thematic segmentation", inputs: ["RGB"], outputs: ["Thematic", "Areas"] },
    { id: "pl-4", name: "Temporal Change Engine", version: "0.9.7", enabled: false, description: "Multi-date change detection", inputs: ["Mask", "Mask"], outputs: ["Delta", "Heatmap"] },
    { id: "pl-5", name: "Ortho Mosaic Builder", version: "1.2.5", enabled: false, description: "Photo stitching", inputs: ["Images"], outputs: ["Ortho"] },
    { id: "pl-6", name: "Image QC Screener", version: "1.0.3", enabled: true, description: "Blur/exposure screening", inputs: ["Images"], outputs: ["Flags"] },
    { id: "pl-7", name: "NDVI Proxy", version: "0.4.1", enabled: true, description: "RGB-derived NDVI approximation", inputs: ["RGB"], outputs: ["Index"] },
    { id: "pl-8", name: "Canopy Height Estimator", version: "0.6.0", enabled: true, description: "Shadow-based height estimation", inputs: ["RGB", "Sun"], outputs: ["Heights"] },
];

export const PLUGIN_ALERTS = [
    { id: "al-1", plugin: "Temporal Change Engine", intent: "danger", detail: "Worker crashed on tile 14/4823/5921 (OOM)", ts: "2026-09-15 06:12" },
    { id: "al-2", plugin: "Land Cover Classifier", intent: "warning", detail: "Model checksum drift on class 'built-up'", ts: "2026-09-14 21:40" },
    { id: "al-3", plugin: "Ortho Mosaic Builder", intent: "none", detail: "Plugin disabled by operator", ts: "2026-09-13 11:02" },
    { id: "al-4", plugin: "Image QC Screener", intent: "warning", detail: "38 frames flagged for low exposure", ts: "2026-09-12 15:27" },
];

export const OBSERVATION_DATES = [
    "2026-04-08",
    "2026-05-06",
    "2026-06-03",
    "2026-07-01",
    "2026-07-29",
    "2026-08-26",
    "2026-09-12",
];

const SITES = ["North Block", "South Block", "Ridge Line", "Creek Edge", "Nursery Rows"];

export const FLIGHT_SESSIONS = OBSERVATION_DATES.flatMap((date, di) =>
    [0, 1].map((k) => {
        const s = di * 7 + k * 3 + 1;
        const images = 180 + Math.floor(rnd(s) * 240);
        const good = Math.floor(images * (0.68 + rnd(s + 1) * 0.2));
        const fair = Math.floor((images - good) * 0.66);
        return {
            id: `FS-${String(di + 1).padStart(2, "0")}${k === 0 ? "A" : "B"}`,
            date,
            site: pick(s + 2, SITES),
            pilot: pick(s + 3, ["M. Okoye", "L. Tremblay", "A. Silva", "R. Chen"]),
            images,
            area_ha: round(18 + rnd(s + 4) * 42, 1),
            altitude_m: 80 + Math.floor(rnd(s + 5) * 40),
            overlap: Math.floor(70 + rnd(s + 6) * 15),
            coverage: round(0.82 + rnd(s + 7) * 0.17, 3),
            gsd_cm: round(1.6 + rnd(s + 8) * 1.8, 2),
            duration_min: 18 + Math.floor(rnd(s + 9) * 24),
            trees: 400 + Math.floor(rnd(s + 10) * 900),
            quality: { good, fair, poor: images - good - fair },
        };
    }),
);

const BASE = [45.3208, -75.9219];

export const IMAGES = FLIGHT_SESSIONS.flatMap((session, si) =>
    Array.from({ length: 14 }, (_, i) => {
        const s = si * 31 + i * 2 + 5;
        return {
            id: `${session.id}-IMG-${String(i + 1).padStart(3, "0")}`,
            session: session.id,
            date: session.date,
            lat: round(BASE[0] + (rnd(s) - 0.5) * 0.022, 6),
            lng: round(BASE[1] + (rnd(s + 1) - 0.5) * 0.03, 6),
            quality: rnd(s + 2) > 0.82 ? "poor" : rnd(s + 2) > 0.55 ? "fair" : "good",
            gsd_cm: round(1.6 + rnd(s + 3) * 1.6, 2),
            width: 5472,
            height: 3648,
            exposure_ms: round(1 + rnd(s + 4) * 6, 1),
        };
    }),
);

function ring(lat, lng, w, h) {
    return [
        [lat - h, lng - w],
        [lat - h, lng + w],
        [lat + h, lng + w],
        [lat + h, lng - w],
    ];
}

export const PLOTS = Array.from({ length: 8 }, (_, i) => {
    const s = i * 17 + 3;
    const lat = BASE[0] + (i % 4) * 0.006 - 0.009;
    const lng = BASE[1] + Math.floor(i / 4) * 0.012 - 0.008;
    const veg = round(38 + rnd(s) * 42, 1);
    const soil = round((100 - veg) * (0.4 + rnd(s + 1) * 0.3), 1);
    const water = round((100 - veg - soil) * 0.4, 1);
    const built = round(100 - veg - soil - water, 1);
    return {
        id: `PLOT-${String(i + 1).padStart(2, "0")}`,
        name: `${pick(s + 2, SITES)} ${i + 1}`,
        crop: pick(s + 3, ["Apple", "Pear", "Mixed hardwood", "Spruce"]),
        area_ha: round(6 + rnd(s + 4) * 24, 2),
        perimeter_m: Math.round(900 + rnd(s + 5) * 1600),
        centroid: [round(lat, 6), round(lng, 6)],
        positions: ring(lat, lng, 0.0042, 0.0024),
        trees: 120 + Math.floor(rnd(s + 6) * 480),
        canopy_pct: round(30 + rnd(s + 7) * 50, 1),
        vigour: round(0.42 + rnd(s + 8) * 0.5, 3),
        veg_pct: veg,
        soil_pct: soil,
        water_pct: water,
        built_pct: built,
    };
});

export const LAND_CLASSES = [
    { key: "canopy", label: "Tree canopy", color: "#1c6e42" },
    { key: "grass", label: "Grass / cover crop", color: "#8aba63" },
    { key: "soil", label: "Bare soil", color: "#946638" },
    { key: "water", label: "Water", color: "#2d72d2" },
    { key: "built", label: "Built-up", color: "#7961db" },
    { key: "shadow", label: "Shadow / unclassified", color: "#5f6b7c" },
];

export const PLUGIN_LOG = [
    { level: "INFO", ts: "06:10:02", msg: "vegetation-index: loaded ortho tile set (412 tiles)" },
    { level: "INFO", ts: "06:10:44", msg: "vegetation-index: ExG computed, mean=0.318 sd=0.094" },
    { level: "WARN", ts: "06:11:15", msg: "qc-screener: 38 frames below exposure floor" },
    { level: "INFO", ts: "06:11:51", msg: "tree-detector: 2,184 crowns, mean conf 0.71" },
    { level: "ERROR", ts: "06:12:09", msg: "change-engine: worker OOM at tile 14/4823/5921" },
    { level: "WARN", ts: "06:12:10", msg: "change-engine: retry 1/3 scheduled" },
    { level: "ERROR", ts: "06:12:38", msg: "change-engine: retry 1 failed (exit 137)" },
    { level: "INFO", ts: "06:13:02", msg: "land-cover: thematic tiles published to /tiles/lc/v3" },
];

export const TREE_DETECTIONS = Array.from({ length: 24 }, (_, i) => {
    const s = i * 11 + 7;
    return {
        id: `TD-${String(i + 1).padStart(3, "0")}`,
        plot: PLOTS[i % PLOTS.length].id,
        lat: round(BASE[0] + (rnd(s) - 0.5) * 0.02, 6),
        lng: round(BASE[1] + (rnd(s + 1) - 0.5) * 0.026, 6),
        confidence: round(0.4 + rnd(s + 2) * 0.59, 3),
        crown_m: round(1.6 + rnd(s + 3) * 5.4, 2),
        height_m: round(3 + rnd(s + 4) * 12, 1),
        status: "pending",
    };
});

export const AOI_BOUNDS = [
    [BASE[0] - 0.014, BASE[1] - 0.02],
    [BASE[0] + 0.014, BASE[1] + 0.02],
];

export const MAP_CENTER = BASE;
