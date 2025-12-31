import React from 'react';
import { GeoJSON } from 'react-leaflet';

function getName(type, props = {}) {
  if (type === 'county') {
    return (
      props.COUNTY ||
      props.NAME ||
      props.NAME10 ||
      props.COUNTY_NAM ||
      props.COUNTY_LAB ||
      ''
    );
  }
  // municipal
  return (
    props.MUNICIPALITY ||
    props.MUNICIPALI || // sometimes truncated
    props.MUNI ||
    props.MUN_NAME ||
    props.NAME ||
    ''
  );
}

export default function BoundaryLayer({ type, data, onPick }) {
  if (!data) return null;

  const style = type === 'county'
    ? { color: '#cc3300', weight: 2, fill: false, fillOpacity: 0 }
    : { color: '#0077cc', weight: 1.5, fill: false, fillOpacity: 0 };

  return (
    <GeoJSON
      data={data}
      style={style}
      onEachFeature={(feature, layer) => {
        const name = getName(type, feature.properties);
        if (name) {
          layer.bindTooltip(name, { sticky: true, direction: 'top', opacity: 0.9 });
        }
        layer.on('click', () =>
          onPick?.({ type: type === 'county' ? 'County' : 'Municipality', name })
        );
      }}
    />
  );
}
