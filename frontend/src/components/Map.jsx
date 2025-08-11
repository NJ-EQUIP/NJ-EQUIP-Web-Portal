// Bug: Zooming removes navbar
// Re-organize into loop/state folder to minimize clutter
import React, { useRef, useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const municipalURL = 'https://services2.arcgis.com/XVOqAjTOJ5P6ngMu/arcgis/rest/services/NJ_Municipal_Boundaries_3424/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson'
const countyURL = 'https://services2.arcgis.com/XVOqAjTOJ5P6ngMu/arcgis/rest/services/NJ_Counties_3424/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson'

const datasetFileMap = {
    'energy-burden': 'Energy-Burden-County.json',
    'housing-built-year': 'housing_built_year.json',
    'heating-fuel': 'heating-fuel.json',
    'income': 'income.json',
    'njcep-savings': 'njcep_with_savings.json',
    'race-ethnicity': 'race_ethnicity_hispanic_latino.json',
    'tenure-type': 'tenure_type.json'
}

const municipalDatasetFileMap = {
    'energy-burden': 'energy_burden_output_NEW.json',
    'energy-consumption': 'Utility_Consumptio.json',
    'ghg-emissions': 'Community-Scale_GHG_Emissions_07.25.24.json'
}

// ---- helpers ----
const normalizeCounty = (str) =>
    str?.toLowerCase().replace(/\s*county\s*$/, '').trim()

const normalizeMunicipality = (str) =>
    (str || '')
        .toLowerCase()
        .replace(/\s+(city|borough|boro\.?|twp\.?|township|village)$/g, '')
        .trim()

const MUNI_YEARS = Array.from({ length: 2023 - 2016 + 1 }, (_, i) => (2016 + i).toString());

// Extract unique, sorted years from a dataset file
const extractYears = (rows) => {
    const years = new Set(
        rows
            .map(r => (r.year ?? r.Year ?? r.YEAR))
            .filter(y => y !== undefined && y !== null && y !== '' && y !== 'NDA')
            .map(String)
    );
    return [...years].sort((a, b) => Number(a) - Number(b));
};


function Map() {
    const [municipalData, setMunicipalData] = useState(null)
    const [countyData, setCountyData] = useState(null)

    const [selectedBoundary, setSelectedBoundary] = useState('county')
    const [selectedFeature, setSelectedFeature] = useState(null)

    // Data panels
    const [countyInfo, setCountyInfo] = useState(null)
    const [municipalInfo, setMunicipalInfo] = useState(null)

    const [selectedDataset, setSelectedDataset] = useState('energy-burden')
    const selectedDatasetRef = useRef(selectedDataset)
    const [selectedYear, setSelectedYear] = useState('2023')

    const [countyAvailableYears, setCountyAvailableYears] = useState([]);


    useEffect(() => {
        selectedDatasetRef.current = selectedDataset
    }, [selectedDataset])

    const datasetOptions = [
        'energy-burden',
        'housing-built-year',
        'heating-fuel',
        'njcep-savings',
        'tenure-type',
        'race-ethnicity',
        'income'
    ]

    // Load boundaries
    useEffect(() => {
        fetch(municipalURL).then(r => r.json()).then(setMunicipalData)
        fetch(countyURL).then(r => r.json()).then(setCountyData)
    }, [])

    const handleBoundaryToggle = () => {
        setSelectedBoundary(prev => (prev === 'municipal' ? 'county' : 'municipal'))
        setSelectedFeature(null)
        setCountyInfo(null)
        setMunicipalInfo(null)
    }

    // ---- COUNTY info fetcher (top-level) ----
    useEffect(() => {
        // Only matters for county panel
        if (!selectedFeature || selectedFeature.type !== 'County') {
            setCountyAvailableYears([]);
            return;
        }

        const loadYears = async () => {
            try {
                const filename = datasetFileMap[selectedDataset];
                if (!filename) {
                    setCountyAvailableYears([]);
                    return;
                }
                const res = await fetch(`/data/county-filters/${filename}`);
                const allRows = await res.json();
                const years = extractYears(allRows);

                setCountyAvailableYears(years);

                // If current selectedYear isn't in list, snap to the max year (or clear if none)
                if (years.length > 0 && !years.includes(String(selectedYear))) {
                    setSelectedYear(years[years.length - 1]); // latest
                }
            } catch (e) {
                console.error('Failed to compute county years', e);
                setCountyAvailableYears([]);
            }
        };

        loadYears();
    }, [selectedFeature, selectedDataset]);

    // ---- COUNTY rows fetcher (uses dynamic years) ----
    useEffect(() => {
        if (!selectedFeature || selectedFeature.type !== 'County') return;

        const fetchCountyData = async () => {
            setCountyInfo(null);
            const dataset = selectedDatasetRef.current;

            try {
                const filename = datasetFileMap[dataset];
                if (!filename) throw new Error(`No filename mapping for dataset: ${dataset}`);

                const res = await fetch(`/data/county-filters/${filename}`);
                const allData = await res.json();

                const filtered = allData.filter((row) => {
                    const rowCounty = row.Name || row.name || row.County || row.county;
                    const rowYear = row.year || row.Year || row.YEAR;

                    const matchesCounty =
                        rowCounty && normalizeCounty(rowCounty) === normalizeCounty(selectedFeature.name);

                    // Only enforce year if this dataset actually has year values
                    const needsYear = countyAvailableYears.length > 0;
                    const matchesYear = !needsYear || (rowYear && String(rowYear) === String(selectedYear));

                    return matchesCounty && matchesYear;
                });

                setCountyInfo(filtered);
            } catch (err) {
                console.error('Failed to load county info:', err);
                setCountyInfo({ error: 'Failed to fetch data' });
            }
        };

        fetchCountyData();
    }, [selectedFeature, selectedDataset, selectedYear, countyAvailableYears]);



    // ---- MUNICIPAL info fetcher (top-level) ----
    useEffect(() => {
        if (!selectedFeature || selectedFeature.type !== 'Municipality') return;

        const fetchMunicipalData = async () => {
            setMunicipalInfo(null);
            const dataset = selectedDatasetRef.current;

            try {
                const filename = municipalDatasetFileMap[dataset];
                if (!filename) throw new Error(`No municipal filename for dataset: ${dataset}`);

                const res = await fetch(`/data/muni-filters/${filename}`);
                const allData = await res.json();

                const targetName = normalizeMunicipality(selectedFeature.name);
                const needsYear = dataset === 'energy-consumption'; // ONLY this dataset uses year

                const filtered = allData.filter(row => {
                    const rowMuni =
                        row.Municipality_clean ||
                        row['Municipality_clean'] ||
                        row.Municipality ||
                        row['﻿Municipality'];

                    const rowYear = row.year || row.Year || row.YEAR;
                    const matchesMuni = rowMuni && (normalizeMunicipality(rowMuni) === targetName);

                    if (!needsYear) return matchesMuni; // energy-burden, ghg-emissions → ignore year entirely

                    // energy-consumption: enforce year and restrict to 2016–2023
                    if (rowYear == null) return false;
                    const y = rowYear.toString();
                    const inRange = MUNI_YEARS.includes(y);
                    const matchesYear = y === selectedYear;
                    return matchesMuni && inRange && matchesYear;
                });

                setMunicipalInfo(filtered);
            } catch (err) {
                console.error('Failed to load municipal info:', err);
                setMunicipalInfo({ error: 'Failed to fetch data' });
            }
        };

        fetchMunicipalData();
    }, [selectedFeature, selectedDataset, selectedYear]);


    return (
        <>
            <button onClick={handleBoundaryToggle} className="map-toggle-button">
                Toggle: {selectedBoundary === 'municipal' ? 'County' : 'Municipal'}
            </button>

            <MapContainer
                center={[40.0583, -74.4057]}
                zoom={7}
                // Avoid covering the header: see CSS note below
                style={{ height: 'calc(100vh - 120px)', width: '100%' }}
                maxBounds={[[38.8, -75.6], [41.4, -73.8]]}
                maxBoundsViscosity={1.0}
                minZoom={7}
                maxZoom={12}
            >
                <TileLayer
                    attribution='&copy; CartoDB'
                    url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                />

                {selectedBoundary === 'municipal' && municipalData && (
                    <GeoJSON
                        data={municipalData}
                        style={{ color: '#0077cc', weight: 1 }}
                        onEachFeature={(feature, layer) => {
                            const name = feature.properties?.MUNICIPALITY || feature.properties?.NAME
                            layer.bindTooltip(name, { sticky: true, direction: 'top', opacity: 0.9 })
                            layer.on({ click: () => setSelectedFeature({ type: 'Municipality', name }) })
                        }}
                    />
                )}

                {selectedBoundary === 'county' && countyData && (
                    <GeoJSON
                        data={countyData}
                        style={{ color: '#cc3300', weight: 2 }}
                        onEachFeature={(feature, layer) => {
                            const name = feature.properties?.COUNTY || feature.properties?.NAME
                            layer.bindTooltip(name, { sticky: true, direction: 'top', opacity: 0.9 })
                            layer.on({
                                click: () => {
                                    setSelectedFeature({ type: 'County', name })
                                    setCountyInfo(null)
                                }
                            })
                        }}
                    />
                )}
            </MapContainer>

            {/* Always-visible Info Box */}
            <div className="map-info-box">
                {selectedFeature?.type === 'County' ? (
                    <>
                        <h4>County: {selectedFeature.name}</h4>

                        {/* County controls */}
                        <label>
                            Dataset:&nbsp;
                            <select value={selectedDataset} onChange={(e) => setSelectedDataset(e.target.value)}>
                                {datasetOptions.map((option) => (
                                    <option key={option} value={option}>{option.replace(/-/g, ' ')}</option>
                                ))}
                            </select>
                        </label>

                        {/* Show year only if this dataset actually has years */}
                        {countyAvailableYears.length > 0 && (
                            <label style={{ marginLeft: '10px' }}>
                                Year:&nbsp;
                                <select
                                    value={String(selectedYear)}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    {countyAvailableYears.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </label>
                        )}

                        <h5 style={{ marginTop: '10px' }}>
                            {selectedDataset.replace(/-/g, ' ').toUpperCase()}
                            {countyAvailableYears.length > 0 ? ` – ${selectedYear}` : ''}
                        </h5>

                        {countyInfo ? (
                            Array.isArray(countyInfo) && countyInfo.length > 0 ? (
                                <ul>
                                    {Object.entries(countyInfo[0]).map(([key, value]) => (
                                        <li key={key}><strong>{key}:</strong> {String(value)}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No data found for this county.</p>
                            )
                        ) : (
                            <p>Loading data...</p>
                        )}

                        <button
                            onClick={() => { setSelectedFeature(null); setCountyInfo(null) }}
                            className="map-close-button"
                        >
                            Clear
                        </button>
                    </>
                ) : selectedFeature?.type === 'Municipality' ? (
                    <>
                        <h4>Municipality: {selectedFeature.name}</h4>

                        <label>
                            Dataset:&nbsp;
                            <select value={selectedDataset} onChange={(e) => setSelectedDataset(e.target.value)}>
                                {['energy-burden', 'energy-consumption', 'ghg-emissions'].map(option => (
                                    <option key={option} value={option}>{option.replace(/-/g, ' ')}</option>
                                ))}
                            </select>
                        </label>

                        {/* Year selector ONLY for energy-consumption; 2016–2023 */}
                        {selectedDataset === 'energy-consumption' && (
                            <label style={{ marginLeft: '10px' }}>
                                Year:&nbsp;
                                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                    {MUNI_YEARS.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </label>
                        )}

                        <h5 style={{ marginTop: '10px' }}>
                            {selectedDataset.replace(/-/g, ' ').toUpperCase()}
                            {selectedDataset === 'energy-consumption' ? ` – ${selectedYear}` : ''}
                        </h5>

                        {municipalInfo ? (
                            Array.isArray(municipalInfo) && municipalInfo.length > 0 ? (
                                <ul>
                                    {Object.entries(municipalInfo[0]).map(([key, value]) => (
                                        <li key={key}><strong>{key}:</strong> {String(value)}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No data found for this municipality.</p>
                            )
                        ) : (
                            <p>Loading data...</p>
                        )}

                        <button
                            onClick={() => { setSelectedFeature(null); setMunicipalInfo(null) }}
                            className="map-close-button"
                        >
                            Clear
                        </button>
                    </>
                ) : (
                    <p><strong>Use Map</strong> to view filters and data.</p>
                )}
            </div>
        </>
    )
}

export default Map
