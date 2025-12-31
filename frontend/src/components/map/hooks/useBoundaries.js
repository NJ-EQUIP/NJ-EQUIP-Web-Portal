import { useEffect, useState } from 'react';

const COUNTY_GEOJSON_URL =
  'https://services2.arcgis.com/XVOqAjTOJ5P6ngMu/arcgis/rest/services/NJ_Counties_3424/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson';

const MUNICIPAL_GEOJSON_URL =
  'https://services2.arcgis.com/XVOqAjTOJ5P6ngMu/arcgis/rest/services/NJ_Municipal_Boundaries_3424/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson';

export function useBoundaries() {
  const [countyData, setCountyData] = useState(null);
  const [municipalData, setMunicipalData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      try {
        const [countyRes, muniRes] = await Promise.all([
          fetch(COUNTY_GEOJSON_URL, { signal: ac.signal }),
          fetch(MUNICIPAL_GEOJSON_URL, { signal: ac.signal }),
        ]);
        if (!countyRes.ok) throw new Error(`County fetch failed: ${countyRes.status}`);
        if (!muniRes.ok) throw new Error(`Municipal fetch failed: ${muniRes.status}`);

        const [countyJson, muniJson] = await Promise.all([
          countyRes.json(),
          muniRes.json(),
        ]);

        console.log('[useBoundaries] county features:', countyJson?.features?.length);
        console.log('[useBoundaries] municipal features:', muniJson?.features?.length);

        setCountyData(countyJson);
        setMunicipalData(muniJson);
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error('[useBoundaries] fetch error', e);
          setError(e);
        }
      }
    }

    load();
    return () => ac.abort();
  }, []);

  return { countyData, municipalData, error };
}
