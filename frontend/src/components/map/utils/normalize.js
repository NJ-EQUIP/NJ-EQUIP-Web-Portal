export const normalizeCounty = (s) =>
  s?.toLowerCase().replace(/\s*county\s*$/, '').trim();

export const normalizeMunicipality = (s = '') =>
  s.toLowerCase().replace(/\s+(city|borough|boro\.?|twp\.?|township|village)$/g, '').trim();
