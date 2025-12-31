import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useBoundaries } from '../hooks/useBoundaries';
import { datasetFileMap, municipalDatasetFileMap } from '../constants/datasets';
import { pickCountyKey, pickMunicipalityKey } from '../utils/accessors';
import { normalizeCounty, normalizeMunicipality } from '../utils/normalize';

const COUNTY_DATASETS = [
  'energy-burden',
  'housing-built-year',
  'heating-fuel',
  'njcep-savings',
  'tenure-type',
  'race-ethnicity',
  'income',
];

const MUNI_DATASETS = [
  'energy-burden',
  'energy-consumption',
  'ghg-emissions',
];

function shallowEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (a[k] !== b[k]) return false;
  return true;
}

function getYearFromRow(row) {
  if (!row || typeof row !== 'object') return null;
  for (const k of Object.keys(row)) {
    if (k && k.trim().toLowerCase() === 'year') return row[k];
  }
  return null;
}

function parseMaybeNumber(v) {
  if (v == null) return null;
  const num = Number(String(v).replace(/[, %]/g, ''));
  return Number.isFinite(num) ? num : null;
}

/* ---------- Column cleaning rules ---------- */
const ALWAYS_DROP = new Set([
  'geoid', 'objectid', 'fid', 'uid', 'id',
  'statefp', 'countyfp', 'tract', 'tractce', 'geography id',
]);

function shouldDropKey(scope, dataset, key) {
  if (!key) return false;
  const raw = key;
  const k = key.trim();
  const lower = k.toLowerCase();

  if (ALWAYS_DROP.has(lower)) return true;

  // County / Energy Burden: drop Geography ID, State
  if (scope === 'county' && dataset === 'energy-burden') {
    if (lower === 'geography id' || lower === 'state') return true;
  }

  // County / Race Ethnicity: drop any Total* columns
  if (scope === 'county' && dataset === 'race-ethnicity') {
    if (/^total\b/i.test(k)) return true;
  }

  // Municipal / Energy Burden: drop muni/county id columns
  if (scope === 'municipal' && dataset === 'energy-burden') {
    if (lower === 'municipality' || lower === 'county') return true;
  }

  return false;
}

function cleanRow(row, { scope, dataset }) {
  const out = {};
  for (const [k, v] of Object.entries(row || {})) {
    if (shouldDropKey(scope, dataset, k)) continue;
    if (v === '' || v == null) continue;
    out[k] = v;
  }
  return out;
}

