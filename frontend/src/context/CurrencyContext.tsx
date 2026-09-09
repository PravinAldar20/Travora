import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface CurrencyContextType {
  homeCurrency: string;
  rates: Record<string, number>;
  lastUpdated: string;
  isLoading: boolean;
  setHomeCurrency: (currency: string) => void;
  convert: (amount: number, from: string, to?: string) => number;
  formatCurrency: (amount: number, currency: string) => string;
  formatDual: (amount: number, localCurrency: string) => { localStr: string; homeStr: string; isDifferent: boolean };
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  AED: 'AED ',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
  CHF: 'CHF ',
  CNY: '¥',
  THB: '฿',
  IDR: 'Rp ',
  KRW: '₩',
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [homeCurrency, setHomeCurrencyState] = useState<string>('USD');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync with user's homeCurrency preference if set
  useEffect(() => {
    if (user?.homeCurrency) {
      setHomeCurrencyState(user.homeCurrency);
    }
  }, [user]);

  useEffect(() => {
    // Fetch real live rates from Travora backend
    api.get('/currency/rates')
      .then(res => {
        if (res.data.success && res.data.rates) {
          setRates(res.data.rates);
          setLastUpdated(res.data.lastUpdated);
        }
      })
      .catch(err => {
        console.error('Failed to load currency rates:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const setHomeCurrency = (curr: string) => {
    setHomeCurrencyState(curr);
  };

  const convert = (amount: number, from: string, to?: string): number => {
    const target = to || homeCurrency;
    const f = from.toUpperCase();
    const t = target.toUpperCase();

    if (f === t) return amount;
    if (!rates[f] || !rates[t]) return amount;

    // Convert via USD base: targetAmount = amount * (rate[target] / rate[from])
    const rate = rates[t] / rates[f];
    return Math.round(amount * rate * 100) / 100;
  };

  const formatCurrency = (amount: number, currency: string): string => {
    const sym = SYMBOLS[currency.toUpperCase()] || `${currency.toUpperCase()} `;
    const isZeroDecimal = ['JPY', 'KRW', 'IDR'].includes(currency.toUpperCase());
    const formattedNum = amount.toLocaleString(undefined, {
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2,
    });
    return `${sym}${formattedNum}`;
  };

  const formatDual = (amount: number, localCurrency: string) => {
    const local = localCurrency.toUpperCase();
    const home = homeCurrency.toUpperCase();
    const isDifferent = local !== home;

    const localStr = formatCurrency(amount, local);
    const convertedAmount = convert(amount, local, home);
    const homeStr = formatCurrency(convertedAmount, home);

    return { localStr, homeStr, isDifferent };
  };

  return (
    <CurrencyContext.Provider
      value={{
        homeCurrency,
        rates,
        lastUpdated,
        isLoading,
        setHomeCurrency,
        convert,
        formatCurrency,
        formatDual,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
