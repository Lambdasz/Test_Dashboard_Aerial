import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Checkbox, Tag } from "@blueprintjs/core";
import { ChartCard } from "@/components/kit";
import MapView from "@/components/map/MapView";
import { IMAGES, PLOTS, MAP_CENTER, AOI_BOUNDS } from "@/data/mock";

export const Route = createFileRoute("/map")({ component: MapExplorer });

function MapExplorer() {
  const [layers, setLayers] = useState({ images: true, plots: true, aoi: true });

  const markers = IMAGES.slice(0, 40).map((im) => ({
    id: im.id, lat: im.lat, lng: im.lng,
    color: im.quality === "good" ? "#1c6e42" : im.quality === "fair" ? "#c87619" : "#cd4246",
    label: im.id, detail: `${im.date}\nquality: ${im.quality}`,
  }));

  const polygons = PLOTS.map((p) => ({
    positions: p.positions, color: "#2d72d2", label: p.name,
    detail: `${p.area_ha} ha · ${p.trees} trees`,
  }));

  return (
    <>
      <div className="aap-section-title">
        <div>
          <h2>Map Explorer</h2>
          <p className="aap-muted">{IMAGES.length} imej · {PLOTS.length} plot</p>
        </div>
        <Tag minimal>EPSG:4326</Tag>
      </div>

      <div className="aap-grid">
        <div className="aap-span-3">
          <ChartCard
            title="Layers"
            desc="Pengurus lapisan. Pengguna boleh menghidup/matikan lapisan imejan, sempadan plot dan AOI. Ini penting untuk mengelak kekeliruan visual semasa analisis."
          >
            <Checkbox checked={layers.images} label="Imagery" onChange={() => setLayers({ ...layers, images: !layers.images })} />
            <Checkbox checked={layers.plots} label="Plot boundaries" onChange={() => setLayers({ ...layers, plots: !layers.plots })} />
            <Checkbox checked={layers.aoi} label="AOI" onChange={() => setLayers({ ...layers, aoi: !layers.aoi })} />
            <div className="aap-flex" style={{ marginTop: 12 }}>
              <Button small icon="polygon-filter">Draw AOI</Button>
              <Button small icon="ruler">Measure</Button>
            </div>
          </ChartCard>
        </div>
        <div className="aap-span-9">
          <ChartCard
            title="Geo-referenced imagery"
            desc="Peta interaktif yang menunjukkan lokasi sebenar setiap imej, sempadan plot dan kawasan tumpuan (AOI). Ini adalah teras kepada semua analitik spatial dalam platform — hasil daripada semua plugin dipaparkan di atas peta ini."
          >
            <MapView
              center={MAP_CENTER} zoom={13} height={560}
              markers={layers.images ? markers : []}
              polygons={layers.plots ? polygons : []}
              rectangles={layers.aoi ? [{ bounds: AOI_BOUNDS, color: "#FBB360", label: "AOI", fillOpacity: 0.08 }] : []}
            />
          </ChartCard>
        </div>
      </div>
    </>
  );
}
