import { useEffect, useMemo, useState } from 'react'
import { OBC_3CLASS } from '../utils/colorScales'

const FILE_URL = '/data/obc-2022.geojson';

// Three numeric metrics we can choropleth
export const OBC_METRICS = [
  { key: 'MINORITY_PCT', label: 'Minority %' },
  { key: 'LOW_INCOME_PCT', label: 'Low income %' },
  { key: 'PCTLINGUAGEISO', label: 'Limited English %' },
];

const COLORS = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#E31A1C']; // 5 classes

function parseNum(v) {
  if (v == null) return null;
  const x = Number(String(v).replace(/[, %]/g, ''));
  return Number.isFinite(x) ? x : null;
}

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

export function useObcChoropleth({ metricKey, criteria, mode = 'quantile' }) {
  const [gj, setGj] = useState(null);

  // Load the GeoJSON once
  useEffect(() => {
    let cancelled = false;
    fetch(FILE_URL)
      .then(r => r.json())
      .then(json => { if (!cancelled) setGj(json); })
      .catch(() => { if (!cancelled) setGj({ type: 'FeatureCollection', features: [] }); });
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    for (const f of gj?.features || []) {
      const c = f.properties?.OVERBURDENED_COMMUNITY_CRITERI;
      if (c) set.add(c);
    }
    return Array.from(set).sort();
  }, [gj]);

  // Compute quantile bins on the (optionally) filtered subset
  const breaks = useMemo(() => {
    if (!gj?.features?.length || !metricKey) return [];
    const vals = [];
    for (const f of gj.features) {
      const cat = f.properties?.OVERBURDENED_COMMUNITY_CRITERI;
      if (criteria && cat !== criteria) continue; // filter subset
      const v = parseNum(f.properties?.[metricKey]);
      if (v != null) vals.push(v);
    }
    return vals.length ? quantileBreaks(vals, COLORS.length) : [];
  }, [gj, metricKey, criteria]);

  function getFill(feature) {
    // Grey-out if it doesn't pass the criteria filter
    const cat = feature.properties?.OVERBURDENED_COMMUNITY_CRITERI;
    if (criteria && cat !== criteria) return '#dddddd';

    const v = parseNum(feature.properties?.[metricKey]);
    if (v == null || !breaks.length) return '#cccccc';
    let i = breaks.findIndex(b => v <= b);
    if (i < 0) i = COLORS.length - 1;
    return COLORS[i];
  }

  // --- NEW: 3-class categorical mode (Low income, Minority, Both) ---
  function obcClass(cat) {
    const s = String(cat || '').toLowerCase();
    const li = /low\s*income/.test(s);
    const min = /minor/.test(s);
    if (li && min) return 'both';
    if (li) return 'low-income';
    if (min) return 'minority';
    return null;
  }

  if (mode === '3class') {
    const { colors, labels } = OBC_3CLASS;
    function getFill3(feature) {
      const c = obcClass(feature.properties?.OVERBURDENED_COMMUNITY_CRITERI);
      if (criteria) {
        const want = obcClass(criteria);
        if (want && c !== want) return '#dddddd';
      }
      if (c === 'low-income') return colors[0];
      if (c === 'minority') return colors[1];
      if (c === 'both') return colors[2];
      return '#cccccc'; // not OBC / missing
    }
    return {
      data: gj,
      getFill: getFill3,
      hasData: !!gj?.features?.length,
      legend: {
        title: 'Overburdened Community',
        items: [
          { label: labels[0], color: colors[0] },
          { label: labels[1], color: colors[1] },
          { label: labels[2], color: colors[2] },
          { label: 'No data', color: '#cccccc' },
        ],
      },
      categories,
    };
  }

  // Default (existing) quantile mode
  return {
    data: gj,
    getFill,
    hasData: !!(gj?.features?.length && breaks.length),
    legend: {
      breaks,
      colors: COLORS,
      title: OBC_METRICS.find(m => m.key === metricKey)?.label || 'Value',
      note: criteria ? `Filtered by: ${criteria}` : '',
    },
    categories,
  };
}
