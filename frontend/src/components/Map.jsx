// Bug: Zooming removes navbar
import React, { useEffect, useState } from 'react'
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
                {/* Display chosen boundary */}
                {selectedBoundary === 'municipal' && municipalData && (
                    <GeoJSON
                        data={municipalData}
                        style={{ color: '#0077cc', weight: 1 }}
                        onEachFeature={(feature, layer) => {
                            const name = feature.properties?.MUNICIPALITY || feature.properties?.NAME;
                            layer.bindTooltip(name, {
                                sticky: true,
                                direction: 'top',
                                opacity: 0.9
                            });
                            layer.on({
                                click: () => setSelectedFeature({ type: 'Municipality', name }),
                            })
                        }}
                    />

                )}

                {selectedBoundary === 'county' && countyData && (
                    <GeoJSON
                        data={countyData}
                        style={{ color: '#cc3300', weight: 2 }}
                        onEachFeature={(feature, layer) => {
                            const name = feature.properties?.COUNTY || feature.properties?.NAME;
                            layer.bindTooltip(name, {
                                sticky: true,
                                direction: 'top',
                                opacity: 0.9
                            });
                            layer.on({
                                click: () => setSelectedFeature({ type: 'County', name }),
                            })
                        }}
                    />

                )}

                {selectedFeature && (
                    <div className="map-info-box">
                        <h4>{selectedFeature.type}: {selectedFeature.name}</h4>
                        <p>Not connected to database.</p>
                        <button onClick={() => setSelectedFeature(null)} className="map-close-button">
                            Close
                        </button>
                    </div>
                )}

            </MapContainer>
        </>
    )
}

export default Map
