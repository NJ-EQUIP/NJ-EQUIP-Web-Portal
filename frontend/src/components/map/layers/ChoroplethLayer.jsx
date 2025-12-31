import React from 'react';
import { GeoJSON, useMap } from 'react-leaflet';

function EnsureChoroPane() {
  const map = useMap();
  React.useEffect(() => {
    if (!map.getPane('choropleth')) {
      const p = map.createPane('choropleth');
      p.style.zIndex = 300; // under boundary outlines, over tiles
    }
  }, [map]);
  return null;
}

export default function ChoroplethLayer({ data, getFill, interactive = false }) {
  if (!data || !getFill) return null;

  // If layer is non-interactive, don’t attach hover handlers
  const onEach = (feature, layer) => {
    if (!interactive) return;
    layer.on({
      mouseover: () => layer.setStyle({ weight: 1.2, color: '#222', fillOpacity: 0.8 }),
      mouseout:  () => layer.setStyle({ weight: 0.5, color: '#ffffff', fillOpacity: 0.7 }),
    });
  };

  return (
    <>
      <EnsureChoroPane />
      <GeoJSON
        pane="choropleth"
        data={data}
        interactive={interactive}
        bubblingMouseEvents={false}
        style={(feature) => ({
          fillColor: getFill(feature),
          fillOpacity: 0.7,
          color: '#ffffff',
          weight: 0.5,
        })}
        onEachFeature={onEach}
      />
    </>
  );
}
