import React from "react";

const RouteDisplay = ({ routes, selectedRouteIndex, onRouteSelect }) => {
  if (!routes || routes.length === 0) {
    return <div className="no-routes">No routes found.</div>;
  }

  return (
    <div className="route-display">
      <h2 className="route-display-title">Explore Your Routes</h2>
      <div className="route-container">
        {routes.map((route, index) => (
          <div
            key={index}
            className={`route-item ${
              index === selectedRouteIndex ? "selected" : ""
            }`}
          >
            <span className="route-name">Route {index + 1}</span>
            <span className="route-details">
              {(route.properties.summary.distance / 1000).toFixed(2)} km,{" "}
              {(route.properties.summary.duration / 60).toFixed(2)} min
            </span>
            <button
              className="route-select-button"
              onClick={() => onRouteSelect(index)}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteDisplay;