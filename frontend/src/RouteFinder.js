import React, { useState } from "react";
import axios from "axios";
// import "./RouteFinder.css"

const RouteFinder = ({ onRouteChange }) => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [preference, setPreference] = useState("fastest");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const findRoutes = async () => {
    setError(null);
    setLoading(true);

    if (!source || !destination) {
      setError("Please enter valid Source and Destination.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/find_route", {
        source,
        destination,
        preference,
      });

      // Check the response contains valid route data in the expected format
      if (response.data && typeof response.data === 'object' && response.data.type === 'FeatureCollection' && Array.isArray(response.data.features)) {
          onRouteChange(source, destination, preference, response.data.features);  // Pass data to parent (App)
      } else {
          setError("No routes found or invalid data received.");
      }

    } catch (err) {
      setError("Failed to fetch route. Check API or connection.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="route-finder">
      <input
        type="text"
        placeholder="Source (e.g., City, Village, State)"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="route-input"
      />
      <input
        type="text"
        placeholder="Destination (e.g., City, Village, State)"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="route-input"
      />
      <select
        onChange={(e) => setPreference(e.target.value)}
        className="route-select"
      >
        <option value="fastest">Fastest</option>
        <option value="shortest">Shortest</option>
        <option value="recommended">Recommended</option>
      </select>
      <button
        onClick={findRoutes}
        className="route-button"
        disabled={loading}
      >
        {loading ? "Finding Route..." : "Find Route"}
      </button>

      {error && <p className="route-error">{error}</p>}
    </div>
  );
};

export default RouteFinder;