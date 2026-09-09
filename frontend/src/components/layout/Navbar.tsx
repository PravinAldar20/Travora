import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Plane,
  Hotel,
  MapPin,
  Calendar,
  Languages,
  DollarSign,
  Bot,
  User,
  LogOut,
  Menu,
  X,
  Bookmark,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDestination } from '../../context/DestinationContext';
import { WeatherCard } from '../common/WeatherCard';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { activeDestination, destinations, setActiveDestination } = useDestination();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destMenuOpen, setDestMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Compass },
    { name: 'Plan Trip', path: '/plan-trip', icon: Calendar },
    { name: 'Explore', path: '/explore', icon: Plane },
    { name: 'Hotels', path: '/hotels', icon: Hotel },
    { name: 'My Trips', path: '/my-trips', icon: Bookmark },
    { name: 'Map', path: '/map', icon: MapPin },
    { name: 'Translator', path: '/translator', icon: Languages },
    { name: 'Currency', path: '/currency', icon: DollarSign },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Bot },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-[#0B1120]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 p-0.5 shadow-glow-primary transition transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0B1120] rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-sky-400 group-hover:rotate-45 transition duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
                TRAVORA
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-sky-400/80 -mt-1">
                Travel AI
              </span>
            </div>
          </Link>

          {/* Active Destination Selector & Live Weather Snippet */}
          {activeDestination && (
            <div className="hidden lg:flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setDestMenuOpen(!destMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 text-xs text-slate-200 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-semibold">{activeDestination.name}</span>
                  <span className="text-[10px] text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
                    {activeDestination.currency}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {destMenuOpen && (
                  <div className="absolute top-full mt-2 left-0 w-64 glass-dropdown rounded-xl p-2 z-50 animate-fadeIn">
                    <p className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      Switch Global Destination
                    </p>
                    {destinations.map(d => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setActiveDestination(d);
                          setDestMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                          activeDestination.id === d.id
                            ? 'bg-sky-500/20 text-sky-300 font-semibold'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{d.name}</span>
                        <span className="text-[10px] text-slate-400">{d.currency}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Compact Real Weather preview */}
              <WeatherCard
                latitude={activeDestination.latitude}
                longitude={activeDestination.longitude}
                cityName={activeDestination.city}
                compact
              />
            </div>
          )}

          {/* Navigation Links Desktop */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    active
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Profile / Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition"
                >
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-500/30"
                  />
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-semibold text-white leading-tight">{user.name}</span>
                    <span className="text-[10px] text-sky-400">{user.homeCurrency}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass-dropdown rounded-xl p-1.5 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-lg mt-1 transition"
                    >
                      <User className="w-3.5 h-3.5 text-sky-400" />
                      <span>Profile & Preferences</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-lg transition"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-sky-400" />
                      <span>Currency & Language</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-glow-primary transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 xl:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0B1120] border-b border-white/10 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active ? 'bg-sky-500/20 text-sky-400 font-semibold' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 text-sky-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
