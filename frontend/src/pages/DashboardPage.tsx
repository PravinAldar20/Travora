import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Plane,
  Hotel,
  MapPin,
  Sparkles,
  ArrowRight,
  Search,
  CloudRain,
  Languages,
  DollarSign,
  Bot,
  Bookmark,
  TrendingUp,
  Clock,
  Shield,
  Globe,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDestination } from '../context/DestinationContext';
import { useCurrency } from '../context/CurrencyContext';
import { WeatherCard } from '../components/common/WeatherCard';
import { CurrencyBadge } from '../components/common/CurrencyBadge';
import api from '../services/api';
import { Trip } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { activeDestination, destinations, setActiveDestination } = useDestination();
  const { homeCurrency, formatCurrency } = useCurrency();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [quickTranslateInput, setQuickTranslateInput] = useState('');
  const [quickTranslateResult, setQuickTranslateResult] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Fetch user's trips
    api.get('/trips')
      .then(res => {
        if (res.data.success && res.data.trips) {
          setTrips(res.data.trips);
        }
      })
      .catch(() => {});

    // Fetch saved count
    api.get('/saved')
      .then(res => {
        if (res.data.success && res.data.savedPlaces) {
          setSavedCount(res.data.savedPlaces.length);
        }
      })
      .catch(() => {});
  }, []);

  const filteredDestinations = searchQuery.trim()
    ? destinations.filter(
        d =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : destinations;

  const handleQuickTranslate = async () => {
    if (!quickTranslateInput.trim()) return;
    setIsTranslating(true);
    try {
      const res = await api.post('/translate', {
        text: quickTranslateInput,
        sourceLanguage: 'auto',
        targetLanguage: activeDestination?.language || 'ja',
      });
      if (res.data.success && res.data.translatedText) {
        setQuickTranslateResult(res.data.translatedText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Welcome Section */}
      <div className="relative py-8 md:py-12 border-b border-white/5 bg-gradient-to-b from-[#10182E] to-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Full-Stack Travel AI Platform</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Good day, {user?.name || 'Traveler'}! ✈️
              </h1>
              <p className="mt-1.5 text-sm text-slate-300 max-w-2xl leading-relaxed">
                Where to next? Search any global destination below to instantly synchronize real weather, live currency rates, local language, and hotel routing.
              </p>
            </div>

            {/* Destination Search Input */}
            <div className="w-full lg:w-96">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Tokyo, Paris, Rome, Dubai..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-lg"
                />
              </div>

              {searchQuery && (
                <div className="absolute mt-1.5 w-full lg:w-96 glass-dropdown rounded-xl p-1.5 z-30 max-h-60 overflow-y-auto">
                  {filteredDestinations.map(d => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setActiveDestination(d);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-200 hover:bg-sky-500/20 hover:text-sky-300 flex items-center justify-between"
                    >
                      <span className="font-semibold">{d.name}</span>
                      <span className="text-[10px] text-slate-400">{d.currency} • {d.languageName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="glass-panel p-4 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400">Active Trips</p>
              <p className="text-2xl font-bold text-white mt-0.5">{trips.length}</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400">Saved Places</p>
              <p className="text-2xl font-bold text-white mt-0.5">{savedCount}</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400">Home Currency</p>
              <p className="text-2xl font-bold text-sky-400 mt-0.5">{homeCurrency}</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400">Active Destination</p>
              <p className="text-sm font-bold text-white mt-1 truncate">
                {activeDestination?.name || 'Tokyo, Japan'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Destination Finder Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-slate-900/80 to-cyan-950/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Travel Place Recommender</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Find Ideal Destinations by Budget, Season & Duration
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Tell our algorithm your budget, travel month, and days to explore matched worldwide tourist destinations across 18 countries with live maps.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 flex-shrink-0">
            <Link
              to="/explore"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white text-xs font-bold shadow-glow-primary transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Suggest Places for Me</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/map"
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Open Live Map</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols on Large) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Action Cards */}
            <div>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400" />
                <span>Travel Operations & Smart Tools</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/plan-trip"
                  className="glass-panel-interactive p-5 rounded-2xl group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                      AI Powered
                    </span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-base font-bold text-white group-hover:text-sky-400 transition">
                      Plan a New Trip
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Multi-day personalized AI itineraries with weather adaptation and route optimization.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                    <span>Start planning</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </Link>

                <Link
                  to="/hotels"
                  className="glass-panel-interactive p-5 rounded-2xl group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Hotel className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      Verified Stays
                    </span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                      Hotel Search & Booking
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Search authentic accommodations, filter by rating and distance, with official provider deep links.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <span>Explore hotels</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </Link>

                <Link
                  to="/map"
                  className="glass-panel-interactive p-5 rounded-2xl group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      Turn-by-Turn
                    </span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                      Interactive Map & Routing
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Visual route planner powered by OSRM road networks for accurate driving and walking times.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                    <span>Open map</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </Link>

                <Link
                  to="/ai-assistant"
                  className="glass-panel-interactive p-5 rounded-2xl group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Bot className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      Concierge
                    </span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition">
                      AI Travel Assistant
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Context-aware chatbot to modify trips, budget optimizations, dining picks, and rain adaptations.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                    <span>Chat with AI</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Trips Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-sky-400" />
                  <span>Your Trips</span>
                </h3>
                <Link to="/my-trips" className="text-xs font-medium text-sky-400 hover:text-sky-300">
                  View all ({trips.length})
                </Link>
              </div>

              {trips.length === 0 ? (
                <div className="glass-panel p-8 rounded-2xl text-center border border-white/5">
                  <Plane className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-white">No active trips yet</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Create your first trip with Travora AI's intelligent generator.
                  </p>
                  <Link
                    to="/plan-trip"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold shadow-glow-primary transition"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Create My First Trip</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {trips.slice(0, 3).map(trip => (
                    <div
                      key={trip.id}
                      className="glass-panel p-4 rounded-xl flex items-center justify-between hover:border-sky-500/30 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                          {trip.city.substring(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{trip.title}</h4>
                          <p className="text-xs text-slate-400">
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()} • {trip.adults} Adults
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <CurrencyBadge amount={trip.budget} currency={trip.currency} className="text-xs" />
                        <Link
                          to={`/trips/${trip.id}`}
                          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Weather & Tools */}
          <div className="space-y-6">
            {/* Live Destination Weather */}
            {activeDestination && (
              <div>
                <WeatherCard
                  latitude={activeDestination.latitude}
                  longitude={activeDestination.longitude}
                  cityName={activeDestination.city}
                />
              </div>
            )}

            {/* Quick Live Translator Card */}
            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-sky-400">
                  <Languages className="w-4 h-4" />
                  <h4 className="text-sm font-bold text-white">Quick Live Translator</h4>
                </div>
                <span className="text-[10px] text-slate-400">
                  Into {activeDestination?.languageName || 'Japanese'}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  value={quickTranslateInput}
                  onChange={e => setQuickTranslateInput(e.target.value)}
                  placeholder="e.g. Where is the train station?"
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  onKeyDown={e => e.key === 'Enter' && handleQuickTranslate()}
                />
                <button
                  onClick={handleQuickTranslate}
                  disabled={isTranslating}
                  className="w-full py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                >
                  {isTranslating ? 'Translating...' : 'Translate via Real API'}
                </button>
              </div>

              {quickTranslateResult && (
                <div className="mt-3 p-2.5 bg-slate-900/90 rounded-xl border border-sky-500/20 text-xs text-white">
                  <p className="font-medium">{quickTranslateResult}</p>
                </div>
              )}

              <div className="mt-3 text-right">
                <Link to="/translator" className="text-[11px] font-semibold text-sky-400 hover:text-sky-300">
                  Open Full Translator & Phrasebook →
                </Link>
              </div>
            </div>

            {/* Live Exchange Rate Widget */}
            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                  <h4 className="text-sm font-bold text-white">Live Currency Pulse</h4>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  Live Market
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">1 USD to JPY:</span>
                  <span className="font-bold text-white">152.4 JPY</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">1 USD to EUR:</span>
                  <span className="font-bold text-white">0.92 EUR</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">1 USD to INR:</span>
                  <span className="font-bold text-white">83.4 INR</span>
                </div>
              </div>

              <div className="mt-3 text-right">
                <Link to="/currency" className="text-[11px] font-semibold text-sky-400 hover:text-sky-300">
                  Open Currency Converter →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
