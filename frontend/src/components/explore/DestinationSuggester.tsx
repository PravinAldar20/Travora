import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  DollarSign,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  ArrowRight,
  Bot,
  CheckCircle2,
  Sliders,
  Globe,
  Sun,
  Snowflake,
  CloudSun,
  Flower2,
  Star,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { CurrencyBadge } from '../common/CurrencyBadge';
import { DestinationRecommendation, Destination } from '../../types';
import { useDestination } from '../../context/DestinationContext';
import api from '../../services/api';

interface DestinationSuggesterProps {
  initialCompact?: boolean;
  onSelectDestination?: (destination: Destination) => void;
}

const SEASONS = [
  { label: 'Any Season', value: 'Any', icon: Globe },
  { label: 'Spring', value: 'Spring', icon: Flower2 },
  { label: 'Summer', value: 'Summer', icon: Sun },
  { label: 'Autumn', value: 'Autumn', icon: CloudSun },
  { label: 'Winter', value: 'Winter', icon: Snowflake },
];

const VIBES = [
  { label: 'All Vibes', value: 'All' },
  { label: 'Beaches & Sea', value: 'Beaches' },
  { label: 'Culture & History', value: 'Culture' },
  { label: 'Mountains & Adventure', value: 'Mountain' },
  { label: 'Romantic & Honeymoon', value: 'Romantic' },
  { label: 'Luxury & Skyline', value: 'Luxury' },
  { label: 'Budget-Friendly', value: 'Budget' },
];

const CONTINENTS = [
  'All',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Africa',
  'Oceania',
];

