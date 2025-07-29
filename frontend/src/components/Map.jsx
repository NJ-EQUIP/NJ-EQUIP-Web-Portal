import React from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { bboxPolygon, union, difference } from '@turf/turf'
import 'leaflet/dist/leaflet.css'

function Map({ geoData }) {
    //if (!geoData) return null
    //console.log("GeoData:", geoData)
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

    );
}

export default Map
