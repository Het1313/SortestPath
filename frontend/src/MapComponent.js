import React, { useMemo, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as polyline from "@mapbox/polyline";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom icons for Source & Destination
const sourceIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -35],
});

const destinationIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -35],
});

const MapComponent = forwardRef(({ source, destination, routes, mapBounds, selectedRouteIndex, routeColors, center }, ref) => {
  const fitBoundsOptions = useMemo(() => ({
    padding: [70, 70], // Increased padding for better visibility
  }), []);

  const [decodedPolylines, setDecodedPolylines] = useState([]);
  

  useEffect(() => {
    if (routes.length > 0) {
      setDecodedPolylines(routes.map(route => {
        if (!route.geometry) return [];
        try {
          const decodedCoords = polyline.decode(route.geometry);
          return decodedCoords.map(coord => [coord[0], coord[1]]);
        } catch (error) {
          console.error("Error decoding polyline:", error);
          return [];
        }
      }));
    } else {
      setDecodedPolylines([]);
    }
  }, [routes]);

  

  return (
    <div className="map-container">
       <MapContainer center={center} zoom={12} style={{ height: "500px", width: "100%" }}>
      <MapHook center = {center} bounds = {mapBounds}/>
        {/* ✅ Original OpenStreetMap (Shows Labels, Roads, and Surroundings) */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* ✅ Ensure valid routes exist before accessing index [0] */}
        {routes.length > 0 && selectedRouteIndex < routes.length && routes[selectedRouteIndex]?.geometry?.coordinates && (
          <>
            {/* 📍 Source Marker */}
            <Marker
              position={[
                routes[selectedRouteIndex].geometry.coordinates[0][1],
                routes[selectedRouteIndex].geometry.coordinates[0][0],
              ]}
              icon={sourceIcon}
            />

            {/* 📌 Destination Marker */}
            <Marker
              position={[
                routes[selectedRouteIndex].geometry.coordinates[routes[selectedRouteIndex].geometry.coordinates.length - 1][1],
                routes[selectedRouteIndex].geometry.coordinates[routes[selectedRouteIndex].geometry.coordinates.length - 1][0],
              ]}
              icon={destinationIcon}
            />
          </>
        )}

        {/* ✅ Route Display */}
        {decodedPolylines.length > 0 && decodedPolylines[selectedRouteIndex] && (
          <Polyline positions={decodedPolylines[selectedRouteIndex]} color={routeColors[selectedRouteIndex % routeColors.length]} weight={5} />
        )}
         </MapContainer>
    </div>
  );
});

const MapHook = ({center, bounds}) => {
    const map = useMap()
    useEffect(()=> {
        map.flyTo(center, 12)
         if (bounds){
           map.fitBounds(bounds)
         }
    }, [center, map, bounds])

    return null
}

export default MapComponent;