import { Request, Response } from 'express';
import { fetchLiveExchangeRates, convertCurrency, SUPPORTED_CURRENCIES } from '../services/currencyService';

export async function getCurrencyRatesHandler(req: Request, res: Response) {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const ratesData = await fetchLiveExchangeRates(forceRefresh);

    return res.json({
      success: true,
      base: ratesData.base,
      rates: ratesData.rates,
      lastUpdated: ratesData.lastUpdated,
      supportedCurrencies: SUPPORTED_CURRENCIES,
    });
  } catch (error: any) {
    return res.status(503).json({
      success: false,
      error: error.message || 'Exchange rate service temporarily unavailable.',
    });
  }
}

export async function convertCurrencyHandler(req: Request, res: Response) {
  try {
    const { amount, from, to } = req.body;

    if (amount === undefined || !from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Amount, from currency, and to currency are required.',
      });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a non-negative number.',
      });
    }

    const result = await convertCurrency(numAmount, from, to);
    return res.json({
      success: true,
      conversion: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Currency conversion failed.',
    });
  }
}
