import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Calendar,
  MapPin,
  Users,
  Copy,
  Trash2,
  Share2,
  ArrowRight,
  Plus,
  Compass,
  Check,
} from 'lucide-react';
import { CurrencyBadge } from '../components/common/CurrencyBadge';
import api from '../services/api';
import { Trip } from '../types';

export const MyTripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [shareCopiedId, setShareCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get('/trips');
      if (res.data.success && res.data.trips) {
        setTrips(res.data.trips);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter(t => t.id !== id));
    } catch (err) {
      alert('Failed to delete trip.');
    }
  };

  const handleDuplicateTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/trips/${id}/duplicate`);
      if (res.data.success && res.data.trip) {
        setTrips([res.data.trip, ...trips]);
      }
    } catch (err) {
      alert('Failed to duplicate trip.');
    }
  };

  const handleShareTrip = (trip: Trip, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/trips/${trip.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    setShareCopiedId(trip.id);
    setTimeout(() => setShareCopiedId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Trips</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your persistent itineraries, review schedules, and optimize routes.
          </p>
        </div>

        <Link
          to="/plan-trip"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-sm font-semibold shadow-glow-primary transition"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Loading trips from database...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl text-center border border-white/5">
          <Compass className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No trips saved yet</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6 max-w-sm mx-auto">
            Use Travora's AI Planner to generate your first custom itinerary with route optimization and weather adaptation.
          </p>
          <Link
            to="/plan-trip"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-sm font-bold shadow-glow-primary transition"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Itinerary Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => (
            <div
              key={trip.id}
              onClick={() => navigate(`/trips/${trip.id}`)}
              className="glass-panel-interactive p-6 rounded-2xl cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-semibold">
                    {trip.travelStyle}
                  </span>
                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    <button
                      title="Share trip link"
                      onClick={e => handleShareTrip(trip, e)}
                      className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-white/5 rounded-lg transition"
                    >
                      {shareCopiedId === trip.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      title="Duplicate trip"
                      onClick={e => handleDuplicateTrip(trip.id, e)}
                      className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-white/5 rounded-lg transition"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      title="Delete trip"
                      onClick={e => handleDeleteTrip(trip.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mt-3 group-hover:text-sky-400 transition leading-snug">
                  {trip.title}
                </h3>

                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>{trip.destination}</span>
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
                      {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{trip.adults} Adults</span>
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Budget</span>
                  <CurrencyBadge amount={trip.budget} currency={trip.currency} className="text-sm block" />
                </div>

                <span className="flex items-center gap-1 text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
