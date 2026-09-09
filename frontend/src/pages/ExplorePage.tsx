import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Star,
  MapPin,
  Clock,
  Bookmark,
  Plus,
  Filter,
  Utensils,
  Sparkles,
  ExternalLink,
  Languages,
} from 'lucide-react';
import { useDestination } from '../context/DestinationContext';
import { CurrencyBadge } from '../components/common/CurrencyBadge';
import { TranslateModal } from '../components/common/TranslateModal';
import api from '../services/api';
import { Attraction, Restaurant } from '../types';
import { DestinationSuggester } from '../components/explore/DestinationSuggester';

export const ExplorePage: React.FC = () => {
  const { activeDestination, destinations, setActiveDestination } = useDestination();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'matcher' | 'all' | 'attractions' | 'restaurants'>('matcher');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Translation modal
  const [translateTarget, setTranslateTarget] = useState<{ title: string; text: string } | null>(null);

  // Saved ids
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get('/places/explore', {
      params: { destinationId: activeDestination?.id },
    })
      .then(res => {
        if (res.data.success) {
          setAttractions(res.data.attractions || []);
          setRestaurants(res.data.restaurants || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeDestination]);

  const handleSave = async (item: any, type: string) => {
    try {
      await api.post('/saved', {
        placeType: type,
        placeId: item.id,
        name: item.name,
        destination: item.destination || activeDestination?.name || 'General',
        metadata: item,
      });
      setSavedIds([...savedIds, item.id]);
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    'All',
    'Historical places',
    'Museums',
    'Nature',
    'Culture',
    'Entertainment',
    'Local experiences',
  ];

  const filteredAttractions =
    selectedCategory === 'All'
      ? attractions
      : attractions.filter(a => a.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Points of Interest & Culinary Discoveries</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Explore {activeDestination?.name}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover verified monuments, interactive museums, and acclaimed local gastronomy.
          </p>
        </div>

        {/* Destination Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Destination:</span>
          <select
            value={activeDestination?.id || ''}
            onChange={e => {
              const d = destinations.find(dest => dest.id === e.target.value);
              if (d) setActiveDestination(d);
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
          >
            {destinations.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('matcher')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'matcher'
              ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-glow-primary'
              : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>✨ Smart Suggester (Budget & Season)</span>
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'all'
              ? 'bg-sky-500 text-white shadow-glow-primary'
              : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          All Places in {activeDestination?.city || 'Destination'}
        </button>
        <button
          onClick={() => setActiveTab('attractions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'attractions'
              ? 'bg-sky-500 text-white shadow-glow-primary'
              : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Attractions ({attractions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'restaurants'
              ? 'bg-sky-500 text-white shadow-glow-primary'
              : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Restaurants & Dining ({restaurants.length})</span>
        </button>
      </div>

      {/* Smart Suggester Tab Content */}
      {activeTab === 'matcher' && (
        <div className="mb-12">
          <DestinationSuggester
            onSelectDestination={dest => {
              setActiveDestination(dest);
              setActiveTab('all');
            }}
          />
        </div>
      )}

      {/* Category Pills for Attractions */}
      {(activeTab === 'all' || activeTab === 'attractions') && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-lg text-xs transition ${
                selectedCategory === c
                  ? 'bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Attractions Grid */}
      {(activeTab === 'all' || activeTab === 'attractions') && (
        <div className="mb-12">
          {activeTab === 'all' && (
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-400" />
              <span>Top Attractions & Landmarks</span>
            </h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttractions.map(attraction => {
              const isSaved = savedIds.includes(attraction.id);
              return (
                <div
                  key={attraction.id}
                  className="glass-panel-interactive rounded-2xl overflow-hidden flex flex-col justify-between group border border-white/10"
                >
                  <div>
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-amber-400/30 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{attraction.rating}</span>
                        </span>
                        <button
                          onClick={() => handleSave(attraction, 'attraction')}
                          className={`p-1.5 rounded-md backdrop-blur-md transition ${
                            isSaved ? 'bg-rose-500 text-white' : 'bg-black/60 text-white hover:bg-black/80'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-sky-950/80 text-sky-300 border border-sky-800/60">
                          {attraction.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition leading-snug">
                        {attraction.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        <span>{attraction.openingHours}</span>
                      </p>
                      <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                        {attraction.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-white/5 flex items-center justify-between bg-slate-900/40">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Admission</span>
                      {attraction.price === 0 ? (
                        <span className="text-sm font-bold text-emerald-400">Free Entry</span>
                      ) : (
                        <CurrencyBadge amount={attraction.price} currency={attraction.currency} className="text-sm" />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setTranslateTarget({
                            title: attraction.name,
                            text: `${attraction.name}: ${attraction.description}`,
                          })
                        }
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition"
                        title="Translate Description"
                      >
                        <Languages className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        to={`/map?lat=${attraction.latitude}&lon=${attraction.longitude}`}
                        className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-xl text-xs font-semibold border border-sky-500/30 transition flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>View on Map</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Restaurants Grid */}
      {(activeTab === 'all' || activeTab === 'restaurants') && (
        <div>
          {activeTab === 'all' && (
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-400" />
              <span>Authentic Dining & Gastronomy</span>
            </h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(rest => {
              const isSaved = savedIds.includes(rest.id);
              return (
                <div
                  key={rest.id}
                  className="glass-panel-interactive rounded-2xl overflow-hidden flex flex-col justify-between group border border-white/10"
                >
                  <div>
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      <img
                        src={rest.image}
                        alt={rest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-amber-400/30 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{rest.rating}</span>
                        </span>
                        <button
                          onClick={() => handleSave(rest, 'restaurant')}
                          className={`p-1.5 rounded-md backdrop-blur-md transition ${
                            isSaved ? 'bg-rose-500 text-white' : 'bg-black/60 text-white hover:bg-black/80'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 flex gap-1">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-amber-950/80 text-amber-300 border border-amber-800/60">
                          {rest.priceLevel}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition leading-snug">
                        {rest.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{rest.cuisine}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>{rest.address}</span>
                      </p>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {rest.dietary.map((d, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-900 rounded text-[10px] text-slate-300 border border-white/5"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-white/5 flex items-center justify-between bg-slate-900/40">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg. Meal</span>
                      <CurrencyBadge amount={rest.avgCost} currency={rest.currency} className="text-sm" />
                    </div>

                    <Link
                      to={`/map?lat=${rest.latitude}&lon=${rest.longitude}`}
                      className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold border border-amber-500/30 transition flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Map</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inline Translation Modal */}
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
