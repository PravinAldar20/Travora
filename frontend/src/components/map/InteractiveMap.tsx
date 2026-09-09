import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Hotel as HotelIcon, Utensils, Star, Compass } from 'lucide-react';
import { CurrencyBadge } from '../common/CurrencyBadge';

export interface MapMarkerItem {
  id: string;
  name: string;
  category: 'hotel' | 'attraction' | 'restaurant' | 'origin';
  latitude: number;
  longitude: number;
  description?: string;
  cost?: number;
  currency?: string;
  rating?: number;
  orderNumber?: number;
}

interface InteractiveMapProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarkerItem[];
  routeCoordinates?: Array<[number, number]>; // [lat, lon]
  totalDistanceKm?: number;
  totalDurationMinutes?: number;
  height?: string;
}

// Map Auto-recenter component when center or markers change
const ChangeView: React.FC<{ center: [number, number]; markers?: MapMarkerItem[] }> = ({
  center,
  markers,
}) => {
  const map = useMap();

  useEffect(() => {
    if (markers && markers.length > 1) {
      const bounds = L.latLngBounds(markers.map(m => [m.latitude, m.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView(center, 13);
    }
  }, [center, markers, map]);

  return null;
};

// Create custom leaflet SVG pin icons
function createCustomPin(color: string, label: string = '', iconType: string = 'pin') {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: ${color};
        color: white;
        box-shadow: 0 0 15px ${color}88, 0 4px 6px rgba(0,0,0,0.4);
        border: 2px solid white;
        font-weight: 700;
        font-size: 12px;
      ">
        ${label}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center,
  zoom = 13,
  markers = [],
  routeCoordinates = [],
  totalDistanceKm,
  totalDurationMinutes,
  height = '500px',
}) => {
  const icons = useMemo(() => ({
    hotel: createCustomPin('#0284c7', '🏨', 'hotel'),
    restaurant: createCustomPin('#f59e0b', '🍴', 'restaurant'),
    attraction: createCustomPin('#38bdf8', '★', 'attraction'),
    origin: createCustomPin('#10b981', '▲', 'origin'),
  }), []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ height }}>
      {/* Route Statistics Overlay if available */}
      {totalDistanceKm !== undefined && totalDurationMinutes !== undefined && (
        <div className="absolute top-4 right-4 z-[1000] glass-panel px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-sky-400" />
            <span className="text-slate-300">Total Distance:</span>
            <span className="font-bold text-white">{totalDistanceKm} km</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-300">Est. Transit:</span>{' '}
            <span className="font-bold text-white">{totalDurationMinutes} mins</span>
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <ChangeView center={center} markers={markers} />

        {/* CartoDB Dark Matter tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Real Polyline Route Connecting Waypoints */}
        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: '#0ea5e9',
              weight: 5,
              opacity: 0.85,
              dashArray: '8, 8',
            }}
          />
        )}

        {/* Markers */}
        {markers.map((marker, index) => {
          let pinIcon = icons.attraction;
          if (marker.category === 'hotel') pinIcon = icons.hotel;
          else if (marker.category === 'restaurant') pinIcon = icons.restaurant;
          else if (marker.category === 'origin') pinIcon = icons.origin;
          else if (marker.orderNumber) {
            pinIcon = createCustomPin('#0ea5e9', `${marker.orderNumber}`, 'numbered');
          }

          return (
            <Marker
              key={marker.id || index}
              position={[marker.latitude, marker.longitude]}
              icon={pinIcon}
            >
              <Popup>
                <div className="p-1 max-w-[220px]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 block mb-1">
                    {marker.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">{marker.name}</h4>
                  {marker.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">{marker.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
                    {marker.cost !== undefined && marker.currency && (
                      <span className="font-semibold text-slate-900">
                        {marker.cost === 0 ? 'Free' : `${marker.currency} ${marker.cost.toLocaleString()}`}
                      </span>
                    )}
                    {marker.rating && (
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{marker.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
