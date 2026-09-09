import React, { useState } from 'react';
import { X, Languages, Copy, Check, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { useDestination } from '../../context/DestinationContext';

interface TranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  title: string;
}

export const TranslateModal: React.FC<TranslateModalProps> = ({
  isOpen,
  onClose,
  originalText,
  title,
}) => {
  const { activeDestination } = useDestination();
  const [targetLang, setTargetLang] = useState<string>(activeDestination?.language || 'ja');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTranslate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/translate', {
        text: originalText,
        sourceLanguage: 'auto',
        targetLanguage: targetLang,
      });

      if (res.data.success && res.data.translatedText) {
        setTranslatedText(res.data.translatedText);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Translation request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 relative border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-sky-400">
            <Languages className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-white">Translate: {title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selection Bar */}
        <div className="flex items-center gap-3 my-4">
          <span className="text-xs text-slate-400 font-medium">Translate into:</span>
          <select
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-sky-500"
          >
            <option value="ja">Japanese (日本語)</option>
            <option value="fr">French (Français)</option>
            <option value="es">Spanish (Español)</option>
            <option value="de">German (Deutsch)</option>
            <option value="it">Italian (Italiano)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="zh">Chinese (中文)</option>
            <option value="ar">Arabic (العربية)</option>
            <option value="en">English</option>
          </select>

          <button
            onClick={handleTranslate}
            disabled={loading}
            className="ml-auto px-4 py-1.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition"
          >
            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>Translate</span>
          </button>
        </div>

        {/* Original Text Box */}
        <div className="mb-4">
          <label className="text-xs text-slate-400 font-medium block mb-1">Original Text</label>
          <div className="p-3 bg-slate-900/60 rounded-xl text-sm text-slate-300 max-h-32 overflow-y-auto border border-white/5">
            {originalText}
          </div>
        </div>

        {/* Translated Text Box */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-sky-400 font-medium">Real Translation</label>
            {translatedText && (
              <button
                onClick={handleCopy}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            )}
          </div>
          <div className="p-3 bg-slate-900/90 rounded-xl text-sm text-white min-h-[90px] border border-sky-500/20">
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400 italic text-xs py-4">
                <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                <span>Translating via real backend API...</span>
              </div>
            ) : error ? (
              <span className="text-red-400 text-xs">{error}</span>
            ) : translatedText ? (
              <p className="leading-relaxed font-sans">{translatedText}</p>
            ) : (
              <span className="text-slate-500 text-xs italic">Click 'Translate' to request translation.</span>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm text-slate-200 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
