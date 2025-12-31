import { useEffect, useMemo, useState } from 'react';
import { datasetFileMap, municipalDatasetFileMap } from '../constants/datasets';
import { getFillFor, prettyLabel } from '../utils/colorScales';
import { countyDatasetNeedsYear, municipalDatasetNeedsYear } from '../utils/needsYear';
import {
  pickCountyKey,
  pickValue as pickCountyValue,
  pickMunicipalityKey,
  pickMunicipalValue
} from '../utils/accessors';
import { normalizeCounty, normalizeMunicipality } from '../utils/normalize';

export function useChoropleth({ boundaryType, dataset, year, category }) {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // When using muni-specific bins, still read/access using the base dataset
  const accessorDataset =
    dataset === 'energy-burden-muni' ? 'energy-burden' : dataset;

  const filename = useMemo(() => {
    if (boundaryType === 'county') return datasetFileMap[accessorDataset];
    if (boundaryType === 'municipal') return municipalDatasetFileMap[accessorDataset];
    return undefined;
  }, [boundaryType, accessorDataset]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setErr(null);
      try {
        if (!filename) { setRows(null); return; }

        // Subpath-safe base: works locally, Netlify, GH Pages, etc.
        const base = new URL(
          boundaryType === 'county'
            ? 'data/county-filters/'
            : 'data/muni-filters/',
          import.meta.env.BASE_URL
        ).toString();

        const res = await fetch(`${base}${filename}`);
        const all = await res.json();

        const needsYear = boundaryType === 'county'
          ? countyDatasetNeedsYear(accessorDataset)
          : municipalDatasetNeedsYear(accessorDataset);

        // '' (empty string) = "All years" => do NOT filter by year
        const hasYearValue = !(year == null || year === '');
        const filtered = (needsYear && hasYearValue)
          ? all.filter(r => String(r.year ?? r.Year ?? r.YEAR) === String(year))
          : all;

        if (!cancelled) setRows(filtered);
      } catch (e) {
        if (!cancelled) setErr(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [boundaryType, accessorDataset, year, filename]);

  // Derive a list of county-level categories (handles indented + cleaned headers)
  const countyCategories = useMemo(() => {
    if (boundaryType !== 'county' || !rows?.length) return [];
    const first = rows[0] || {};

    // tenure-type, income, housing-built-year, heating-fuel, race-ethnicity use “indented” cols
    const indented = Object.keys(first)
      .filter(k => /^ {2,}/.test(k))          // keys that start with spaces
      .map(k => k.replace(/^\s+/, ''))        // strip leading spaces
      .filter(k => k !== 'Total:');

    // If file already cleaned: include non-indented candidates too
    const cleaned = Object.keys(first)
      .filter(k =>
        !/^ {2,}/.test(k) &&
        k !== 'Total:' &&
        /occupied|Built|Utility|Hispanic|owner|renter|gas|electric|Total Electricity|Therms|MTCO2e/i.test(k)
      );

    const seen = new Set();
    return [...indented, ...cleaned].filter(k => (seen.has(k) ? false : (seen.add(k), true)));
  }, [boundaryType, rows]);

  const valueMap = useMemo(() => {
    const map = new Map();
    if (!rows) return map;

    if (boundaryType === 'county') {
      const needsYear = countyDatasetNeedsYear(accessorDataset);
      const useAllYears = needsYear && (year == null || year === '');

      if (useAllYears) {
        // Aggregate across ALL years per county (sum) so the map colors by default.
        for (const r of rows) {
          const key = normalizeCounty(pickCountyKey(r));
          const v = pickCountyValue(accessorDataset, r, category);
          if (!key || v == null || Number.isNaN(v)) continue;
          map.set(key, (map.get(key) || 0) + Number(v));
        }
      } else {
        // Single-year values (rows already filtered above when year chosen)
        for (const r of rows) {
          const key = normalizeCounty(pickCountyKey(r));
          const v = pickCountyValue(accessorDataset, r, category);
          if (key && v != null && !Number.isNaN(v)) map.set(key, Number(v));
        }
      }
    } else {
      for (const r of rows) {
        const key = normalizeMunicipality(pickMunicipalityKey(r));
        const v = pickMunicipalValue(accessorDataset, r, category);
        if (key && v != null && !Number.isNaN(v)) map.set(key, Number(v));
      }
    }
    return map;
  }, [rows, boundaryType, accessorDataset, category, year]);

  function getFill(feature) {
    const name = boundaryType === 'county'
      ? normalizeCounty(feature.properties?.COUNTY || feature.properties?.NAME)
      : normalizeMunicipality(feature.properties?.MUNICIPALITY || feature.properties?.NAME);

    const v = valueMap.get(name);
    // IMPORTANT: color by the *original* dataset key (so muni can use distinct bins)
    return getFillFor(dataset, v);
  }

  // Legend title: append "— All years" when we’re aggregating county data
  const legendTitle = useMemo(() => {
    const needsYear = boundaryType === 'county' && countyDatasetNeedsYear(accessorDataset);
    const useAllYears = needsYear && (year == null || year === '');
    return prettyLabel(accessorDataset, category) + (useAllYears ? ' — All years' : '');
  }, [boundaryType, accessorDataset, category, year]);

  return {
    loading,
    error: err,
    hasData: valueMap.size > 0,
    getFill,
    legendTitle,
    countyCategories,
  };
}
