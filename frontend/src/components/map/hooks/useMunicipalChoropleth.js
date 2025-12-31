import { useEffect, useMemo, useState } from 'react';
import { normalizeMunicipality } from '../utils/normalize';
import { pickMunicipalityKey } from '../utils/accessors';

const COLORS = ['#FFEDA0','#FED976','#FEB24C','#FD8D3C','#E31A1C']; // 5 classes

function parseNum(v) {
  if (v == null) return null;
  const x = Number(String(v).replace(/[, %]/g, ''));
  return Number.isFinite(x) ? x : null;
}

function yearOf(row) {
  for (const k of Object.keys(row || {})) {
    if (k && k.trim().toLowerCase() === 'year') return row[k];
  }
  return null;
}

// quantile upper-bounds
function quantileBreaks(values, k) {
  const v = values.slice().sort((a, b) => a - b);
  if (!v.length) return [];
  const q = [];
  for (let i = 1; i <= k; i++) {
    const p = (i * (v.length - 1)) / k;
    const lo = Math.floor(p), hi = Math.ceil(p);
    const t = p - lo;
    q.push(lo === hi ? v[lo] : v[lo] * (1 - t) + v[hi] * t);
  }
  return q;
}

export function useMunicipalChoropleth({ fileUrl, metricKey, year }) {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    setRows(null);
    if (!fileUrl) return;
    let cancelled = false;
    fetch(fileUrl)
      .then(r => r.json())
      .then(json => { if (!cancelled) setRows(Array.isArray(json) ? json : []); })
      .catch(() => { if (!cancelled) setRows([]); });
    return () => { cancelled = true; };
  }, [fileUrl]);

  const { valueMap, breaks } = useMemo(() => {
    const map = new Map();
    if (!Array.isArray(rows) || !metricKey) return { valueMap: map, breaks: [] };

    // Optional year filtering
    const candidate = rows.filter(r => !year || String(yearOf(r)) === String(year));

    // Group by municipality (choose “latest” row if no year selected)
    const grouped = new Map(); // muni -> rows[]
    for (const r of candidate) {
      const name = normalizeMunicipality(pickMunicipalityKey(r) || '');
      if (!name) continue;
      if (!grouped.has(name)) grouped.set(name, []);
      grouped.get(name).push(r);
    }

    for (const [name, arr] of grouped.entries()) {
      let row = arr[0];
      if (!year) {
        let maxY = -Infinity;
        for (const r of arr) {
          const y = parseNum(yearOf(r));
          if (y != null && y > maxY) { maxY = y; row = r; }
        }
      }
      const v = parseNum(row?.[metricKey]);
      if (v != null) map.set(name, v);
    }

    const vals = Array.from(map.values());
    const br = vals.length ? quantileBreaks(vals, COLORS.length) : [];
    return { valueMap: map, breaks: br };
  }, [rows, metricKey, year]);

  function getFill(feature) {
    const name = normalizeMunicipality(
      feature.properties?.MUNICIPALITY ||
      feature.properties?.MUNICIPALI ||
      feature.properties?.MUNI ||
      feature.properties?.MUN_NAME ||
      feature.properties?.NAME ||
      ''
    );
    const v = valueMap.get(name);
    if (v == null || !breaks.length) return '#cccccc';
    let i = breaks.findIndex(b => v <= b);
    if (i < 0) i = COLORS.length - 1;
    return COLORS[i];
  }

  return {
    getFill,
    hasData: valueMap.size > 0,
    legend: { breaks, colors: COLORS, title: metricKey || 'Value' },
  };
}
