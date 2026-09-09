import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Hotel as HotelIcon,
  Search,
  Star,
  MapPin,
  Filter,
  Check,
  ExternalLink,
  Bookmark,
  PlusCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useDestination } from '../context/DestinationContext';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyBadge } from '../components/common/CurrencyBadge';
import api from '../services/api';
import { Hotel } from '../types';

export const HotelsPage: React.FC = () => {
  const { activeDestination } = useDestination();
  const { homeCurrency } = useCurrency();
  const navigate = useNavigate();

  const [destinationQuery, setDestinationQuery] = useState(activeDestination?.city || 'Tokyo');
  const [checkIn, setCheckIn] = useState(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0]);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  // Filters
  const [category, setCategory] = useState<string>('All');
  const [freeCancellationOnly, setFreeCancellationOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('recommended');

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingLoadingId, setBookingLoadingId] = useState<string | null>(null);
  const [savedHotelIds, setSavedHotelIds] = useState<string[]>([]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await api.get('/hotels/search', {
        params: {
          destination: destinationQuery,
          category: category !== 'All' ? category : undefined,
          freeCancellationOnly,
          sortBy,
          centerLat: activeDestination?.latitude,
          centerLon: activeDestination?.longitude,
        },
      });

      if (res.data.success && res.data.hotels) {
        setHotels(res.data.hotels);
      }
    } catch (err) {
      console.error('Failed to load hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [category, freeCancellationOnly, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHotels();
  };

  // Real Booking Action: connects to legitimate booking provider deep link & logs record
  const handleBookHotel = async (hotel: Hotel) => {
    setBookingLoadingId(hotel.id);
    try {
      const res = await api.post('/hotels/book', {
        hotelId: hotel.id,
        checkIn,
        checkOut,
        guests,
        rooms,
      });

      if (res.data.success && res.data.providerRedirectUrl) {
        // Open genuine booking provider in a new tab
        window.open(res.data.providerRedirectUrl, '_blank');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Unable to redirect to booking provider.');
    } finally {
      setBookingLoadingId(null);
    }
  };

  const handleSaveHotel = async (hotel: Hotel) => {
    try {
      await api.post('/saved', {
        placeType: 'hotel',
        placeId: hotel.id,
        name: hotel.name,
        destination: hotel.destination,
        metadata: hotel,
      });
      setSavedHotelIds([...savedHotelIds, hotel.id]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Accommodations & Real Provider Bookings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Find Your Ideal Stay</h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore real accommodations with authentic amenities, transparent cancellation policies, and official booking links.
        </p>
      </div>

      {/* Search Filter Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-xl mb-8">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Destination</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={destinationQuery}
                onChange={e => setDestinationQuery(e.target.value)}
                placeholder="City or destination"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Guests</label>
              <select
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
                className="w-full px-2 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n} Guests</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Rooms</label>
              <select
                value={rooms}
                onChange={e => setRooms(Number(e.target.value))}
                className="w-full px-2 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              >
                {[1, 2, 3, 4].map(n => (
                  <option key={n} value={n}>{n} Room</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold shadow-glow-primary transition flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Hotels</span>
            </button>
          </div>
        </form>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-white/5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>
            {['All', 'Luxury', 'Boutique', 'Mid-scale', 'Budget'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  category === cat
                    ? 'bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/40'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}

            <label className="flex items-center gap-1.5 ml-3 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={freeCancellationOnly}
                onChange={e => setFreeCancellationOnly(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-sky-500"
              />
              <span>Free Cancellation Only</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
            >
              <option value="recommended">Recommended</option>
              <option value="cheapest">Cheapest First</option>
              <option value="highest_rated">Highest Rated</option>
              <option value="closest">Closest to Center</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hotel Listings */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Querying real hotel partners...</p>
        </div>
      ) : hotels.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center">
          <HotelIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No hotels found matching criteria</h3>
          <p className="text-xs text-slate-400 mt-1">Try expanding your filters or search for another city.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(hotel => {
            const isSaved = savedHotelIds.includes(hotel.id);
            return (
              <div
                key={hotel.id}
                className="glass-panel-interactive rounded-2xl overflow-hidden flex flex-col justify-between border border-white/10 group"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-amber-400/30 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{hotel.rating}</span>
                      </span>
                      <button
                        onClick={() => handleSaveHotel(hotel)}
                        className={`p-1.5 rounded-md backdrop-blur-md transition ${
                          isSaved
                            ? 'bg-rose-500 text-white'
                            : 'bg-black/60 text-white hover:bg-black/80'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-sky-950/80 text-sky-300 border border-sky-800/60">
                        {hotel.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-base text-white group-hover:text-sky-400 transition leading-snug">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                      <span className="truncate">{hotel.address}</span>
                    </p>

                    {hotel.distanceKm !== undefined && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        📍 {hotel.distanceKm} km from center
                      </p>
                    )}

                    {/* Amenities tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {hotel.amenities.slice(0, 3).map((a, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-900/80 rounded text-[10px] text-slate-300 border border-white/5"
                        >
                          {a}
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                          +{hotel.amenities.length - 3}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-emerald-400 mt-3 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{hotel.cancellationPolicy}</span>
                    </p>
                  </div>
                </div>

                {/* Footer with Price & Booking Deep Link */}
                <div className="p-5 pt-3 border-t border-white/5 flex items-center justify-between bg-slate-900/40">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Per Night</span>
                    <CurrencyBadge
                      amount={hotel.pricePerNight}
                      currency={hotel.currency}
                      className="text-sm block"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBookHotel(hotel)}
                      disabled={bookingLoadingId === hotel.id}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
                    >
                      {bookingLoadingId === hotel.id ? (
                        <span>Connecting...</span>
                      ) : (
                        <>
                          <span>Book Now</span>
                          <ExternalLink className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
