import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, MapPin, Star, Hotel, Utensils, Compass, ExternalLink } from 'lucide-react';
import api from '../services/api';
import { SavedItem } from '../types';

export const SavedPlacesPage: React.FC = () => {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await api.get('/saved');
      if (res.data.success && res.data.savedPlaces) {
        setItems(res.data.savedPlaces);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await api.delete(`/saved/${id}`);
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      alert('Failed to remove item.');
    }
  };

  const filteredItems = activeTab === 'all' ? items : items.filter(i => i.placeType === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Saved Places & Bookmarks</h1>
        <p className="text-sm text-slate-400 mt-1">
          Access your saved accommodations, dining spots, attractions, and travel phrases.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
        {['all', 'hotel', 'restaurant', 'attraction'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
              activeTab === tab
                ? 'bg-sky-500 text-white shadow-glow-primary'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'all' ? 'All Saved' : `${tab}s`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading saved items...</div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl text-center border border-white/5">
          <Bookmark className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No saved places yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Click the bookmark icon on any hotel, restaurant, or attraction to save it for later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            let meta: any = {};
            try {
              meta = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata;
            } catch (e) {}

            return (
              <div
                key={item.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-sky-950/80 text-sky-300 border border-sky-800/40">
                      {item.placeType}
                    </span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-bold text-base text-white mt-3">{item.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{item.destination}</span>
                  </p>

                  {meta?.description && (
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2">{meta.description}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                  <span>Saved on {new Date(item.createdAt).toLocaleDateString()}</span>
                  {meta?.rating && (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{meta.rating}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
