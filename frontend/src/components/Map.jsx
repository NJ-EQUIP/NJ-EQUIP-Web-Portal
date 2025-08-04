// Bug: Zooming removes navbar
// Re-organize into loop/state folder to minimize clutter
import React, { useRef, useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
//import * as turf from '@turf/turf'

const municipalURL = 'https://services2.arcgis.com/XVOqAjTOJ5P6ngMu/arcgis/rest/services/NJ_Municipal_Boundaries_3424/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson'
const countyURL = 'https://services2.arcgis.com/XVOqAjTOJ5P6ngMu/arcgis/rest/services/NJ_Counties_3424/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson'

function Map() {
    const [municipalData, setMunicipalData] = useState(null)
    const [countyData, setCountyData] = useState(null)
    //const [maskLayer, setMaskLayer] = useState(null)
    const [selectedBoundary, setSelectedBoundary] = useState('county')
    const [selectedFeature, setSelectedFeature] = useState(null)
    // Data
    const [countyInfo, setCountyInfo] = useState(null)
    const [selectedDataset, setSelectedDataset] = useState('energy-burden')
    const selectedDatasetRef = useRef(selectedDataset)
    const [selectedYear, setSelectedYear] = useState('2023')

    useEffect(() => {
        selectedDatasetRef.current = selectedDataset;
    }, [selectedDataset]);

    const datasetOptions = [
        'energy-burden',
        'housing-built-year',
        'heating-fuel',
        'njcep-savings',
        'tenure-type',
        'race-ethnicity',
        'income'
    ]

    useEffect(() => {
        fetch(municipalURL)
            .then(res => res.json())
            .then(data => {
                setMunicipalData(data)
            })

        fetch(countyURL)
            .then(res => res.json())
            .then(data => setCountyData(data))
    }, [])
    /*
        const buildMask = (boundaryGeoJSON) => {
            const njUnion = turf.union(...boundaryGeoJSON.features.map(f => turf.buffer(f, 0))) // buffer fixes any geometry issues
    
            const worldBounds = turf.bboxPolygon([-180, -90, 180, 90])
            const mask = turf.difference(worldBounds, njUnion)
    
            setMaskLayer(mask)
        }
    */
    const handleBoundaryToggle = () => {
        setSelectedBoundary(prev => (prev === 'municipal' ? 'county' : 'municipal'))
    }

    useEffect(() => {
        if (!selectedFeature || selectedFeature.type !== 'County') return

        const fetchCountyData = async () => {
            setCountyInfo(null)
            const dataset = selectedDatasetRef.current
            try {
                const response = await fetch(
                    `http://localhost:5050/api/county-filters/${dataset}?county=${encodeURIComponent(selectedFeature.name)}&year=${selectedYear}`
                )
                const data = await response.json()
                setCountyInfo(data)
            } catch (err) {
                console.error('Failed to load county info:', err)
                setCountyInfo({ error: 'Failed to fetch data' })
            }
        }

        fetchCountyData()
    }, [selectedFeature, selectedDataset, selectedYear])

    return (
        <>
            <button onClick={handleBoundaryToggle} className="map-toggle-button">
                Toggle: {selectedBoundary === 'municipal' ? 'County' : 'Municipal'}
            </button>

            <MapContainer
                center={[40.0583, -74.4057]}
                zoom={7}
                style={{ height: '100vh', width: '100%' }}
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
                            layer.bindTooltip(name, {
                                sticky: true,
                                direction: 'top',
                                opacity: 0.9
                            })
                            layer.on({
                                click: () => setSelectedFeature({ type: 'Municipality', name })
                            })
                        }}
                    />
                )}

                {selectedBoundary === 'county' && countyData && (
                    <GeoJSON
                        data={countyData}
                        style={{ color: '#cc3300', weight: 2 }}
                        onEachFeature={(feature, layer) => {
                            const name = feature.properties?.COUNTY || feature.properties?.NAME
                            layer.bindTooltip(name, {
                                sticky: true,
                                direction: 'top',
                                opacity: 0.9
                            })
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

                        <label>
                            Dataset:&nbsp;
                            <select value={selectedDataset} onChange={(e) => setSelectedDataset(e.target.value)}>
                                {datasetOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option.replace(/-/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label style={{ marginLeft: '10px' }}>
                            Year:&nbsp;
                            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                {Array.from({ length: 2023 - 2009 + 1 }, (_, i) => 2009 + i).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <h5 style={{ marginTop: '10px' }}>
                            {selectedDataset.replace(/-/g, ' ').toUpperCase()} – {selectedYear}
                        </h5>

                        {countyInfo ? (
                            Array.isArray(countyInfo) && countyInfo.length > 0 ? (
                                <ul>
                                    {Object.entries(countyInfo[0]).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No data found for this county.</p>
                            )
                        ) : (
                            <p>Loading data...</p>
                        )}

                        <button
                            onClick={() => {
                                setSelectedFeature(null)
                                setCountyInfo(null)
                            }}
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