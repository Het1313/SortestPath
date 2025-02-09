from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

ORS_API_KEY = "5b3ce3597851110001cf6248efd9e06c79fe4e65b8ffabc5b7649d20"  # Replace with your actual key
ORS_URL = 'https://api.openrouteservice.org/v2/directions/driving-car'
ORS_NEAREST_URL = "https://api.openrouteservice.org/v2/nearest/point" #Likely problem area
GEOCODE_API_URL = "https://nominatim.openstreetmap.org/search"

def geocode_location(location_name):
    """Get latitude and longitude for a location name using Nominatim API."""
    params = {
        "q": location_name,
        "format": "json",
        "addressdetails": 1
    }
    headers = {
        "User-Agent": "MyAppName/1.0 (contact@myapp.com)"  # Add a custom User-Agent header
    }
    try:
        response = requests.get(GEOCODE_API_URL, params=params, headers=headers)
        if response.status_code != 200:
            print(f"Geocoding Error {response.status_code}: {response.text}")
            return None
        
        geocode_data = response.json()
        if not geocode_data:
            print(f"No results found for {location_name}")
            return None
        
        # Extract the first result's latitude and longitude
        latitude = geocode_data[0]["lat"]
        longitude = geocode_data[0]["lon"]
        return [float(longitude), float(latitude)]  # Return in [longitude, latitude] format
    except requests.exceptions.RequestException as e:
        print(f"Error with Geocoding API: {e}")
        return None

def get_nearest_road_point(coordinate):
    """Get the nearest road point using OpenRouteService."""
    headers = {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "coordinates": [coordinate],
        "number": 1
    }

    try:
        response = requests.post(ORS_NEAREST_URL, json=payload, headers=headers)
        if response.status_code != 200:
            print(f"Nearest API Error {response.status_code}: {response.text}")
            return None

        nearest_result = response.json().get("results", [])
        if not nearest_result:
            print("No nearest road point found")
            return None

        return nearest_result[0].get("location")
    except requests.exceptions.RequestException as e:
        print(f"Error with OpenRouteService Nearest API: {e}")
        return None


@app.route('/find_route', methods=['POST'])
def find_route():
    try:
        data = request.json
        print(f"Received data: {data}")

        # Extract source, destination, and preference from request data
        source = data.get('source')  # Source city name or address
        destination = data.get('destination')  # Destination city name or address
        preference = data.get('preference', 'recommended')  # Default to 'recommended'

        if not source or not destination:
            return jsonify({'error': 'Source and Destination are required'}), 400

        # Geocode the source and destination locations
        source_coords = geocode_location(source)
        destination_coords = geocode_location(destination)

        if not source_coords or not destination_coords:
            return jsonify({'error': 'Invalid source or destination location'}), 400

        print(f"Source coordinates (lng, lat): {source_coords}")
        print(f"Destination coordinates (lng, lat): {destination_coords}")

        # Get nearest road points for source and destination
        #source_nearest = get_nearest_road_point(source_coords) or source_coords  # Fallback to original coordinates
        #destination_nearest = get_nearest_road_point(destination_coords) or destination_coords  # Fallback

        #Print to check coords
        source_nearest = source_coords
        destination_nearest = destination_coords

        print(f"Snapped Source coordinates: {source_nearest}")
        print(f"Snapped Destination coordinates: {destination_nearest}")

        # Prepare request body for OpenRouteService API
        request_body = {
            "coordinates": [source_nearest, destination_nearest],
            "profile": "driving-car",
            "preference": preference,
            "format": "json",
            "alternative_routes": {"target_count": 3, "weight_factor": 1.5}
        }

        # Set headers with authorization for OpenRouteService API
        headers = {
            "Authorization": ORS_API_KEY,
            "Content-Type": "application/json"
        }

        # Send the request to OpenRouteService API
        response = requests.post(ORS_URL, json=request_body, headers=headers)
        print(f"OpenRouteService Response Status: {response.status_code}")
        print(f"OpenRouteService Response Content: {response.text}")

        # Check if the response is successful
        response.raise_for_status()

        # Extract GeoJSON route from the response
        route_data = response.json()
        print(json.dumps(route_data, indent=2))  # Print the entire response for debugging

        # Always Return Feature Collection

        if 'routes' in route_data:
            # Build feature collection for the response to the front end

            features = []
            for route in route_data['routes']:
                geometry = route['geometry']
                feature = {"type": "Feature", "geometry": geometry, "properties": route} #Geometry already has coordinates. Also saving summary for route display
                features.append(feature)
            feature_collection = {"type": "FeatureCollection", "features": features}

            return jsonify(feature_collection)

        else:
            print("No routes found in the response")
            return jsonify({'error': 'No route found in the OpenRouteService response'}), 404
            

    except requests.exceptions.RequestException as e:
        print(f"Error with OpenRouteService API: {e}")
        return jsonify({'error': 'Error with OpenRouteService API'}), 500
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500


if __name__ == '__main__':
    app.run(debug=True)