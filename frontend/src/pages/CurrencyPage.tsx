import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ArrowRightLeft,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useDestination } from '../context/DestinationContext';
import api from '../services/api';

const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
];

export const CurrencyPage: React.FC = () => {
  const { homeCurrency, rates, lastUpdated, convert, formatCurrency } = useCurrency();
  const { activeDestination } = useDestination();

  const [fromCurrency, setFromCurrency] = useState<string>(homeCurrency || 'USD');
  const [toCurrency, setToCurrency] = useState<string>(activeDestination?.currency || 'JPY');
  const [amount, setAmount] = useState<number>(1000);
  const [conversionResult, setConversionResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Synchronize when active destination changes
  useEffect(() => {
    if (activeDestination?.currency) {
      setToCurrency(activeDestination.currency);
    }
  }, [activeDestination]);

  const handleConvert = async () => {
    if (amount <= 0) return;
    setLoading(true);
    try {
      const res = await api.post('/currency/convert', {
        amount,
        from: fromCurrency,
        to: toCurrency,
      });

      if (res.data.success && res.data.conversion) {
        setConversionResult(res.data.conversion);
      }
    } catch (err) {
      console.error('Convert failed, using local conversion calculation:', err);
      // Context fallback
      const convertedVal = convert(amount, fromCurrency, toCurrency);
      setConversionResult({
        originalAmount: amount,
        fromCurrency,
        convertedAmount: convertedVal,
        toCurrency,
        exchangeRate: rates[toCurrency] / rates[fromCurrency],
        lastUpdated,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleConvert();
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    const prevFrom = fromCurrency;
    const prevTo = toCurrency;
    setFromCurrency(prevTo);
    setToCurrency(prevFrom);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Real Live Central Bank Exchange Rates</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Live Currency Converter</h1>
        <p className="text-sm text-slate-400 mt-1">
          Accurate, real-time foreign currency conversions powered directly by global financial feeds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Converter Card (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
            {/* FROM */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">FROM</label>
              <select
                value={fromCurrency}
                onChange={e => setFromCurrency(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-sky-500"
              >
                {POPULAR_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center sm:pt-6">
              <button
                onClick={handleSwap}
                className="p-3 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-2xl text-sky-400 hover:text-white transition shadow-md"
                title="Swap Currencies"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* TO */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">TO</label>
              <select
                value={toCurrency}
                onChange={e => setToCurrency(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-sky-500"
              >
                {POPULAR_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mt-6">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Amount to Convert</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Result Banner */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-sky-950/60 to-slate-900/80 border border-sky-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  {amount.toLocaleString()} {fromCurrency} =
                </p>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {conversionResult
                    ? formatCurrency(conversionResult.convertedAmount, toCurrency)
                    : formatCurrency(convert(amount, fromCurrency, toCurrency), toCurrency)}
                </div>
              </div>

              {conversionResult && (
                <div className="text-right text-xs text-slate-400">
                  <p className="font-semibold text-sky-400">
                    1 {fromCurrency} = {(conversionResult.exchangeRate).toFixed(4)} {toCurrency}
                  </p>
                  <p className="text-[10px] mt-0.5">Real-time market rate</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Last updated: {lastUpdated || 'Recently synced'}</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Central Feed</span>
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleConvert}
              disabled={loading}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-glow-primary transition flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Rate</span>
            </button>
          </div>
        </div>

        {/* Popular Pairs Quick Table (1 Col) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Popular Travel Pairs (vs 1 USD)</span>
          </h3>

          <div className="space-y-2 text-xs">
            {POPULAR_CURRENCIES.filter(c => c.code !== 'USD').map(c => {
              const rate = rates[c.code] || 1;
              return (
                <div
                  key={c.code}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/30 transition"
                >
                  <span className="font-medium text-slate-300">
                    USD / {c.code} ({c.symbol})
                  </span>
                  <span className="font-bold text-white">
                    {rate > 50 ? rate.toFixed(1) : rate.toFixed(4)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
