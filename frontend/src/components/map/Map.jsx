import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useBoundaries } from './hooks/useBoundaries';
import BoundaryLayer from './layers/BoundaryLayer';
import InfoBox from './panels/InfoBox';

import ChoroplethLayer from './layers/ChoroplethLayer';
import { useCountyChoropleth } from './hooks/useCountyChoropleth';
import { useMunicipalChoropleth } from './hooks/useMunicipalChoropleth';
import DynamicLegend from './panels/DynamicLegend';
import ObcChoroplethLayer from './layers/ObcChoroplethLayer';
import { useObcChoropleth } from './hooks/useObcChoropleth';
import { OBC_3CLASS } from './utils/colorScales'; // adjust path if needed

export default function Map() {
  const { municipalData, countyData } = useBoundaries();

  // Outline toggle: 'county' | 'municipal'
  const [outline, setOutline] = useState('county');
  const toggleOutline = () =>
    setOutline((prev) => (prev === 'county' ? 'municipal' : 'county'));
  const outlineData = outline === 'county' ? countyData : municipalData;

  // Filters coming from InfoBox
  const [filters, setFilters] = useState({
    scope: 'county',
    dataset: 'energy-burden',
    year: '',
    fileUrl: '',
    metric: '',
    place: '',
  });
  const handleFilterChange = useCallback((patch) => {
    setFilters((prev) => {
      const next = { ...prev, ...(patch || {}) };
      // shallow equality check to avoid pointless state updates
      const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
      for (const k of keys) if (prev[k] !== next[k]) return next;
      return prev; // no real change → no re-render
    });
  }, []);


  // County choropleth
  const usingCountyChoro =
    filters.scope === 'county' && !!filters.fileUrl && !!filters.metric;
  const {
    getFill: getFillCounty,
    hasData: hasCountyData,
    legend: countyLegend,
  } = useCountyChoropleth({
    fileUrl: usingCountyChoro ? filters.fileUrl : null,
    metricKey: usingCountyChoro ? filters.metric : null,
    year: usingCountyChoro ? filters.year : '',
  });

  // Municipal choropleth
  const usingMunicipalChoro =
    filters.scope === 'municipal' && !!filters.fileUrl && !!filters.metric;
  const {
    getFill: getFillMuni,
    hasData: hasMuniData,
    legend: muniLegend,
  } = useMunicipalChoropleth({
    fileUrl: usingMunicipalChoro ? filters.fileUrl : null,
    metricKey: usingMunicipalChoro ? filters.metric : null,
    year: usingMunicipalChoro ? filters.year : '',
  });

  /** OBC overlay state (toggle + metric + criteria filter) */
  const [showOBC, setShowOBC] = useState(false);
  const [obcCriteria, setObcCriteria] = useState(''); // '' = All
  const { data: obcData, getFill: getFillOBC, hasData: hasOBC, legend: obcLegend } =
    useObcChoropleth({ mode: '3class', criteria: obcCriteria });

  return (
    <>
      <div className="map-controls">
        <button
          className="map-toggle-button"
          onClick={toggleOutline}
          aria-label="Toggle outline between county and municipal"
          title="Toggle outline"
        >
          Outline: {outline === 'county' ? 'County' : 'Municipal'}
        </button>

        {/* OBC toggle + tiny filter block */}
        <div className="obc-toggle" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <label>
            <input
              type="checkbox"
              checked={showOBC}
              onChange={(e) => setShowOBC(e.target.checked)}
            />{' '}
            Over Burdened Communities
          </label>
          
        </div>
      </div>

      <MapContainer
        center={[40.0583, -74.4057]}
        zoom={7}
        className="map-wrapper"
        maxBounds={[
          [38.8, -75.6],
          [41.4, -73.8],
        ]}
        maxBoundsViscosity={1.0}
        minZoom={7}
        maxZoom={12}
      >
        <TileLayer
          attribution="&copy; CartoDB"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* County choropleth */}
        {outline === 'county' && countyData && usingCountyChoro && hasCountyData && (
          <ChoroplethLayer
            key={`choro-county-${filters.dataset}-${filters.metric}-${filters.year}`}
            data={countyData}
            getFill={getFillCounty}
            interactive={false}
          />
        )}

        {/* Municipal choropleth */}
        {outline === 'municipal' && municipalData && usingMunicipalChoro && hasMuniData && (
          <ChoroplethLayer
            key={`choro-muni-${filters.dataset}-${filters.metric}-${filters.year}`}
            data={municipalData}
            getFill={getFillMuni}
            interactive={false}
          />
        )}

        {/* OBC EJ overlay (drawn in its own pane so it sits above) */}
        {showOBC && hasOBC && obcData && (
          <ObcChoroplethLayer data={obcData} getFill={getFillOBC} visible />
        )}

        {/* Outline layer on top */}
        <BoundaryLayer
          key={`outline-${outline}-${outlineData?.features?.length || 0}`}
          type={outline}
          data={outlineData}
          onPick={() => { }}
        />
      </MapContainer>
      <div className="map-legend-stack">
        {/* OBC legend */}
        {showOBC && hasOBC && <DynamicLegend legend={obcLegend} />}

        {/* Legend (key) for whichever choropleth is active */}
        {outline === 'county' && usingCountyChoro && hasCountyData && (
          <DynamicLegend legend={countyLegend} />
        )}
        {outline === 'municipal' && usingMunicipalChoro && hasMuniData && (
          <DynamicLegend legend={muniLegend} />
        )}
      </div>
      <InfoBox scope={outline} onFilterChange={handleFilterChange} />
    </>
  );
}
