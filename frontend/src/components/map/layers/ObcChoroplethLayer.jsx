import React from 'react';
import { GeoJSON, useMap } from 'react-leaflet';

function EnsureOBCPane() {
  const map = useMap();
  React.useEffect(() => {
    if (!map.getPane('obc')) {
      const p = map.createPane('obc');
      p.style.zIndex = 420; // above choropleths/boundaries
    }
  }, [map]);
  return null;
}

export default function ObcChoroplethLayer({ data, getFill, visible = true }) {
  if (!visible || !data || !getFill) return null;

  return (
    <>
      <EnsureOBCPane />
      <GeoJSON
        pane="obc"
        data={data}
        bubblingMouseEvents={false}
        style={(feature) => ({
          fillColor: getFill(feature),
          fillOpacity: 0.6,
          color: '#ffffff',
          weight: 0.4,
        })}
        onEachFeature={(feature, layer) => {
          const props = feature.properties || {};
          const name =
            props.NAME || props.MUNICIPALITY || props.muni_name || 'Block Group';
          const cat = props.OVERBURDENED_COMMUNITY_CRITERI || '—';
          const val =
            props.MINORITY_PCT ?? props.LOW_INCOME_PCT ?? props.PCTLINGUAGEISO ?? '—';
          layer.bindTooltip(`${name}<br/>${cat}<br/><b>${val}</b>`, {
            sticky: true, direction: 'top', opacity: 0.9
          });
        }}
      />
    </>
  );
}