/* ---------- InfoBox ---------- */
export default function InfoBox({ scope: scopeProp, onFilterChange }) {
  // Scope comes from Map (county | municipal); allow manual override if not provided
  const [scope, setScope] = useState(scopeProp || 'county');
  useEffect(() => { if (scopeProp) setScope(scopeProp); }, [scopeProp]);

  // Selected dataset, place, year, metric
  const [dataset, setDataset] = useState(scope === 'county' ? 'tenure-type' : 'energy-burden');
  const [place, setPlace] = useState('');      // '' = All places
  const [year, setYear] = useState('');      // '' = All years
  const [metric, setMetric] = useState('');    // chosen numeric column key
  const [showRaw, setShowRaw] = useState(false);
  const [showQueried, setShowQueried] = useState(true);


  // Boundary data → options for "place" dropdown
  const { municipalData, countyData } = useBoundaries();

  const placeOptions = useMemo(() => {
    if (scope === 'county') {
      const names = (countyData?.features || [])
        .map(f => f.properties?.COUNTY || f.properties?.NAME)
        .filter(Boolean);
      return Array.from(new Set(names)).sort();
    } else {
      const names = (municipalData?.features || [])
        .map(f => f.properties?.MUNICIPALITY || f.properties?.NAME)
        .filter(Boolean);
      return Array.from(new Set(names)).sort();
    }
  }, [scope, countyData, municipalData]);

  // Resolve filename + URL for the dataset
  const filename = useMemo(() => {
    if (scope === 'county') return datasetFileMap[dataset];
    if (scope === 'municipal') return municipalDatasetFileMap[dataset];
    return undefined;
  }, [scope, dataset]);

  const fileUrl = useMemo(() => {
    if (!filename) return undefined;
    return scope === 'county'
      ? `/data/county-filters/${filename}`
      : `/data/muni-filters/${filename}`;
  }, [scope, filename]);

  // Load the entire JSON
  const [raw, setRaw] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState('');

  useEffect(() => {
    setRaw(null);
    setError('');
    if (!fileUrl) { setStatus('error'); setError('No dataset file mapped.'); return; }
    let cancelled = false;
    setStatus('loading');
    fetch(fileUrl)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => { if (!cancelled) { setRaw(json); setStatus('ready'); } })
      .catch(e => { if (!cancelled) { setStatus('error'); setError(e.message || 'Failed to load JSON'); } });
    return () => { cancelled = true; };
  }, [fileUrl]);

  // Compute available years from the JSON
  const availableYears = useMemo(() => {
    if (!Array.isArray(raw)) return [];
    const set = new Set();
    for (const r of raw) {
      const y = getYearFromRow(r);
      if (y != null && y !== '') set.add(String(y).trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [raw]);

  // Derive list of numeric columns to expose as "Metric" choices
  const metricOptions = useMemo(() => {
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const sample = raw.slice(0, Math.min(50, raw.length));
    const counts = new Map(); // key -> how many rows are numeric
    for (const r of sample) {
      for (const k of Object.keys(r)) {
        if (k.trim().toLowerCase() === 'year') continue;
        if (shouldDropKey(scope, dataset, k)) continue; // also honor cleaning rules in metrics
        const val = parseMaybeNumber(r[k]);
        if (val != null) counts.set(k, (counts.get(k) || 0) + 1);
      }
    }
    const out = Array.from(counts.entries())
      .filter(([_, c]) => c >= Math.ceil(sample.length * 0.6))
      .map(([k]) => k)
      .sort();
    return out;
  }, [raw, scope, dataset]);

  // Select a default metric when dataset (or file) changes
  useEffect(() => {
    setMetric(prev => (metricOptions.includes(prev) ? prev : (metricOptions[0] || '')));
  }, [metricOptions]);

  // Filter rows by place and year (for display)
  const filtered = useMemo(() => {
    if (!Array.isArray(raw)) return raw;

    let rows = raw;

    if (place) {
      if (scope === 'county') {
        const target = normalizeCounty(place);
        rows = rows.filter(r => {
          const k = pickCountyKey(r);
          return k && normalizeCounty(k) === target;
        });
      } else {
        const target = normalizeMunicipality(place);
        rows = rows.filter(r => {
          const k = pickMunicipalityKey(r);
          return k && normalizeMunicipality(k) === target;
        });
      }
    }

    if (year && availableYears.includes(String(year))) {
      rows = rows.filter(r => String(getYearFromRow(r) ?? '') === String(year));
    }

    return rows;
  }, [raw, place, year, scope, availableYears]);

  // Clean rows & build columns list (Place + Year at front if present)
  const cleanedRows = useMemo(() => {
    if (!Array.isArray(filtered)) return [];
    return filtered.map(r => cleanRow(r, { scope, dataset }));
  }, [filtered, scope, dataset]);

  const columns = useMemo(() => {
    if (cleanedRows.length === 0) return [];
    const colSet = new Set();
    for (const r of cleanedRows) for (const k of Object.keys(r)) colSet.add(k);

    const all = Array.from(colSet);

    // Try to ensure place and year appear first if present
    const placeCandidates = scope === 'county'
      ? ['County', 'COUNTY', 'Name', 'NAME']
      : ['Municipality', 'MUNICIPALITY', 'MUNICIPALI', 'MUNI', 'MUN_NAME', 'NAME'];
    const yearCandidates = ['Year', 'year', 'YEAR'];

    const placeCol = placeCandidates.find(c => colSet.has(c));
    const yearCol = yearCandidates.find(c => colSet.has(c));

    const rest = all.filter(k => k !== placeCol && k !== yearCol).sort();
    const ordered = [];
    if (placeCol) ordered.push(placeCol);
    if (yearCol) ordered.push(yearCol);
    return ordered.concat(rest);
  }, [cleanedRows, scope]);

  // 🔔 Tell Map about current filters (choropleth uses fileUrl + metric + year)
  const lastSent = useRef(null);
  useEffect(() => {
    const payload = { scope, dataset, place, year, fileUrl, metric };
    if (!shallowEqual(lastSent.current, payload)) {
      onFilterChange?.(payload);
      lastSent.current = payload;
    }
  }, [scope, dataset, place, year, fileUrl, metric, onFilterChange]);

  // When scope flips, reset sensible defaults
  useEffect(() => {
    setDataset(scope === 'county' ? 'tenure-type' : 'energy-burden');
    setPlace('');
    setYear('');
  }, [scope]);

  // Also reset year when dataset changes
  useEffect(() => { setYear(''); }, [dataset]);

  const datasetOptions = scope === 'county' ? COUNTY_DATASETS : MUNI_DATASETS;

  return (
    <div className="map-info-box" style={{ color: '#111' }}>
      <h4 style={{ marginBottom: 2 }}>Data Browser
        <button
            type="button"
            className="ib-toggle-queried"
            onClick={() => setShowQueried(s => !s)}
          >
            {showQueried ? 'Hide Data' : 'Show Data'}
          </button>
          </h4> 

      {/* Controls */}
      <div className="control-row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>


        <label>
          <strong>Dataset:&nbsp;</strong>
          <select value={dataset} onChange={(e) => setDataset(e.target.value)}>
            {datasetOptions.map((key) => (
              <option key={key} value={key}>{key.replace(/-/g, ' ')}</option>
            ))}
          </select>
        </label>

        <label>
          <strong>{scope === 'county' ? 'County' : 'Municipality'}:&nbsp;</strong>
          <select value={place} onChange={(e) => setPlace(e.target.value)}>
            <option value="">All</option>
            {placeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>

        {availableYears.length > 0 && (
          <label>
            <strong>Year:&nbsp;</strong>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">All</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
        )}

        {metricOptions.length > 0 && (
          <label>
            <strong>Metric:&nbsp;</strong>
            <select value={metric} onChange={(e) => setMetric(e.target.value)}>
              {metricOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
        )}

        {/* JSON data confirmation */}
        {/*
        <button
          type="button"
          onClick={() => setShowRaw(s => !s)}
          style={{ marginLeft: 'auto', padding: '4px 8px' }}
        >
          
          {showRaw ? 'Hide JSON' : 'View JSON'}
        </button>
          */}
      </div>


      {/* File info */}
      {/*
      <div style={{ marginTop: 8, fontSize: 12, color: '#444' }}>
        <div><strong>File:</strong> {filename || '—'}</div>
        <div><strong>URL:</strong> {fileUrl || '—'}</div>
      </div>

*/}

      {/* Data */}
      <div style={{ marginTop: 10 }}>
        {status === 'loading' && <p style={{ color: '#333' }}>Loading JSON…</p>}
        {status === 'error' && <p style={{ color: '#b00' }}>Error: {error}</p>}

        {status === 'ready' && Array.isArray(cleanedRows) && cleanedRows.length > 0 && (
  <>
    {showQueried && (
      <>
        <div className="ib-table-wrap">
          <table className="ib-table">
            <thead>
              <tr>
                {columns.map(col => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {cleanedRows.slice(0, 150).map((r, i) => (
                <tr key={i}>
                  {columns.map(col => <td key={col}>{String(r[col] ?? '')}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showRaw && (
          <pre style={{
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 6,
            padding: 8,
            fontSize: 12,
            maxHeight: 280,
            overflow: 'auto',
            color: '#111',
            marginTop: 8
          }}>
            {JSON.stringify(cleanedRows, null, 2)}
          </pre>
        )}
      </>
    )}

   
  </>
)}


        {status === 'ready' && Array.isArray(cleanedRows) && cleanedRows.length === 0 && (
          <p style={{ color: '#666' }}>No rows after filtering.</p>
        )}
      </div>
    </div>
  );
}
