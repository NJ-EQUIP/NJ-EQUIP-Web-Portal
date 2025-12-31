import React from 'react';
import { BINS, RAMP, formatRange } from '../utils/colorScales';

export default function Legend({ dataset, title }) {
  const bins = BINS[dataset];
  if (!bins || bins.length === 0) return null;

  const edges = [...bins, Infinity];

  return (
    <div className="map-legend">
      <h4>{title}</h4>
      <div className="map-legend-rows">
        {edges.map((edge, i) => {
          const from = i === 0 ? 0 : bins[i - 1];
          const to   = edge;
          const color = RAMP[Math.min(i, RAMP.length - 1)];
          return (
            <div key={i} className="map-legend-row">
              <span className="swatch" style={{ background: color }} />
              <span className="range">{formatRange(from, to)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
