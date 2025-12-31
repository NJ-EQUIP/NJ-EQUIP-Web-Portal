export const DEFAULT_CATEGORY = {
  'energy-burden': 'Energy Burden (% income)',
  'heating-fuel': 'Utility gas',
  'housing-built-year': 'Built 1970 to 1979',
  'income': '$50,000 to $59,999',
  'njcep-savings': 'Annual Electric Savings (kWh)',
  'race-ethnicity': 'Hispanic or Latino',
  'tenure-type': 'Owner occupied',
};

// normalize the weird leading spaces the source files use
const CLEAN = (s) => String(s || '').replace(/\u00A0/g, ' ').replace(/^\s+/, '').trim();

export function pickCountyKey(row) {
  // county names vary across files: "Bergen County", "Bergen", sometimes with spaces
  return CLEAN(
    row.Name || row.name || row.County || row.county
  ).replace(/\s+County$/i, '');
}

export function pickValue(dataset, row, categoryOverride) {
  const category = categoryOverride || DEFAULT_CATEGORY[dataset];

  switch (dataset) {
    case 'energy-burden':
      return Number(row['Energy Burden (% income)']); // overall % of income  :contentReference[oaicite:7]{index=7}

    case 'heating-fuel': {
      const key = `    ${category}`; // source columns are indented
      return Number((row[key] || row[CLEAN(key)] || '').toString().replace(/,/g, '')); //  :contentReference[oaicite:8]{index=8}
    }

    case 'housing-built-year': {
      const key = category.startsWith('Built') ? `    ${category}` : 'Total:';
      return Number((row[key] || row[CLEAN(key)] || '').toString().replace(/,/g, '')); //  :contentReference[oaicite:9]{index=9}
    }

    case 'income': {
      const key = category === 'Total:' ? 'Total:' : `    ${category}`;
      return Number((row[key] || row[CLEAN(key)] || '').toString().replace(/,/g, '')); //  :contentReference[oaicite:10]{index=10}
    }

    case 'njcep-savings': {
      const key = category; // already clean field names
      return Number((row[key] || '').toString().replace(/,/g, '')); //  :contentReference[oaicite:11]{index=11}
    }

    case 'race-ethnicity': {
      // Handle slight name variants, e.g., “Some Other Race alone” vs “Some other race alone”
      const candidates = [
        `    ${category}`,
        `    ${category.replace('Other', 'other')}`,
        `    ${category.replace('other', 'Other')}`
      ];
      const raw = candidates.map(k => row[k]).find(v => v != null) ?? '';
      return Number(raw.toString().replace(/,/g, '')); //  :contentReference[oaicite:12]{index=12}
    }

    case 'tenure-type': {
      const key = category === 'Total:' ? 'Total:' : `    ${category}`;
      return Number((row[key] || '').toString().replace(/,/g, '')); //  :contentReference[oaicite:13]{index=13}
    }

    default:
      return null;
  }
}

import { normalizeMunicipality } from './normalize';

// Default municipal category (for energy-consumption we start with total electricity)
export const DEFAULT_MUNI_CATEGORY = {
  'energy-consumption': 'Total Electricity (kWh)',
  'ghg-emissions': 'Total\nMTCO2e',
  'energy-burden': 'Energy Burden (%)',
};

const CLEAN_NUM = (x) => {
  if (x == null || x === '' || x === 'NDA' || x === 'CWC') return null;
  return Number(String(x).replace(/,/g, ''));
};

export function pickMunicipalityKey(row) {
  const raw =
    row.Municipality_clean ??
    row['Municipality_clean'] ??
    row.Municipality ??
    row['﻿Municipality']; // BOM-safe
  return normalizeMunicipality(raw);
}

export function pickMunicipalValue(dataset, row, categoryOverride) {
  const category = categoryOverride || DEFAULT_MUNI_CATEGORY[dataset];

  switch (dataset) {
    case 'energy-consumption': {
      // Categories we’ll support out of the box
      const candidates = [
        category,                    // "Total Electricity (kWh)" or "Total Natural Gas (Therms)"
        `    ${category}`,           // some files indent categories
      ];
      const raw = candidates.map(k => row[k]).find(v => v != null);
      return CLEAN_NUM(raw); // 2016–2023 values provided in your files
    }

    case 'ghg-emissions': {
      // Total line has a newline in the header in your file: "Total\nMTCO2e"
      const raw =
        row['Total\nMTCO2e'] ??
        row['Total MTCO2e'] ??       // fallback if cleaned later
        row[category];
      return CLEAN_NUM(raw);
    }

    case 'energy-burden': {
      const raw = row['Energy Burden (%)'] ?? row[category];
      return raw == null || raw === '' ? null : Number(raw);
    }

    default:
      return null;
  }
}
