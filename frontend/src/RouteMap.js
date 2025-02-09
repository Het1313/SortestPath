import React, { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RouteMap = ({ sourceCoords, destinationCoords, routeGeoJson }) => {
  useEffect(() => {
    // Map setup
    const map = L.map("map").setView([20.5937, 78.9629], 5); // Default center (India)

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

    // Markers for source and destination
    const sourceMarker = L.marker(sourceCoords).addTo(map);
    sourceMarker.bindPopup("<b>Source</b>").openPopup();

    const destinationMarker = L.marker(destinationCoords).addTo(map);
    destinationMarker.bindPopup("<b>Destination</b>").openPopup();

    // Draw the route if available
    if (routeGeoJson) {
      const route = L.geoJSON(routeGeoJson, {
        style: {
          color: "blue",
          weight: 5,
          opacity: 0.7
        }
      }).addTo(map);
      map.fitBounds(route.getBounds());
    }
  }, [sourceCoords, destinationCoords, routeGeoJson]);

  return <div id="map" style={{ height: "600px", width: "100%" }}></div>;
};

export default RouteMap;
