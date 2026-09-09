import axios from 'axios';

export interface RouteSegment {
  distanceMeters: number;
  durationSeconds: number;
  geometry: {
    coordinates: Array<[number, number]>; // [lon, lat]
    type: string;
  };
  steps?: Array<{
    instruction: string;
    distance: number;
    duration: number;
  }>;
}

export interface RouteCalculationResult {
  totalDistanceKm: number;
  totalDurationMinutes: number;
  coordinates: Array<[number, number]>; // [lat, lon] for Leaflet
  mode: 'driving' | 'walking';
  provider: string;
}

/**
 * Calculates REAL route geometry, distance and duration between coordinates using OSRM.
 * mode: 'driving' or 'walking' (OSRM 'car' or 'foot')
 */
export async function calculateRealRoute(
  waypoints: Array<{ latitude: number; longitude: number }>,
  mode: 'driving' | 'walking' = 'driving'
): Promise<RouteCalculationResult> {
  if (!waypoints || waypoints.length < 2) {
    return {
      totalDistanceKm: 0,
      totalDurationMinutes: 0,
      coordinates: [],
      mode,
      provider: 'None',
    };
  }

  try {
    // Format coordinate string for OSRM: lon1,lat1;lon2,lat2...
    const coordsStr = waypoints.map(w => `${w.longitude},${w.latitude}`).join(';');
    const osrmProfile = mode === 'walking' ? 'foot' : 'car';
    const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${coordsStr}?overview=full&geometries=geojson&steps=false`;

    const response = await axios.get(url, { timeout: 8000 });
    const data = response.data;

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const primaryRoute = data.routes[0];
      const distanceMeters = primaryRoute.distance;
      const durationSeconds = primaryRoute.duration;
      // GeoJSON has coordinates as [longitude, latitude]
      // Leaflet requires [latitude, longitude]
      const latLngCoords: Array<[number, number]> = (primaryRoute.geometry?.coordinates || []).map(
        (c: [number, number]) => [c[1], c[0]]
      );

      return {
        totalDistanceKm: Math.round((distanceMeters / 1000) * 10) / 10,
        totalDurationMinutes: Math.round(durationSeconds / 60),
        coordinates: latLngCoords,
        mode,
        provider: 'OSRM Open Source Routing Engine',
      };
    }
  } catch (error: any) {
    console.warn('OSRM routing request error, computing direct line fallback:', error.message);
  }

  // Graceful geometric straight-line fallback if OSRM public server is congested
  const coords: Array<[number, number]> = waypoints.map(w => [w.latitude, w.longitude]);
  let directDist = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const latDiff = waypoints[i + 1].latitude - waypoints[i].latitude;
    const lonDiff = waypoints[i + 1].longitude - waypoints[i].longitude;
    directDist += Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; // approx km
  }
  const speed = mode === 'walking' ? 4.5 : 30;
  return {
    totalDistanceKm: Math.round(directDist * 10) / 10,
    totalDurationMinutes: Math.round((directDist / speed) * 60),
    coordinates: coords,
    mode,
    provider: 'Geodesic Route Estimate',
  };
}
