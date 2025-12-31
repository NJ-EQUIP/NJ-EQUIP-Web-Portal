import { useEffect, useState, useRef } from 'react';
import { municipalDatasetFileMap, MUNI_YEARS } from '../constants/datasets';
import { normalizeMunicipality } from '../utils/normalize';

export function useMunicipalPanel(selectedDataset, selectedFeature, selectedYear) {
  const [municipalInfo, setMunicipalInfo] = useState(null);
  const dsRef = useRef(selectedDataset);
  useEffect(() => { dsRef.current = selectedDataset; }, [selectedDataset]);

  useEffect(() => {
    if (!selectedFeature || selectedFeature.type !== 'Municipality') return;
    (async () => {
      setMunicipalInfo(null);
      try {
        const filename = municipalDatasetFileMap[dsRef.current];
        if (!filename) throw new Error('No municipal filename for dataset');
        const base = new URL('data/muni-filters/', import.meta.env.BASE_URL).toString();
        const res = await fetch(`${base}${filename}`);
        const rows = await res.json();

        const target = normalizeMunicipality(selectedFeature.name);
        const needsYear = dsRef.current === 'energy-consumption';

        const out = rows.filter(row => {
          const rM =
            row.Municipality_clean ||
            row['Municipality_clean'] ||
            row.Municipality ||
            row['﻿Municipality'];
          const rY = row.year || row.Year || row.YEAR;

          const okName = rM && (normalizeMunicipality(rM) === target);
          if (!needsYear) return okName;

          if (rY == null) return false;
          const y = String(rY);
          return okName && MUNI_YEARS.includes(y) && y === String(selectedYear);
        });

        setMunicipalInfo(out);
      } catch {
        setMunicipalInfo({ error: 'Failed to fetch data' });
      }
    })();
  }, [selectedFeature, selectedDataset, selectedYear]);

  return { municipalInfo };
}
