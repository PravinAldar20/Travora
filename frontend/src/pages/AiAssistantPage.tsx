import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  MapPin,
  Calendar,
  CloudRain,
  DollarSign,
  Languages,
  User,
  RefreshCw,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDestination } from '../context/DestinationContext';
import api from '../services/api';
import { Trip, Destination } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  actionTaken?: string;
  suggestedDestinations?: any[];
  timestamp: string;
}

const QUICK_SUGGESTIONS = [
  'Suggest places for $1500 in summer for 5 days',
  'Best budget-friendly destinations in Asia for a week',
  'Romantic getaways in Europe for 5 days',
  'What should I do if it rains during my trip?',
  'How can I make my Day 2 activities cheaper?',
  'Translate "Could I have the check please?" into Japanese.',
];

export const AiAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const { activeDestination, setActiveDestination } = useDestination();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const promptParam = queryParams.get('prompt');
  const hasHandledPrompt = useRef(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${user?.name || 'there'}! I am your TRAVORA AI Travel Concierge. I have full context of your worldwide destinations, your budget, live weather, and itinerary routes. Ask me for recommendations (e.g. "Suggest places for $1500 in summer for 5 days") or let me know how you'd like to adjust your trip!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load trips to allow user to attach active trip context
    api.get('/trips').then(res => {
      if (res.data.success && res.data.trips && res.data.trips.length > 0) {
        setTrips(res.data.trips);
        setSelectedTripId(res.data.trips[0].id);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customMessage) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: textToSend,
        tripId: selectedTripId || undefined,
      });

      if (res.data.success) {
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: res.data.reply,
          actionTaken: res.data.actionTaken,
          suggestedDestinations: res.data.suggestedDestinations,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ai',
          text: "I'm having trouble connecting right now. Please verify your internet connection or check backend API status.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Automatically execute prompt parameter if passed from another screen
  useEffect(() => {
    if (promptParam && !hasHandledPrompt.current) {
      hasHandledPrompt.current = true;
      handleSend(promptParam);
    }
  }, [promptParam]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-1">
            <Bot className="w-3.5 h-3.5" />
            <span>Trip Context-Aware Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">AI Travel Assistant</h1>
        </div>

        {/* Active Trip Selector */}
        {trips.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Context:</span>
            <select
              value={selectedTripId}
              onChange={e => setSelectedTripId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {trips.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.city})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl flex flex-col h-[640px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md ${
                  msg.sender === 'user' ? 'bg-sky-500' : 'bg-gradient-to-tr from-amber-500 to-amber-400'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-slate-950" />}
              </div>

              <div
                className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-sky-500 text-white rounded-tr-none'
                    : 'bg-slate-900/90 text-slate-100 border border-white/5 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.suggestedDestinations && msg.suggestedDestinations.length > 0 && (
                  <div className="mt-4 space-y-3 pt-3 border-t border-white/10">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Recommended Destinations</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.suggestedDestinations.map((item: any, sIdx: number) => {
                        const d = item.destination;
                        return (
                          <div
                            key={sIdx}
                            className="rounded-2xl bg-slate-950/80 border border-white/10 overflow-hidden hover:border-sky-500/40 transition flex flex-col justify-between"
                          >
                            <div className="relative h-24 overflow-hidden">
                              <img
                                src={d.coverImage}
                                alt={d.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-black text-emerald-400 border border-emerald-400/30">
                                {item.matchScore}% MATCH
                              </div>
                              <div className="absolute bottom-1.5 left-2 right-2">
                                <h5 className="text-xs font-bold text-white truncate drop-shadow">{d.name}</h5>
                              </div>
                            </div>

                            <div className="p-2.5 space-y-1.5 text-[11px]">
                              <div className="flex justify-between text-slate-400">
                                <span>Est. Total:</span>
                                <span className="font-bold text-white">~${item.estimatedTotalCostUSD} USD</span>
                              </div>
                              <div className="flex justify-between text-slate-400">
                                <span>Season:</span>
                                <span className="font-bold text-amber-300 truncate max-w-[110px]">{d.bestSeasons?.join(', ')}</span>
                              </div>

                              <div className="flex items-center gap-1.5 pt-1">
                                <button
                                  onClick={() => {
                                    setActiveDestination(d);
                                    navigate(`/plan?destinationId=${d.id}`);
                                  }}
                                  className="flex-1 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-[10px] transition text-center"
                                >
                                  Plan Trip
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDestination(d);
                                    navigate(`/map?lat=${d.latitude}&lon=${d.longitude}&dest=${d.id}`);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold text-[10px] transition"
                                >
                                  Live Map
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px] ${
                    msg.sender === 'user' ? 'border-sky-400/30 text-sky-100' : 'border-white/5 text-slate-400'
                  }`}
                >
                  {msg.actionTaken && (
                    <span className="font-semibold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                      ⚡ Action: {msg.actionTaken}
                    </span>
                  )}
                  <span className="ml-auto">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Thinking with trip context...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 bg-slate-950/50 border-t border-white/5 flex items-center gap-2 overflow-x-auto">
          {QUICK_SUGGESTIONS.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSend(suggestion)}
              className="px-3 py-1 rounded-full bg-slate-900 hover:bg-sky-500/20 border border-slate-800 hover:border-sky-500/40 text-[11px] text-slate-300 hover:text-sky-300 whitespace-nowrap transition"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-white/10">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything or request trip modifications (e.g. Make Day 2 cheaper)..."
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-2xl shadow-glow-primary transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
