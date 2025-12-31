import React from 'react';

function fmt(n) {
  if (n == null || Number.isNaN(n)) return '–';
  // show up to 1 decimal if needed
  return Math.abs(n) >= 1000 ? n.toLocaleString() : (+n.toFixed(1)).toString();
}

export default function DynamicLegend({ legend }) {
  if (!legend) return null;
  // NEW: categorical items mode
  if (legend.items?.length) {
    return (
      <div className="map-legend" style={{ minWidth: 180 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>{legend.title}</div>
        {legend.items.map((it, i) => (
          <div key={i} className="map-legend-row">
            <span className="swatch" style={{ background: it.color }} />
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    );
  }
  if (!legend.breaks?.length) return null;
  const { breaks, colors, title } = legend;
  const items = breaks.map((upper, i) => {
    const lower = i === 0 ? null : breaks[i - 1];
    const label = i === 0
      ? `≤ ${fmt(upper)}`
      : i === breaks.length - 1
        ? `${fmt(lower)} – ${fmt(upper)}`
        : `${fmt(lower)} – ${fmt(upper)}`;
    return { color: colors[i], label };
  });

  return (
    <div className="map-legend" style={{ minWidth: 180 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
      {items.map((it, i) => (
        <div key={i} className="map-legend-row">
          <span className="swatch" style={{ background: it.color }} />
          <span>{it.label}</span>
        </div>
      ))}
      <div className="map-legend-row">
        <span className="swatch" style={{ background: '#cccccc' }} />
        <span>No data</span>
      </div>
    </div>
  );
}
