import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  MapPin,
  Check,
  ArrowRight,
  ArrowLeft,
  CloudRain,
  Hotel,
  Shield,
} from 'lucide-react';
import { useDestination } from '../context/DestinationContext';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';

const TRAVEL_STYLES = [
  'Budget',
  'Standard',
  'Luxury',
  'Adventure',
  'Relaxation',
  'Family',
  'Romantic',
  'Solo',
  'Cultural',
  'Food',
  'Nature',
];

const INTERESTS_LIST = [
  'Historical places',
  'Museums',
  'Beaches',
  'Mountains',
  'Nature',
  'Adventure',
  'Shopping',
  'Food',
  'Nightlife',
  'Photography',
  'Religious places',
  'Culture',
  'Entertainment',
  'Hidden gems',
  'Local experiences',
];

export const PlanTripPage: React.FC = () => {
  const { destinations, activeDestination } = useDestination();
  const { homeCurrency } = useCurrency();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [destinationId, setDestinationId] = useState<string>(activeDestination?.id || 'tokyo-japan');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0]
  );
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [budget, setBudget] = useState<number>(2500);
  const [currency, setCurrency] = useState<string>(homeCurrency || 'USD');
  const [travelStyle, setTravelStyle] = useState<string>('Standard');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Historical places',
    'Food',
    'Culture',
    'Museums',
  ]);

  // Preferences
  const [walkingTolerance, setWalkingTolerance] = useState<string>('Moderate');
  const [activityIntensity, setActivityIntensity] = useState<string>('Balanced');
  const [transportPreference, setTransportPreference] = useState<string>('Public Transit & Walking');
  const [foodPreference, setFoodPreference] = useState<string>('Local Specialties');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerateItinerary = async () => {
    setLoading(true);
    setError(null);

    const selectedDest = destinations.find(d => d.id === destinationId) || activeDestination;

    try {
      // 1. Call AI itinerary generator endpoint
      const genRes = await api.post('/trips/generate-itinerary', {
        destinationId,
        startDate,
        endDate,
        adults,
        children,
        totalBudget: budget,
        currency,
        travelStyle,
        interests: selectedInterests,
        preferences: {
          walkingTolerance,
          activityIntensity,
          transport: transportPreference,
          food: foodPreference,
        },
      });

      if (!genRes.data.success || !genRes.data.data) {
        throw new Error(genRes.data.error || 'Failed to generate itinerary.');
      }

      const generatedData = genRes.data.data;

      // 2. Flatten generated days activities into ItineraryItems
      const itineraryItems: any[] = [];
      generatedData.days.forEach((day: any) => {
        day.activities.forEach((act: any) => {
          itineraryItems.push(act);
        });
      });

      // 3. Save as persistent Trip in PostgreSQL
      const saveRes = await api.post('/trips', {
        title: generatedData.tripTitle || `Trip to ${selectedDest?.name}`,
        destination: selectedDest?.name || 'Tokyo, Japan',
        country: selectedDest?.country || 'Japan',
        city: selectedDest?.city || 'Tokyo',
        latitude: selectedDest?.latitude || 35.6762,
        longitude: selectedDest?.longitude || 139.6503,
        startDate,
        endDate,
        adults,
        children,
        budget,
        currency,
        travelStyle,
        interests: selectedInterests,
        itineraryItems,
      });

      if (saveRes.data.success && saveRes.data.trip) {
        navigate(`/trips/${saveRes.data.trip.id}`);
      }
    } catch (err: any) {
      console.error('Itinerary generation error:', err);
      setError(
        err.response?.data?.error || err.message || 'Unable to generate itinerary. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Itinerary Synthesis</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Create Your Perfect Journey</h1>
        <p className="text-sm text-slate-400 mt-1">
          Tell Travora about your dates, budget, and travel preferences to generate a fully route-optimized itinerary.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === i ? 'w-10 bg-sky-500 shadow-glow-primary' : step > i ? 'w-6 bg-emerald-500' : 'w-6 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
        {/* STEP 1: Destination, Dates & Travelers */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
              <MapPin className="w-5 h-5 text-sky-400" />
              <span>Step 1: Destination & Travel Dates</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Destination</label>
              <select
                value={destinationId}
                onChange={e => setDestinationId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
              >
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.currency} • {d.languageName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Adults (18+)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={adults}
                  onChange={e => setAdults(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Children</label>
                <input
                  type="number"
                  min="0"
                  max="6"
                  value={children}
                  onChange={e => setChildren(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-glow-primary transition"
              >
                <span>Continue to Budget & Style</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Budget & Travel Style */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Step 2: Budget & Travel Style</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Total Budget</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Preferred Currency</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="SGD">SGD (S$)</option>
                  <option value="CHF">CHF</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Travel Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TRAVEL_STYLES.map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setTravelStyle(style)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition ${
                      travelStyle === style
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-glow-primary transition"
              >
                <span>Continue to Interests</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Interests & Preferences */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Step 3: Interests & Activity Preferences</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                What interests you? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INTERESTS_LIST.map(interest => {
                  const selected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between border transition ${
                        selected
                          ? 'bg-sky-500/20 border-sky-500/60 text-sky-300 font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{interest}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Walking Tolerance</label>
                <select
                  value={walkingTolerance}
                  onChange={e => setWalkingTolerance(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                >
                  <option value="Light">Light (&lt; 5,000 steps/day)</option>
                  <option value="Moderate">Moderate (5,000 - 12,000 steps)</option>
                  <option value="High">High (Avid walker, 15,000+ steps)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Activity Intensity</label>
                <select
                  value={activityIntensity}
                  onChange={e => setActivityIntensity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                >
                  <option value="Relaxed">Relaxed (1-2 main activities/day)</option>
                  <option value="Balanced">Balanced (3-4 activities/day)</option>
                  <option value="Action-Packed">Action-Packed (Full day schedule)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={loading || selectedInterests.length === 0}
                onClick={handleGenerateItinerary}
                className="px-8 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white rounded-xl text-sm font-bold shadow-glow-primary transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Weather & Routes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
