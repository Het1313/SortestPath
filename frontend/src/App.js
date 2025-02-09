// import React, { useState } from 'react';
// import './App.css';
// import MapComponent from './MapComponent';

// // Leaflet and React-Leaflet libraries
// import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

// const App = () => {
//   const [source, setSource] = useState('');
//   const [destination, setDestination] = useState('');
//   const [route, setRoute] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false); // Track loading state

//   const findRoute = async () => {
//     setLoading(true);  // Set loading to true when starting the request
//     setError(null);    // Reset previous errors

//     try {
//       const response = await fetch('http://127.0.0.1:5000/find_route', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ source, destination }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setError(errorData.error || 'Error fetching the route');
//         setRoute(null);  // Reset route if there's an error
//         return;
//       }

//       const routeData = await response.json();

//       // Check if the response contains valid GeoJSON with coordinates
//       if (routeData && routeData.coordinates) {
//         setRoute(routeData.coordinates);
//       } else if (routeData && routeData.coordinates) {
//         // If no coordinates, show error
//         setError('No route found');
//         setRoute(null);
//       }
//     } catch (error) {
//       setError('An error occurred while fetching the route');
//       setRoute(null); // Reset route if error occurs
//     } finally {
//       setLoading(false); // Set loading to false once request is finished
//     }
//   };

//   return (

//     <div className="app">
//       <h1>Route Finder</h1>
//       <div className="input-section">
//         <input
//           type="text"
//           placeholder="Source Location"
//           value={source}
//           onChange={(e) => setSource(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Destination Location"
//           value={destination}
//           onChange={(e) => setDestination(e.target.value)}
//         />
//         <button onClick={findRoute} disabled={loading}>
//           {loading ? 'Finding Route...' : 'Find Route'}
//         </button>
//       </div>

//       {error && <div className="error">{error}</div>}

//       {route && (
//         <div className="map-container">
//           <MapContainer
//             center={[route[0][1], route[0][0]]} // Centering the map to the first coordinate
//             zoom={13}
//             style={{ height: '500px', width: '100%' }}
//           >
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             <Polyline positions={route.map(([lng, lat]) => [lat, lng])} color="blue" />
//           </MapContainer>
//           <div className="route-data">
//             <h3>Full Route Coordinates:</h3>
//             <pre>{JSON.stringify(route, null, 2)}</pre> {/* This will print the full route */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

import React, { useState } from "react";
import MapComponent from "./MapComponent"; // Import the MapComponent
import "./App.css";

const App = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const findRoute = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/find_route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, destination }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error fetching the route");
        setRoute(null);
        return;
      }

      const routeData = await response.json();

      if (routeData && routeData.coordinates) {
        setRoute(routeData.coordinates);
      } else {
        setError("No route found");
        setRoute(null);
      }
    } catch (error) {
      setError("An error occurred while fetching the route");
      setRoute(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🚀 Real-Time Route Finder</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Source Location"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination Location"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button onClick={findRoute} disabled={loading}>
          {loading ? "Finding Route..." : "Find Route"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Show the map when a valid route exists */}
      {route && <MapComponent route={route} />}
    </div>
  );
};

export default App;


// import React, { useState } from "react";
// import MapComponent from "./MapComponent";
// import RouteDisplay from "./RouteDisplay";
// import RouteFinder from "./RouteFinder";

// function App() {
//   const [source, setSource] = useState("");
//   const [destination, setDestination] = useState("");
//   const [preference, setPreference] = useState("fastest");
//   const [routes, setRoutes] = useState([]);

//   const handleRouteChange = (newSource, newDestination, newPreference, newRoutes) => {
//     setSource(newSource);
//     setDestination(newDestination);
//     setPreference(newPreference);
//     setRoutes(newRoutes);
//   };

//   return (
//     <div className="App" style={{ textAlign: "center", padding: "20px" }}>
//       <h2>🚀 Real-Time Route Finder</h2>
//       <p>Enter your source and destination to find the best route.</p>
      
//       {/* RouteFinder handles input */}
//       <RouteFinder onRouteChange={handleRouteChange} />

//       {/* RouteDisplay to show details */}
//       <RouteDisplay routes={routes} />

//       {/* MapComponent to display the route */}
//       <MapComponent source={source} destination={destination} routes={routes} />
//     </div>
//   );
// }

// export default App;
