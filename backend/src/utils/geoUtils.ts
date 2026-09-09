/**
 * Geo calculation and Route Optimization utilities
 */

// Calculate Haversine distance between two coordinates in Kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Estimate travel time in minutes based on distance and mode
export function estimateTravelTimeMinutes(distanceKm: number, mode: 'Walking' | 'Driving' | 'Transit' = 'Transit'): number {
  if (distanceKm <= 0) return 0;
  switch (mode) {
    case 'Walking':
      // Approx 4.5 km/h
      return Math.max(5, Math.round((distanceKm / 4.5) * 60));
    case 'Driving':
      // Approx 30 km/h in urban settings
      return Math.max(5, Math.round((distanceKm / 30) * 60));
    case 'Transit':
    default:
      // Approx 20 km/h + 5 min wait
      return Math.max(10, Math.round((distanceKm / 20) * 60 + 5));
  }
}

export interface RoutePoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
}

/**
 * Smart Route Optimization: Nearest-Neighbor Traveling Salesperson Algorithm
 * Orders activities to minimize total distance traveled, starting from the hotel/origin.
 */
export function optimizeRouteOrder<T extends RoutePoint>(
  origin: { latitude: number; longitude: number },
  points: T[]
): { optimizedPoints: T[]; totalDistanceKm: number } {
  if (!points || points.length <= 1) {
    return { optimizedPoints: points, totalDistanceKm: 0 };
  }

  const unvisited = [...points];
  const ordered: T[] = [];
  let currentLat = origin.latitude;
  let currentLon = origin.longitude;
  let totalDistanceKm = 0;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = calculateDistanceKm(currentLat, currentLon, unvisited[0].latitude, unvisited[0].longitude);

    for (let i = 1; i < unvisited.length; i++) {
      const dist = calculateDistanceKm(currentLat, currentLon, unvisited[i].latitude, unvisited[i].longitude);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    const nextPoint = unvisited.splice(nearestIndex, 1)[0];
    ordered.push(nextPoint);
    totalDistanceKm += minDistance;
    currentLat = nextPoint.latitude;
    currentLon = nextPoint.longitude;
  }

  // Return to origin distance
  const returnDist = calculateDistanceKm(currentLat, currentLon, origin.latitude, origin.longitude);
  totalDistanceKm += returnDist;

  return {
    optimizedPoints: ordered,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
  };
}
