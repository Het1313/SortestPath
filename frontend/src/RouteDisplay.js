import React from "react";

const RouteDisplay = ({ routes }) => {
  const renderRouteInfo = (route) => {
    return (
      <div>
        <h3>Route Summary</h3>
        <p>Distance: {route.summary.distance} meters</p>
        <p>Duration: {route.summary.duration} seconds</p>
        <h4>Directions:</h4>
        <ul>
          {route.segments[0].steps.map((step, index) => (
            <li key={index}>
              {step.instruction} for {step.distance} meters
            </li>
          ))}
        </ul>
        <h4>Alternative Routes (if any):</h4>
        {route.alternatives &&
          route.alternatives.map((altRoute, index) => (
            <div key={index}>
              <h5>Alternative {index + 1}</h5>
              <p>Distance: {altRoute.summary.distance} meters</p>
              <p>Duration: {altRoute.summary.duration} seconds</p>
            </div>
          ))}
      </div>
    );
  };

  if (routes.length === 0) {
    return <div>No route data available</div>;
  }

  return (
    <div>
      <h2>Route Information</h2>
      {routes.map((route, index) => (
        <div key={index}>
          <h3>Route {index + 1}</h3>
          {renderRouteInfo(route)}
        </div>
      ))}
    </div>
  );
};

export default RouteDisplay;
