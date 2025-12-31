// Starter color ramps + bins for each dataset.
// Adjust bins as you like (or swap to quantiles later).
export const RAMP = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#E31A1C', '#BD0026']; // 6 buckets

// Thresholds are inclusive of the upper bound in the legend display.
// Bins length can be <= ramp length; we clamp automatically.
export const BINS = {
  'energy-burden': [0, 5, 10, 15, 20, 30],                 // % of income
  'heating-fuel': [0, 1_000, 10_000, 25_000, 50_000, 100_000, 250_000], // counts
  'housing-built-year': [0, 5_000, 10_000, 20_000, 40_000, 80_000],     // counts
  'income': [0, 10_000, 25_000, 50_000, 100_000, 200_000],             // counts
  'njcep-savings': [0, 50_000, 100_000, 250_000, 500_000, 1_000_000],  // kWh
  'race-ethnicity': [0, 5_000, 10_000, 25_000, 50_000, 100_000],       // counts
  'tenure-type': [0, 10_000, 25_000, 50_000, 100_000, 150_000],        // counts
  // MUNICIPAL starts here:
  'energy-consumption': [0, 5e6, 2e7, 5e7, 1e8, 2e8, 5e8],
  'ghg-emissions': [0, 2e4, 5e4, 1e5, 2.5e5, 5e5, 1e6],
  'energy-burden-muni': [0, 1, 2, 3, 4, 6, 10],
};

// Three-class OBC palette for categorical overlay
export const OBC_3CLASS = {
  labels: ['Low income', 'Minority', 'Low income & minority'],
  colors: ['#2b8cbe', '#26de63ff', '#6a51a3'], // blue, red, purple
};

export function getFillFor(dataset, value) {
  if (value == null || Number.isNaN(value)) return '#f7f7f7';
  const bins = BINS[dataset] || [];
  let i = 0;
  while (i < bins.length && value > bins[i]) i++;
  const idx = Math.min(i, RAMP.length - 1);
  return RAMP[idx];
}

// Pretty label for legend title
export function prettyLabel(dataset, category) {
  const base = dataset.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return category ? `${base} — ${category}` : base;
}

// Format a range "from – to"
export function formatRange(from, to) {
  const fmt = (n) => Number.isFinite(n) ? n.toLocaleString() : '';
  return Number.isFinite(to) ? `${fmt(from)} – ${fmt(to)}` : `${fmt(from)}+`;
}
