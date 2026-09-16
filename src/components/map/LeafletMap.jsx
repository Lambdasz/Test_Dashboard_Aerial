import {
  CircleMarker,
  MapContainer,
  Polygon,
  Polyline,
  Popup,
  Rectangle,
  TileLayer,
  Tooltip,
} from "react-leaflet";

export default function LeafletMap({
  center = [45.4215, -75.6972],
  zoom = 14,
  markers = [],
  polygons = [],
  rectangles = [],
  polylines = [],
  tiles = "dark",
  height = 420,
}) {
  const url =
    tiles === "satellite"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : tiles === "light"
        ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: "100%", borderRadius: 6 }} scrollWheelZoom>
      <TileLayer url={url} attribution="&copy; OpenStreetMap, CARTO, Esri" />
      {polygons.map((p, i) => (
        <Polygon key={`poly-${i}`} positions={p.positions} pathOptions={{ color: p.color, weight: 2, fillOpacity: p.fillOpacity ?? 0.22 }}>
          {p.label ? (
            <Popup>
              <strong>{p.label}</strong>
              {p.detail ? <div>{p.detail}</div> : null}
            </Popup>
          ) : null}
        </Polygon>
      ))}
      {rectangles.map((r, i) => (
        <Rectangle key={`rect-${i}`} bounds={r.bounds} pathOptions={{ color: r.color, weight: 1, fillOpacity: r.fillOpacity ?? 0.5 }}>
          {r.label ? <Tooltip>{r.label}</Tooltip> : null}
        </Rectangle>
      ))}
      {polylines.map((l, i) => (
        <Polyline key={`line-${i}`} positions={l.positions} pathOptions={{ color: l.color ?? "#FBB360", weight: 2, dashArray: "6 6" }}>
          {l.label ? <Tooltip permanent direction="center">{l.label}</Tooltip> : null}
        </Polyline>
      ))}
      {markers.map((m, i) => (
        <CircleMarker
          key={m.id ?? `m-${i}`}
          center={[m.lat, m.lng]}
          radius={m.radius ?? 5}
          pathOptions={{ color: m.color ?? "#2D72D2", fillColor: m.color ?? "#2D72D2", fillOpacity: m.opacity ?? 0.75, weight: 1 }}
        >
          {m.label ? (
            <Popup>
              <strong>{m.label}</strong>
              {m.detail ? <div style={{ whiteSpace: "pre-line" }}>{m.detail}</div> : null}
            </Popup>
          ) : null}
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
