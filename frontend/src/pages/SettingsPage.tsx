import React, { useState } from 'react';
import { DollarSign, Languages, Shield, Bell, Check, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { homeCurrency, setHomeCurrency } = useCurrency();

  const [selectedCurrency, setSelectedCurrency] = useState(homeCurrency || 'USD');
  const [preferredTranslationLang, setPreferredTranslationLang] = useState('ja');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setHomeCurrency(selectedCurrency);
    try {
      const res = await api.put('/user/profile', {
        homeCurrency: selectedCurrency,
      });
      if (res.data.success) {
        updateUser({ homeCurrency: selectedCurrency });
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Platform Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure default currencies, translation targets, and system preferences.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8">
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Settings saved successfully! Currency converted across all views.</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Currency Display Preference</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              All prices across hotels, restaurants, budget totals, and itineraries will be converted to this currency.
            </p>
            <select
              value={selectedCurrency}
              onChange={e => setSelectedCurrency(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
            >
              <option value="USD">USD ($ - United States Dollar)</option>
              <option value="EUR">EUR (€ - Eurozone Euro)</option>
              <option value="GBP">GBP (£ - British Pound Sterling)</option>
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="JPY">JPY (¥ - Japanese Yen)</option>
              <option value="AED">AED (د.إ - UAE Dirham)</option>
              <option value="AUD">AUD (A$ - Australian Dollar)</option>
              <option value="CAD">CAD (C$ - Canadian Dollar)</option>
              <option value="SGD">SGD (S$ - Singapore Dollar)</option>
              <option value="CHF">CHF (Swiss Franc)</option>
            </select>
          </div>

          <div className="pt-6 border-t border-white/5">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Languages className="w-4 h-4 text-sky-400" />
              <span>Default Translation Language</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Default target language suggested when translating travel content.
            </p>
            <select
              value={preferredTranslationLang}
              onChange={e => setPreferredTranslationLang(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
            >
              <option value="ja">Japanese (日本語)</option>
              <option value="fr">French (Français)</option>
              <option value="es">Spanish (Español)</option>
              <option value="de">German (Deutsch)</option>
              <option value="it">Italian (Italiano)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="zh">Chinese (中文)</option>
              <option value="ar">Arabic (العربية)</option>
            </select>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl text-xs shadow-glow-primary transition flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
