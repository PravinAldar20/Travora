import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Droplets, AlertTriangle, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { WeatherData } from '../../types';

interface WeatherCardProps {
  latitude: number;
  longitude: number;
  cityName: string;
  compact?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  latitude,
  longitude,
  cityName,
  compact = false,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/weather?lat=${latitude}&lon=${longitude}`);
      if (res.data.success && res.data.weather) {
        setWeather(res.data.weather);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Weather temporarily unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className={`glass-panel p-4 rounded-xl flex items-center justify-center animate-pulse ${compact ? 'py-2 px-3' : 'min-h-[140px]'}`}>
        <div className="flex items-center gap-2 text-sky-400 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Fetching live weather...</span>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`glass-panel p-3 rounded-xl flex items-center justify-between text-xs text-amber-300 border-amber-500/20 bg-amber-500/5`}>
        <span>{error || 'Weather data unavailable'}</span>
        <button onClick={fetchWeather} className="p-1 hover:bg-white/10 rounded">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm bg-slate-800/60 border border-slate-700/50 px-2.5 py-1.5 rounded-lg">
        {weather.rainProbability >= 40 ? (
          <CloudRain className="w-4 h-4 text-sky-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-400" />
        )}
        <span className="font-semibold text-white">{weather.temperature}°C</span>
        <span className="text-xs text-slate-400 hidden sm:inline">{weather.condition}</span>
        {weather.rainProbability > 0 && (
          <span className="text-[11px] text-sky-400/90 font-medium">({weather.rainProbability}% rain)</span>
        )}
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-slate-400">{cityName} Live Weather</h4>
            <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-950/60 border border-sky-800/40 px-1.5 py-0.5 rounded">
              Live Satellite
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">{weather.temperature}°C</span>
            <span className="text-sm font-medium text-slate-300">{weather.condition}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Feels like {weather.apparentTemperature}°C
          </p>
        </div>

        <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
          {weather.rainProbability >= 50 ? (
            <CloudRain className="w-8 h-8" />
          ) : (
            <Sun className="w-8 h-8 text-amber-400" />
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-xs text-slate-300">
        <div className="flex items-center gap-1.5">
          <CloudRain className="w-3.5 h-3.5 text-sky-400" />
          <span>{weather.rainProbability}% Rain</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span>{weather.humidity}% Hum</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-emerald-400" />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>

      {/* Rain Alert Banner */}
      {weather.alerts && weather.alerts.length > 0 && (
        <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/25 rounded-lg flex items-start gap-2 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{weather.alerts[0]}</span>
        </div>
      )}
    </div>
  );
};
