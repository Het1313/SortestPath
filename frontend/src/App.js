import React, { useState, useEffect, useCallback, useRef } from "react";
import MapComponent from "./MapComponent";
import RouteDisplay from "./RouteDisplay";
import RouteFinder from "./RouteFinder";
import "./App.css";

function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [preference, setPreference] = useState("fastest");
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [mapBounds, setMapBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default center (India)
  const mapRef = useRef(null); // Ref for the MapComponent

  const routeColors = ["#4369b2", "#3498DB", "#2ECC71"];

  // Function to update routes and automatically adjust map focus
  const handleRouteChange = useCallback((newSource, newDestination, newPreference, newRoutes) => {
    setSource(newSource);
    setDestination(newDestination);
    setPreference(newPreference);
    setRoutes(newRoutes);
    setSelectedRouteIndex(0);

    if (newRoutes && newRoutes.length > 0 && newRoutes[0]?.geometry?.coordinates) {
      const firstCoord = newRoutes[0].geometry.coordinates[0];
      setMapCenter([firstCoord[1], firstCoord[0]]);
    }

    // setTimeout(() => {
    //   if (mapRef.current) {
    //     mapRef.current.fitMapToRoute();
    //   }
    // }, 500);
  }, []);

  const calculateMapBounds = (routes) => {
    if (!routes || routes.length === 0) return null;

    let allCoords = [];
    if (routes[selectedRouteIndex]?.geometry?.coordinates) {
      allCoords = routes[selectedRouteIndex].geometry.coordinates;
    } else {
      return null;
    }

    if (allCoords.length === 0) return null;

    let minLat = allCoords[0][1];
    let maxLat = allCoords[0][1];
    let minLng = allCoords[0][0];
    let maxLng = allCoords[0][0];

    allCoords.forEach(coord => {
      const [lng, lat] = coord;
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });

    return [[maxLat, maxLng], [minLat, minLng]];
  };

  useEffect(() => {
    const bounds = calculateMapBounds(routes);
    setMapBounds(bounds);
  }, [routes, selectedRouteIndex]);

  const handleRouteSelect = (index) => {
    setSelectedRouteIndex(index);

    // setTimeout(() => {
    //   if (mapRef.current) {
    //     mapRef.current.fitMapToRoute();
    //   }
    // }, 500);
  };

  return (
    <div className="App">
      <div className="app-container">
        <h1>🚀 Smart Route Finder</h1>
        <p className="app-description">
          Discover the most efficient routes for your journey.
        </p>

        <RouteFinder onRouteChange={handleRouteChange} />
        <RouteDisplay routes={routes} selectedRouteIndex={selectedRouteIndex} onRouteSelect={handleRouteSelect} />

        <div className="map-wrapper">
          <MapComponent
            source={source}
            destination={destination}
            routes={routes}
            mapBounds={mapBounds}
            selectedRouteIndex={selectedRouteIndex}
            routeColors={routeColors}
            center={mapCenter}
            ref={mapRef}
          />
        </div>
      </div>
    </div>
  );
}

export default App;