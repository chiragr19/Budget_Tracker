import { useEffect, useState } from 'react';
import { CURRENCY_LIST } from '../constants/currency';

export function useExchangeRates() {
  const [exchangeRates, setExchangeRates] = useState({});
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setRatesLoading(true);
        // Using exchangerate-api.com free endpoint (no API key required)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        const rates = data.rates || {};
        // Ensure USD is included with rate 1 (base currency)
        rates.USD = 1;
        setExchangeRates(rates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        // Fallback: set USD as base with 1:1 rates
        const fallbackRates = { USD: 1 };
        CURRENCY_LIST.forEach((curr) => {
          if (curr !== 'USD') {
            fallbackRates[curr] = 1;
          }
        });
        setExchangeRates(fallbackRates);
      } finally {
        setRatesLoading(false);
      }
    };

    fetchExchangeRates();
    // Refresh rates every hour
    const interval = setInterval(fetchExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  return { exchangeRates, ratesLoading };
}
