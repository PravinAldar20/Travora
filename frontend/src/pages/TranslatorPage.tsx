import React, { useState, useEffect } from 'react';
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Trash2,
  Bookmark,
  Sparkles,
  RefreshCw,
  AlertCircle,
  BookOpen,
  Clock,
} from 'lucide-react';
import { useDestination } from '../context/DestinationContext';
import api from '../services/api';

interface PhraseCategory {
  category: string;
  phrases: string[];
}

interface TranslationHistoryItem {
  id: string;
  originalText: string;
  sourceLang: string;
  targetLang: string;
  translatedText: string;
  createdAt: string;
}

export const TranslatorPage: React.FC = () => {
  const { activeDestination } = useDestination();

  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState(activeDestination?.language || 'ja');
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Phrasebook state
  const [categories, setCategories] = useState<PhraseCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Greetings');

  // History state
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);

  // Update target language recommendation if destination changes
  useEffect(() => {
    if (activeDestination?.language) {
      setTargetLang(activeDestination.language);
    }
  }, [activeDestination]);

  useEffect(() => {
    // Load phrasebook categories
    api.get('/translate/phrasebook')
      .then(res => {
        if (res.data.success && res.data.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch(() => {});

    // Load translation history
    api.get('/translate/history')
      .then(res => {
        if (res.data.success && res.data.history) {
          setHistory(res.data.history);
        }
      })
      .catch(() => {});
  }, []);

  const handleTranslate = async (customText?: string) => {
    const textToTranslate = customText || sourceText;
    if (!textToTranslate.trim()) {
      setError('Please enter text to translate.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/translate', {
        text: textToTranslate.trim(),
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });

      if (res.data.success) {
        setTranslatedText(res.data.translatedText);
        setDetectedLang(res.data.detectedSourceLanguage || null);
        setProvider(res.data.provider || 'Real Translation Engine');

        // Refresh history
        api.get('/translate/history').then(hRes => {
          if (hRes.data.success) setHistory(hRes.data.history);
        });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Translation service is currently unreachable. Please check your network or API keys.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    if (sourceLang === 'auto') return;
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    setSourceLang(prevTgt);
    setTargetLang(prevSrc);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
    setDetectedLang(null);
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await api.delete(`/translate/history/${id}`);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectPhrase = (phrase: string) => {
    setSourceText(phrase);
    setSourceLang('en');
    handleTranslate(phrase);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-2">
          <Languages className="w-3.5 h-3.5" />
          <span>Real Multi-Language Translation Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Live Travel Translator</h1>
        <p className="text-sm text-slate-400 mt-1">
          Communicate seamlessly across cultures. Every translation is processed live through real translation networks without hard-coded replies.
        </p>

        {activeDestination && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-sky-300 bg-sky-950/60 border border-sky-800/40 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Destination context active: Translating for <b>{activeDestination.name}</b> (Suggested: {activeDestination.languageName})
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Translation Workbench */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl mb-10">
        {/* Language Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold">From:</span>
            <select
              value={sourceLang}
              onChange={e => setSourceLang(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="auto">Auto-detect Language</option>
              <option value="en">English</option>
              <option value="ja">Japanese (日本語)</option>
              <option value="fr">French (Français)</option>
              <option value="es">Spanish (Español)</option>
              <option value="de">German (Deutsch)</option>
              <option value="it">Italian (Italiano)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="zh">Chinese (中文)</option>
              <option value="ar">Arabic (العربية)</option>
              <option value="ko">Korean (한국어)</option>
            </select>
          </div>

          <button
            onClick={handleSwap}
            disabled={sourceLang === 'auto'}
            className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-xl border border-white/10 text-slate-300 hover:text-white transition"
            title="Swap Languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold">To:</span>
            <select
              value={targetLang}
              onChange={e => setTargetLang(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="ja">Japanese (日本語)</option>
              <option value="fr">French (Français)</option>
              <option value="es">Spanish (Español)</option>
              <option value="de">German (Deutsch)</option>
              <option value="it">Italian (Italiano)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="zh">Chinese (中文)</option>
              <option value="ar">Arabic (العربية)</option>
              <option value="ko">Korean (한국어)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Dual Input/Output Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {/* Source Input Panel */}
          <div className="flex flex-col justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 min-h-[220px]">
            <textarea
              value={sourceText}
              onChange={e => setSourceText(e.target.value)}
              placeholder="Enter text or paste phrases to translate..."
              className="w-full h-36 bg-transparent text-sm text-white placeholder-slate-500 resize-none focus:outline-none leading-relaxed"
              maxLength={1500}
            />

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-500">
              <span>{sourceText.length} / 1500 chars</span>
              {sourceText && (
                <button
                  onClick={handleClear}
                  className="text-slate-400 hover:text-white transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Target Output Panel */}
          <div className="flex flex-col justify-between p-4 rounded-2xl bg-slate-900/95 border border-sky-500/20 min-h-[220px] relative">
            {loading ? (
              <div className="h-36 flex flex-col items-center justify-center gap-2 text-sky-400">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-xs">Processing real translation...</span>
              </div>
            ) : translatedText ? (
              <div className="h-36 overflow-y-auto">
                <p className="text-sm font-medium text-white leading-relaxed font-sans">{translatedText}</p>
                {detectedLang && (
                  <span className="text-[10px] text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded mt-2 inline-block border border-sky-800/40">
                    Detected: {detectedLang.toUpperCase()}
                  </span>
                )}
              </div>
            ) : (
              <div className="h-36 flex items-center justify-center text-slate-500 text-xs italic">
                Translation will appear here in real-time.
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
              <span>Provider: {provider || 'Real Translation API'}</span>
              {translatedText && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-slate-300 hover:text-white font-semibold transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Translate Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => handleTranslate()}
            disabled={loading || !sourceText.trim()}
            className="px-8 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white rounded-xl text-sm font-bold shadow-glow-primary transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Contacting Translation Engine...</span>
              </>
            ) : (
              <>
                <Languages className="w-4 h-4" />
                <span>Translate Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Travel Phrasebook & Translation History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Travel Phrasebook (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2 text-sky-400">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Travel Phrasebook</h3>
            </div>
            <span className="text-xs text-slate-400">Click any phrase to translate live</span>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {categories.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeCategory === cat.category
                    ? 'bg-sky-500 text-white shadow-glow-primary'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Phrase Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(categories.find(c => c.category === activeCategory)?.phrases || []).map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPhrase(phrase)}
                className="p-3 bg-slate-900/70 hover:bg-sky-500/20 border border-slate-800 hover:border-sky-500/40 rounded-xl text-left text-xs text-slate-200 transition group flex items-center justify-between"
              >
                <span>{phrase}</span>
                <Languages className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition flex-shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Translation History (1 Col) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2 text-sky-400">
              <Clock className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Recent Translations</h3>
            </div>
            <span className="text-xs text-slate-500">{history.length} items</span>
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">
              No translation history yet. Translations will be saved to your account automatically.
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {history.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      {item.sourceLang.toUpperCase()} → {item.targetLang.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleDeleteHistory(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-slate-300 line-clamp-1">{item.originalText}</p>
                  <p className="text-sky-400 font-medium line-clamp-1">{item.translatedText}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
