import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";

const MapComponent = ({ source, destination, routes }) => {
  return (
    <div style={{ height: "500px", width: "80%", margin: "0 auto" }}>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {routes.length > 0 && (
          <>
            {/* Adding markers at source and destination */}
            <Marker position={routes[0].geometry.coordinates[0].reverse()} />
            <Marker position={routes[0].geometry.coordinates[routes[0].geometry.coordinates.length - 1].reverse()} />

            {/* Render route polyline */}
            {routes.map((route, index) => (
              <Polyline
                key={index}
                positions={route.geometry.coordinates.map(coord => [coord[1], coord[0]])} // Reverse for Leaflet's [lat, lng]
                color={index === 0 ? "blue" : "gray"}
              />
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
