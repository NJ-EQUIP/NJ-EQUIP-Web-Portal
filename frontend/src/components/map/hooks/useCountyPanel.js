import { useEffect, useState, useRef } from 'react';
import { datasetFileMap } from '../constants/datasets';
import { extractYears } from '../utils/extractYears';
import { normalizeCounty } from '../utils/normalize';
import { pickCountyKey } from '../utils/accessors';

export function useCountyPanel(selectedDataset, selectedFeature, selectedYear) {
  const [countyAvailableYears, setCountyAvailableYears] = useState([]);
  const [countyInfo, setCountyInfo] = useState(null);
  const dsRef = useRef(selectedDataset);

  useEffect(() => { dsRef.current = selectedDataset; }, [selectedDataset]);

  // compute available years when a county is selected
  useEffect(() => {
    if (!selectedFeature || selectedFeature.type !== 'County') {
      setCountyAvailableYears([]);
      return;
    }
    (async () => {
      try {
        const filename = datasetFileMap[selectedDataset];
        if (!filename) return setCountyAvailableYears([]);
        // Keep absolute path to avoid BASE_URL issues for now
        const res = await fetch(`/data/county-filters/${filename}`);
        const rows = await res.json();
        setCountyAvailableYears(extractYears(rows));
      } catch {
        setCountyAvailableYears([]);
      }``
    })();
  }, [selectedFeature, selectedDataset]);

  // filter county rows — if the chosen year isn't in the data, DON'T filter by year
  useEffect(() => {
    if (!selectedFeature || selectedFeature.type !== 'County') return;
    (async () => {
      setCountyInfo(null);
      try {
        const filename = datasetFileMap[dsRef.current];
        if (!filename) throw new Error('No filename for dataset');
        const res = await fetch(`/data/county-filters/${filename}`);
        const rows = await res.json();

        const normalizedSelected = normalizeCounty(selectedFeature.name || '');
        const canFilterByYear = countyAvailableYears.includes(String(selectedYear));

        const out = rows.filter(row => {
          const rc = pickCountyKey(row) || row.Name || row.name || row.County || row.county;
          const ry = row.year || row.Year || row.YEAR;
          const matchesCounty = rc && normalizeCounty(rc) === normalizedSelected;
          const matchesYear = !canFilterByYear || (ry && String(ry) === String(selectedYear));
          return matchesCounty && matchesYear;
        });

        setCountyInfo(out);
      } catch {
        setCountyInfo({ error: 'Failed to fetch data' });
      }
    })();
  }, [selectedFeature, selectedDataset, selectedYear, countyAvailableYears]);

  return { countyAvailableYears, countyInfo };
}
