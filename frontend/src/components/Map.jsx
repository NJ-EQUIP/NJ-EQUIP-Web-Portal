import React, { useEffect, useState }  from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { bboxPolygon, union, difference } from '@turf/turf'
import 'leaflet/dist/leaflet.css'

function Map() {
    const [geoData, setGeoData] = useState(null)

    useEffect(() => {
        fetch('https://services2.arcgis.com/XVOqAjTOJ5P6ngMu/arcgis/rest/services/NJ_Municipal_Boundaries_3424/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson')
            .then(res => res.json())
            .then(data => setGeoData(data))
            .catch(err => console.error('Failed to load GeoJSON:', err))
    }, [])

    return (
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
            {geoData && <GeoJSON data={geoData} />}
        </MapContainer>
    )
}

export default Map
