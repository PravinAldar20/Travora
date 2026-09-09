import React from 'react';
import { Compass, Heart, Shield, Globe2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080d1a] border-t border-white/5 text-slate-400 text-xs py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">TRAVORA</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            Complete, real, full-stack AI travel platform. Intelligent itineraries, live weather, real currency conversion, authentic translations, and smart route optimization.
          </p>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Core Features</h5>
          <ul className="space-y-2">
            <li><Link to="/plan-trip" className="hover:text-sky-400 transition">AI Trip Planner</Link></li>
            <li><Link to="/hotels" className="hover:text-sky-400 transition">Verified Hotel Search & Deep Booking</Link></li>
            <li><Link to="/map" className="hover:text-sky-400 transition">Interactive Routing Map</Link></li>
            <li><Link to="/explore" className="hover:text-sky-400 transition">Global Destination Explorer</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Live Tools</h5>
          <ul className="space-y-2">
            <li><Link to="/translator" className="hover:text-sky-400 transition">Real Translation Engine</Link></li>
            <li><Link to="/currency" className="hover:text-sky-400 transition">Live Exchange Rates</Link></li>
            <li><Link to="/ai-assistant" className="hover:text-sky-400 transition">Contextual AI Assistant</Link></li>
            <li><Link to="/my-trips" className="hover:text-sky-400 transition">Trip Manager & Itinerary Editor</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Verified Real APIs</h5>
          <div className="space-y-1.5 text-slate-400 text-xs">
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Open-Meteo Global Satellite Weather
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Open Exchange Rates Financial Feed
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              OSRM Real Turn-by-Turn Road Network
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              MyMemory Live Multi-Language Translator
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
        <p>© {new Date().getFullYear()} Travora Travel AI Platform. Built with PostgreSQL, Express, React & Prisma.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            JWT Encrypted Sessions
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Globe2 className="w-3.5 h-3.5 text-sky-400" />
            Global Coordinates
          </span>
        </div>
      </div>
    </footer>
  );
};
