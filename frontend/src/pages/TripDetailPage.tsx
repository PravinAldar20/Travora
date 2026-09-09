import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Languages,
  Plus,
  Trash2,
  Hotel,
  DollarSign,
  Share2,
  Check,
  Star,
  Navigation,
} from 'lucide-react';
import { CurrencyBadge } from '../components/common/CurrencyBadge';
import { InteractiveMap, MapMarkerItem } from '../components/map/InteractiveMap';
import { TranslateModal } from '../components/common/TranslateModal';
import { WeatherCard } from '../components/common/WeatherCard';
import api from '../services/api';
import { Trip, ItineraryItem } from '../types';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [optimizing, setOptimizing] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Translate Modal State
  const [translateTarget, setTranslateTarget] = useState<{ title: string; text: string } | null>(null);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/trips/${id}`);
      if (res.data.success && res.data.trip) {
        setTrip(res.data.trip);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Trip not found.');
      navigate('/my-trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTrip();
  }, [id]);

  // Optimize Itinerary handler: calls backend smart route recalculation
  const handleOptimizeItinerary = async () => {
    if (!trip) return;
    setOptimizing(true);
    try {
      const res = await api.post(`/trips/${trip.id}/optimize`);
      if (res.data.success && res.data.trip) {
        setTrip(res.data.trip);
      }
    } catch (err) {
      alert('Route optimization failed.');
    } finally {
      setOptimizing(false);
    }
  };

  const handleShare = () => {
    if (!trip) return;
    navigator.clipboard.writeText(`${window.location.origin}/trips/${trip.shareId}`);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400">Loading itinerary & geographical routes...</p>
      </div>
    );
  }

  if (!trip) return null;

  // Group activities by day
  const items = trip.itineraryItems || [];
  const daysMap = new Map<number, ItineraryItem[]>();
  items.forEach(item => {
    const list = daysMap.get(item.dayNumber) || [];
    list.push(item);
    daysMap.set(item.dayNumber, list);
  });

  const availableDays = Array.from(daysMap.keys()).sort((a, b) => a - b);
  if (availableDays.length === 0) availableDays.push(1);

  const activeDayActivities = (daysMap.get(selectedDay) || []).sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  // Prepare map markers for the active day
  const markers: MapMarkerItem[] = activeDayActivities.map(act => ({
    id: act.id,
    name: act.name,
    category: act.category === 'meal' ? 'restaurant' : 'attraction',
    latitude: act.latitude,
    longitude: act.longitude,
    description: act.description,
    cost: act.cost,
    currency: act.currency,
    rating: act.rating,
    orderNumber: act.orderIndex,
  }));

  // Total day statistics
  const totalDayCost = activeDayActivities.reduce((sum, a) => sum + (a.cost || 0), 0);
  const totalDayDist = Math.round(activeDayActivities.reduce((sum, a) => sum + (a.distanceKm || 0), 0) * 10) / 10;
  const totalDayMins = activeDayActivities.reduce((sum, a) => sum + (a.travelTimeMinutes || 0), 0);

  // Waypoint coordinates for polyline route
  const routeCoords: Array<[number, number]> = activeDayActivities.map(a => [a.latitude, a.longitude]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl mb-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-semibold border border-sky-500/30">
                {trip.travelStyle} Style
              </span>
              <span className="text-xs text-slate-400">
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{trip.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>{trip.destination}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedShare ? 'Link Copied!' : 'Share Trip'}</span>
            </button>

            <button
              onClick={handleOptimizeItinerary}
              disabled={optimizing}
              className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white rounded-xl text-xs font-bold shadow-glow-primary flex items-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${optimizing ? 'animate-spin' : ''}`} />
              <span>{optimizing ? 'Recalculating Routes...' : 'Optimize Itinerary'}</span>
            </button>
          </div>
        </div>

        {/* Day selection tabs */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-white/5 overflow-x-auto pb-2">
          {availableDays.map(dayNum => (
            <button
              key={dayNum}
              onClick={() => setSelectedDay(dayNum)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                selectedDay === dayNum
                  ? 'bg-sky-500 text-white shadow-glow-primary'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Day {dayNum}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Day View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Chronological Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Day {selectedDay} Schedule</span>
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Dist: <b className="text-white">{totalDayDist} km</b></span>
              <span>•</span>
              <span>Est. Cost: <b className="text-white"><CurrencyBadge amount={totalDayCost} currency={trip.currency} /></b></span>
            </div>
          </div>

          {activeDayActivities.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-sm">
              No activities planned for Day {selectedDay}.
            </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-white/10">
              {activeDayActivities.map((activity, idx) => (
                <div
                  key={activity.id || idx}
                  className="glass-panel p-5 rounded-2xl relative pl-14 hover:border-sky-500/40 transition group"
                >
                  {/* Order / Time Badge */}
                  <div className="absolute left-3.5 top-5 w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shadow-glow-primary ring-4 ring-[#0B1120]">
                    {activity.orderIndex || idx + 1}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{activity.suggestedStartTime}</span>
                        </span>
                        <span className="text-xs text-slate-400">
                          ({activity.durationMinutes} mins)
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 py-0.5 bg-slate-900 rounded">
                          {activity.category}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition">
                        {activity.name}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-sky-400 flex-shrink-0" />
                        <span>{activity.location}</span>
                      </p>
                    </div>

                    <div className="flex sm:flex-col sm:items-end justify-between items-center gap-1">
                      <CurrencyBadge amount={activity.cost} currency={activity.currency} className="text-sm" />
                      {activity.rating && (
                        <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{activity.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {activity.description}
                  </p>

                  {/* Travel & Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Navigation className="w-3.5 h-3.5 text-sky-400" />
                      <span>
                        {activity.transportationMethod || 'Transit'}: {activity.distanceKm} km (~{activity.travelTimeMinutes} mins)
                      </span>
                    </div>

                    {/* Inline Real Translation Action */}
                    <button
                      onClick={() =>
                        setTranslateTarget({
                          title: activity.name,
                          text: `${activity.name}: ${activity.description}`,
                        })
                      }
                      className="px-2.5 py-1 bg-white/5 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <Languages className="w-3.5 h-3.5 text-sky-400" />
                      <span>Translate Info</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Map & Weather */}
        <div className="space-y-6">
          {/* Day Route Map */}
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Day {selectedDay} Route Map</span>
            </h3>
            <InteractiveMap
              center={[trip.latitude || 35.6762, trip.longitude || 139.6503]}
              markers={markers}
              routeCoordinates={routeCoords}
              totalDistanceKm={totalDayDist}
              totalDurationMinutes={totalDayMins}
              height="400px"
            />
          </div>

          {/* Real Live Weather for Destination */}
          <WeatherCard
            latitude={trip.latitude || 35.6762}
            longitude={trip.longitude || 139.6503}
            cityName={trip.city}
          />
        </div>
      </div>

      {/* Translation Modal */}
      {translateTarget && (
        <TranslateModal
          isOpen={Boolean(translateTarget)}
          onClose={() => setTranslateTarget(null)}
          title={translateTarget.title}
          originalText={translateTarget.text}
        />
      )}
    </div>
  );
};
