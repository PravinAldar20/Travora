import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Car,
  Footprints,
  Hotel,
  Utensils,
  Star,
  RefreshCw,
  Layers,
  Navigation,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useDestination } from '../context/DestinationContext';
import { InteractiveMap, MapMarkerItem } from '../components/map/InteractiveMap';
import api from '../services/api';

export const MapPage: React.FC = () => {
  const { activeDestination, destinations, setActiveDestination } = useDestination();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const targetLat = queryParams.get('lat') ? Number(queryParams.get('lat')) : undefined;
  const targetLon = queryParams.get('lon') ? Number(queryParams.get('lon')) : undefined;
  const destParam = queryParams.get('dest') || queryParams.get('destinationId');

  const [worldOverview, setWorldOverview] = useState<boolean>(false);
  const [center, setCenter] = useState<[number, number]>([
    targetLat || activeDestination?.latitude || 35.6762,
    targetLon || activeDestination?.longitude || 139.6503,
  ]);

  const [mode, setMode] = useState<'driving' | 'walking'>('driving');
  const [showHotels, setShowHotels] = useState<boolean>(true);
  const [showAttractions, setShowAttractions] = useState<boolean>(true);
  const [showRestaurants, setShowRestaurants] = useState<boolean>(true);

  const [markers, setMarkers] = useState<MapMarkerItem[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<[number, number]>>([]);
  const [routeStats, setRouteStats] = useState<{ distKm: number; mins: number } | null>(null);
  const [loadingRoute, setLoadingRoute] = useState<boolean>(false);

  // Synchronize destination from URL params if supplied
  useEffect(() => {
    if (destParam && destinations.length > 0) {
      const match = destinations.find(
        d => d.id.toLowerCase() === destParam.toLowerCase() || d.city.toLowerCase() === destParam.toLowerCase()
      );
      if (match && match.id !== activeDestination?.id) {
        setActiveDestination(match);
      }
    }
  }, [destParam, destinations]);

  // Update map center and markers
  useEffect(() => {
    if (worldOverview) {
      // Plot all worldwide destinations
      setCenter([20, 10]);
      setRouteCoordinates([]);
      setRouteStats(null);

      const worldMarkers: MapMarkerItem[] = destinations.map(d => ({
        id: d.id,
        name: d.name,
        category: 'attraction',
        latitude: d.latitude,
        longitude: d.longitude,
        description: `${d.description.slice(0, 90)}... • Best Season: ${d.bestSeasons?.join(', ') || 'All Year'}`,
        cost: d.estimatedDailyCostUSD || 100,
        currency: 'USD',
        rating: 4.8,
      }));
      setMarkers(worldMarkers);
      return;
    }

    if (activeDestination) {
      setCenter([
        targetLat || activeDestination.latitude,
        targetLon || activeDestination.longitude,
      ]);

      const items: MapMarkerItem[] = [];

      if (showAttractions) {
        activeDestination.topAttractions.forEach(a => {
          items.push({
            id: a.id,
            name: a.name,
            category: 'attraction',
            latitude: a.latitude,
            longitude: a.longitude,
            description: a.description,
            cost: a.price,
            currency: a.currency,
            rating: a.rating,
          });
        });
      }

      if (showRestaurants) {
        activeDestination.restaurants.forEach(r => {
          items.push({
            id: r.id,
            name: r.name,
            category: 'restaurant',
            latitude: r.latitude,
            longitude: r.longitude,
            description: `${r.cuisine} • ${r.address}`,
            cost: r.avgCost,
            currency: r.currency,
            rating: r.rating,
          });
        });
      }

      setMarkers(items);

      // Compute initial route between first 3 points via real OSRM routing
      if (items.length >= 2) {
        const waypoints = items.slice(0, 4).map(i => ({ latitude: i.latitude, longitude: i.longitude }));
        setLoadingRoute(true);
        api.post('/routes', { waypoints, mode })
          .then(res => {
            if (res.data.success && res.data.route) {
              setRouteCoordinates(res.data.route.coordinates || []);
              setRouteStats({
                distKm: res.data.route.totalDistanceKm,
                mins: res.data.route.totalDurationMinutes,
              });
            }
          })
          .catch(() => {})
          .finally(() => setLoadingRoute(false));
      }
    }
  }, [activeDestination, mode, showAttractions, showRestaurants, targetLat, targetLon, worldOverview, destinations]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-1">
            <Navigation className="w-3.5 h-3.5" />
            <span>OSRM Real Road Network Navigation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Interactive Map & Route Engine</h1>
        </div>

        {/* Mode Selector, World Overview & Destination Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setWorldOverview(!worldOverview)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
              worldOverview
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-transparent shadow-glow-primary'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{worldOverview ? 'Local City View' : '🌍 All World Places'}</span>
          </button>

          {!worldOverview && (
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setMode('driving')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  mode === 'driving' ? 'bg-sky-500 text-white shadow-glow-primary' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Driving</span>
              </button>
              <button
                onClick={() => setMode('walking')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  mode === 'walking' ? 'bg-sky-500 text-white shadow-glow-primary' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Walking</span>
              </button>
            </div>
          )}

          <select
            value={activeDestination?.id || ''}
            onChange={e => {
              const d = destinations.find(dest => dest.id === e.target.value);
              if (d) setActiveDestination(d);
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
          >
            {destinations.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Layers:</span>
          <button
            onClick={() => setShowAttractions(!showAttractions)}
            className={`px-3 py-1 rounded-lg border transition ${
              showAttractions ? 'bg-sky-500/20 text-sky-300 border-sky-500/50' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            ★ Attractions
          </button>
          <button
            onClick={() => setShowRestaurants(!showRestaurants)}
            className={`px-3 py-1 rounded-lg border transition ${
              showRestaurants ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            🍴 Restaurants
          </button>
        </div>

        {routeStats && (
          <div className="text-slate-300 flex items-center gap-2">
            <span>Route Length: <b className="text-sky-400">{routeStats.distKm} km</b></span>
            <span>•</span>
            <span>Est. Duration ({mode}): <b className="text-emerald-400">{routeStats.mins} mins</b></span>
          </div>
        )}
      </div>

      {/* Embedded Map Component */}
      <InteractiveMap
        center={center}
        markers={markers}
        routeCoordinates={routeCoordinates}
        totalDistanceKm={routeStats?.distKm}
        totalDurationMinutes={routeStats?.mins}
        height="640px"
      />
    </div>
  );
};
