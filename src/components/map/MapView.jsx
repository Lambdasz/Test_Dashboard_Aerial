import { Suspense, lazy } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Spinner } from "@blueprintjs/core";

const LeafletMap = lazy(() => import("./LeafletMap.jsx"));

function Fallback({ height }) {
  return (
    <div className="aap-map-fallback" style={{ height }}>
      <Spinner size={22} />
      <span className="aap-muted">Memuat basemap...</span>
    </div>
  );
}

export default function MapView(props) {
  const height = props.height ?? 420;
  return (
    <ClientOnly fallback={<Fallback height={height} />}>
      <Suspense fallback={<Fallback height={height} />}>
        <LeafletMap {...props} />
      </Suspense>
    </ClientOnly>
  );
}
