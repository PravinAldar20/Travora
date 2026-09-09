import axios from 'axios';

interface ExchangeRateCache {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
  timestamp: number;
}

let ratesCache: ExchangeRateCache | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function fetchLiveExchangeRates(forceRefresh = false): Promise<ExchangeRateCache> {
  const now = Date.now();
  if (!forceRefresh && ratesCache && now - ratesCache.timestamp < CACHE_TTL_MS) {
    return ratesCache;
  }

  try {
    // open.er-api.com provides real-time financial market exchange rates from central banks
    const response = await axios.get('https://open.er-api.com/v6/latest/USD', { timeout: 8000 });
    if (response.data && response.data.result === 'success' && response.data.rates) {
      ratesCache = {
        base: 'USD',
        rates: response.data.rates,
        lastUpdated: response.data.time_last_update_utc || new Date().toUTCString(),
        timestamp: now,
      };
      return ratesCache;
    }
    throw new Error('Invalid response structure from exchange rate service');
  } catch (error: any) {
    console.error('Exchange rate fetch error:', error.message);
    if (ratesCache) {
      // Use existing cache if available
      return ratesCache;
    }
    // Fallback standard central rates if network is offline
    throw new Error(`Real exchange rate service unavailable: ${error.message}`);
  }
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<{
  originalAmount: number;
  fromCurrency: string;
  convertedAmount: number;
  toCurrency: string;
  exchangeRate: number;
  lastUpdated: string;
}> {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  if (from === to) {
    return {
      originalAmount: amount,
      fromCurrency: from,
      convertedAmount: amount,
      toCurrency: to,
      exchangeRate: 1.0,
      lastUpdated: new Date().toUTCString(),
    };
  }

  const ratesData = await fetchLiveExchangeRates();
  const rates = ratesData.rates;

  const rateFrom = rates[from];
  const rateTo = rates[to];

  if (!rateFrom) {
    throw new Error(`Unsupported source currency: ${from}`);
  }
  if (!rateTo) {
    throw new Error(`Unsupported target currency: ${to}`);
  }

  // Calculate conversion via USD base
  // USD -> from: rateFrom
  // USD -> to: rateTo
  // from -> to: rateTo / rateFrom
  const exchangeRate = rateTo / rateFrom;
  const convertedAmount = Math.round((amount * exchangeRate) * 100) / 100;

  return {
    originalAmount: amount,
    fromCurrency: from,
    convertedAmount,
    toCurrency: to,
    exchangeRate: Math.round(exchangeRate * 10000) / 10000,
    lastUpdated: ratesData.lastUpdated,
  };
}

export const SUPPORTED_CURRENCIES = [
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
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
];