export const DestinationSuggester: React.FC<DestinationSuggesterProps> = ({
  initialCompact = false,
  onSelectDestination,
}) => {
  const navigate = useNavigate();
  const { setActiveDestination } = useDestination();

  const [budgetUSD, setBudgetUSD] = useState<number>(1500);
  const [season, setSeason] = useState<string>('Summer');
  const [days, setDays] = useState<number>(5);
  const [vibe, setVibe] = useState<string>('All');
  const [continent, setContinent] = useState<string>('All');

  const [recommendations, setRecommendations] = useState<DestinationRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await api.post('/places/recommend', {
        budgetUSD,
        season,
        days,
        vibe,
        continent,
      });

      if (res.data.success && res.data.recommendations) {
        setRecommendations(res.data.recommendations);
      }
    } catch (err) {
      console.error('Failed to fetch destination recommendations:', err);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  // Run on initial mount with default values
  useEffect(() => {
    fetchRecommendations();
  }, [season, days, vibe, continent]);

  const handlePlanTrip = (dest: Destination) => {
    setActiveDestination(dest);
    if (onSelectDestination) onSelectDestination(dest);
    navigate(`/plan?destinationId=${dest.id}&days=${days}&budget=${budgetUSD}`);
  };

  const handleOpenMap = (dest: Destination) => {
    setActiveDestination(dest);
    navigate(`/map?lat=${dest.latitude}&lon=${dest.longitude}&dest=${dest.id}`);
  };

  const handleAskAI = (dest: Destination) => {
    navigate(`/ai-assistant?prompt=${encodeURIComponent(`Plan a detailed ${days}-day trip to ${dest.name} for a budget around $${budgetUSD}`)}`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Search & Filter Header Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>AI Worldwide Destination Matcher</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Where Should You Travel Next?
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Tell us your budget, preferred season, and trip duration — we will calculate the best worldwide match.
              </p>
            </div>

            <button
              onClick={fetchRecommendations}
              disabled={loading}
              className="self-start md:self-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white text-xs font-bold shadow-glow-primary transition flex items-center gap-2 disabled:opacity-50"
            >
              <Compass className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Finding Destinations...' : 'Update Matches'}</span>
            </button>
          </div>

          {/* Controls Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Budget Slider & Input */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Total Budget</span>
                </span>
                <span className="text-sm font-extrabold text-emerald-400">
                  ${budgetUSD.toLocaleString()} USD
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="6000"
                step="100"
                value={budgetUSD}
                onChange={e => setBudgetUSD(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-medium">
                <span>$300 (Backpacker)</span>
                <span>$2,500</span>
                <span>$6,000+ (Luxury)</span>
              </div>
            </div>

            {/* 2. Duration / Days */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Trip Duration</span>
                </span>
                <span className="text-sm font-extrabold text-sky-400">
                  {days} {days === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[3, 5, 7, 10, 14].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      days === d
                        ? 'bg-sky-500 text-white shadow-glow-primary'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 mt-2 text-center block">
                Avg. est. cost: ~${Math.round(budgetUSD / days)} / day
              </span>
            </div>

            {/* 3. Season */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Travel Season</span>
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {SEASONS.slice(1).map(s => {
                  const Icon = s.icon;
                  const isSelected = season === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSeason(s.value)}
                      className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setSeason('Any')}
                className={`mt-1.5 py-1 text-[10px] font-medium rounded-md transition text-center ${
                  season === 'Any' ? 'text-sky-400 underline font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Or match any season
              </button>
            </div>

            {/* 4. Region & Vibe */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Sliders className="w-3.5 h-3.5 text-violet-400" />
                <span>Vibe & Region</span>
              </span>
              <div className="space-y-2">
                <select
                  value={vibe}
                  onChange={e => setVibe(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {VIBES.map(v => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
                <select
                  value={continent}
                  onChange={e => setContinent(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="All">All Continents</option>
                  {CONTINENTS.slice(1).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Destinations Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">
              Recommended Destinations ({recommendations.length})
            </h3>
            <span className="text-xs text-slate-400">
              Ranked by weather suitability, duration fit & daily budget
            </span>
          </div>
          <span className="text-xs text-sky-400 font-medium">
            Calculated for {days} Days • ${budgetUSD} USD
          </span>
        </div>

        {recommendations.length === 0 && !loading && (
          <div className="text-center py-16 glass-panel rounded-3xl border border-white/5">
            <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-bounce" />
            <p className="text-base font-semibold text-white">No exact matches found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your budget or selecting "All Continents" to explore more options.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.slice(0, initialCompact ? 3 : 9).map((rec, idx) => {
            const dest = rec.destination;
            const isTopMatch = idx === 0;

            return (
              <div
                key={dest.id}
                className={`glass-panel rounded-3xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between group ${
                  isTopMatch
                    ? 'border-sky-500/40 bg-gradient-to-b from-sky-950/20 to-slate-900/90 shadow-glow-primary'
                    : 'border-white/10 hover:border-white/20 bg-slate-900/70'
                }`}
              >
                <div>
                  {/* Image & Match Score Badge */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={dest.coverImage}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Match Score */}
                    <div className="absolute top-3 right-3">
                      <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-emerald-400/40 text-emerald-400 text-xs font-black shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>{rec.matchScore}% MATCH</span>
                      </div>
                    </div>

                    {/* Budget Fit & Continent Tags */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                        {dest.continent || dest.country}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold backdrop-blur-md ${
                          rec.budgetFit === 'Under Budget'
                            ? 'bg-emerald-500/80 text-white'
                            : rec.budgetFit === 'On Budget'
                            ? 'bg-sky-500/80 text-white'
                            : 'bg-amber-500/80 text-slate-950'
                        }`}
                      >
                        {rec.budgetFit}
                      </span>
                    </div>

                    {/* Title & Location */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h4 className="text-xl font-black text-white leading-tight drop-shadow-md">
                        {dest.name}
                      </h4>
                      <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span>{dest.city}, {dest.country}</span>
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>

                    {/* Cost & Season Highlights */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                      <div className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Total for {days} Days
                        </span>
                        <span className="text-sm font-extrabold text-white">
                          ~${rec.estimatedTotalCostUSD.toLocaleString()} USD
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          ~${dest.estimatedDailyCostUSD}/day
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Prime Season
                        </span>
                        <span className="text-xs font-bold text-amber-300 truncate block">
                          {dest.bestSeasons?.join(', ') || 'All Year'}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Ideal: {dest.idealDaysMin}-{dest.idealDaysMax} days
                        </span>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div className="space-y-1 pt-1">
                      {rec.matchReasons.slice(0, 2).map((reason, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                          <span className="truncate">{reason}</span>
                        </div>
                      ))}
                    </div>

                    {/* Top Attractions preview */}
                    {dest.topAttractions && dest.topAttractions.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                          Top Highlights
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {dest.topAttractions.slice(0, 2).map(att => (
                            <span
                              key={att.id}
                              className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-white/5 truncate max-w-[200px]"
                            >
                              {att.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-2 border-t border-white/5 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlanTrip(dest)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-glow-primary transition flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Plan Trip Here</span>
                    </button>

                    <button
                      onClick={() => handleOpenMap(dest)}
                      className="py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition flex items-center justify-center gap-1"
                      title="View live map & turn-by-turn routes"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Live Map</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleAskAI(dest)}
                    className="w-full py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] font-medium transition flex items-center justify-center gap-1"
                  >
                    <Bot className="w-3 h-3 text-amber-400" />
                    <span>Ask AI Assistant about {dest.city}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
