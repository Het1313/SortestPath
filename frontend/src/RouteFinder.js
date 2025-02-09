import React, { useState } from "react";
import axios from "axios";

const RouteFinder = ({ onRouteChange }) => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [preference, setPreference] = useState("fastest");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const findRoutes = async () => {
    setError(null); // Reset previous errors
    setLoading(true); // Start loading

    if (!source || !destination) {
      setError("Please enter valid Source and Destination.");
      setLoading(false);
      return;
    }

    try {
      // Send POST request to Flask API
      const response = await axios.post("http://127.0.0.1:5000/find_route", {
        source,  // Location name
        destination,  // Location name
        preference, // Fastest, shortest, or recommended
      });

      if (response.data.features && response.data.features.length > 0) {
        onRouteChange(source, destination, preference, response.data.features); // Pass data to parent (App)
      } else {
        setError("No route found. Try different locations.");
      }
    } catch (err) {
      setError("Failed to fetch route. Check API or connection.");
      console.error(err);
    }

    setLoading(false); // Stop loading
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <input
        type="text"
        placeholder="Source (e.g. City, Village, State)"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px", width: "250px" }}
      />
      <input
        type="text"
        placeholder="Destination (e.g. City, Village, State)"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px", width: "250px" }}
      />
      <select
        onChange={(e) => setPreference(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px", width: "250px" }}
      >
        <option value="fastest">Fastest</option>
        <option value="shortest">Shortest</option>
        <option value="recommended">Recommended</option>
      </select>
      <button
        onClick={findRoutes}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        {loading ? "Finding Route..." : "Find Route"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RouteFinder;
// import React, { useState } from "react";
// import axios from "axios";

// const RouteFinder = ({ onRouteChange }) => {
//   const [source, setSource] = useState("");
//   const [destination, setDestination] = useState("");
//   const [preference, setPreference] = useState("fastest");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const findRoutes = async () => {
//     setError(null); // Reset previous errors
//     setLoading(true); // Start loading

//     if (!source || !destination) {
//       setError("Please enter valid Source and Destination.");
//       setLoading(false);
//       return;
//     }

//     const sourceCoords = source.split(",").map(Number);
//     const destinationCoords = destination.split(",").map(Number);

//     if (sourceCoords.length !== 2 || destinationCoords.length !== 2 || sourceCoords.some(isNaN) || destinationCoords.some(isNaN)) {
//       setError("Invalid coordinates format. Use: lat,lng");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Reverse the coordinates to pass [lng, lat] as required by OpenRouteService
//       const sourceReversed = sourceCoords.reverse();
//       const destinationReversed = destinationCoords.reverse();

//       // Send POST request to Flask API
//       const response = await axios.post("http://127.0.0.1:5000/find_route", {
//         source: sourceReversed,  // Correct order for [lng, lat] format
//         destination: destinationReversed,
//         preference: preference, // Fastest, shortest, or recommended
//       });

//       if (response.data.features && response.data.features.length > 0) {
//         onRouteChange(source, destination, preference, response.data.features); // Pass data to parent (App)
//       } else {
//         setError("No route found. Try different locations.");
//       }
//     } catch (err) {
//       setError("Failed to fetch route. Check API or connection.");
//       console.error(err);
//     }

//     setLoading(false); // Stop loading
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <input
//         type="text"
//         placeholder="Source (lat,lng)"
//         value={source}
//         onChange={(e) => setSource(e.target.value)}
//         style={{ padding: "10px", marginBottom: "10px", width: "250px" }}
//       />
//       <input
//         type="text"
//         placeholder="Destination (lat,lng)"
//         value={destination}
//         onChange={(e) => setDestination(e.target.value)}
//         style={{ padding: "10px", marginBottom: "10px", width: "250px" }}
//       />
//       <select
//         onChange={(e) => setPreference(e.target.value)}
//         style={{ padding: "10px", marginBottom: "10px", width: "250px" }}
//       >
//         <option value="fastest">Fastest</option>
//         <option value="shortest">Shortest</option>
//         <option value="recommended">Recommended</option>
//       </select>
//       <button
//         onClick={findRoutes}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "#4CAF50",
//           color: "white",
//           border: "none",
//           cursor: "pointer",
//           marginBottom: "20px",
//         }}
//       >
//         {loading ? "Finding Route..." : "Find Route"}
//       </button>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// };

// export default RouteFinder;


// // import React, { useState } from "react";
// // import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
// // import axios from "axios";

// // const RouteFinder = () => {
// //   const [source, setSource] = useState("");
// //   const [destination, setDestination] = useState("");
// //   const [routes, setRoutes] = useState([]);
// //   const [preference, setPreference] = useState("fastest");
// //   const [error, setError] = useState(null);

// //   const findRoutes = async () => {
// //     setError(null); // Reset previous errors
// //     setRoutes([]); // Clear previous routes

// //     try {
// //       if (!source || !destination) {
// //         setError("Please enter valid Source and Destination.");
// //         return;
// //       }

// //       const sourceCoords = source.split(",").map(Number);
// //       const destinationCoords = destination.split(",").map(Number);

// //       if (sourceCoords.length !== 2 || destinationCoords.length !== 2 || sourceCoords.some(isNaN) || destinationCoords.some(isNaN)) {
// //         setError("Invalid coordinates format. Use: lat,lng");
// //         return;
// //       }

// //       // Reverse the coordinates to pass [lng, lat] as required by OpenRouteService
// //       const sourceReversed = sourceCoords.reverse();
// //       const destinationReversed = destinationCoords.reverse();

// //       // Send POST request to Flask API
// //       const response = await axios.post("http://127.0.0.1:5000/find_route", {
// //         source: sourceReversed,  // Correct order for [lng, lat] format
// //         destination: destinationReversed,
// //         preference: preference, // Fastest, shortest, or recommended
// //       });

// //       // Check if routes exist in the response data (features is the key for OpenRouteService)
// //       if (response.data.features && response.data.features.length > 0) {
// //         setRoutes(response.data.features);  // Corrected key to 'features'
// //       } else {
// //         setError("No route found. Try different locations.");
// //       }
// //     } catch (err) {
// //       setError("Failed to fetch route. Check API or connection.");
// //       console.error(err);
// //     }
// //   };

// //   return (
// //     <div style={{ textAlign: "center", padding: "20px" }}>
// //       <input
// //         type="text"
// //         placeholder="Source (lat,lng)"
// //         value={source}
// //         onChange={(e) => setSource(e.target.value)}
// //         style={{ padding: "10px", marginBottom: "10px", width: "250px" }}
// //       />
// //       <input
// //         type="text"
// //         placeholder="Destination (lat,lng)"
// //         value={destination}
// //         onChange={(e) => setDestination(e.target.value)}
// //         style={{ padding: "10px", marginBottom: "10px", width: "250px" }}
// //       />
// //       <select
// //         onChange={(e) => setPreference(e.target.value)}
// //         style={{ padding: "10px", marginBottom: "10px", width: "250px" }}
// //       >
// //         <option value="fastest">Fastest</option>
// //         <option value="shortest">Shortest</option>
// //         <option value="recommended">Recommended</option>
// //       </select>
// //       <button
// //         onClick={findRoutes}
// //         style={{
// //           padding: "10px 20px",
// //           backgroundColor: "#4CAF50",
// //           color: "white",
// //           border: "none",
// //           cursor: "pointer",
// //           marginBottom: "20px",
// //         }}
// //       >
// //         Find Route
// //       </button>

// //       {error && <p style={{ color: "red" }}>{error}</p>}

// //       <div style={{ height: "500px", width: "80%", margin: "0 auto" }}>
// //         <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
// //           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

// //           {routes.length > 0 && (
// //             <>
// //               {/* Adding markers at source and destination */}
// //               <Marker position={routes[0].geometry.coordinates[0].reverse()} />
// //               <Marker position={routes[0].geometry.coordinates[routes[0].geometry.coordinates.length - 1].reverse()} />

// //               {routes.map((route, index) => (
// //                 <Polyline
// //                   key={index}
// //                   positions={route.geometry.coordinates.map(coord => [coord[1], coord[0]])} // Reverse for Leaflet's [lat, lng]
// //                   color={index === 0 ? "blue" : "gray"}
// //                 />
// //               ))}
// //             </>
// //           )}
// //         </MapContainer>
// //       </div>
// //     </div>
// //   );
// // };

// // export default RouteFinder;
