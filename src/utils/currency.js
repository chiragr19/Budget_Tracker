import { CURRENCY_SYMBOLS } from '../constants/currency';

// Convert amount from source currency to target currency.
// Exchange rates are relative to USD (base currency).
export const convertCurrency = (amount, fromCurrency, toCurrency, exchangeRates) => {
  if (fromCurrency === toCurrency) return amount;
  if (Object.keys(exchangeRates).length === 0) return amount;

  // If rates not loaded yet, return original amount
  if (!exchangeRates[fromCurrency] && fromCurrency !== 'USD') return amount;
  if (!exchangeRates[toCurrency] && toCurrency !== 'USD') return amount;

  // Convert from source currency to USD first
  let amountInUSD;
  if (fromCurrency === 'USD') {
    amountInUSD = amount;
  } else {
    // Rate is: 1 USD = X fromCurrency, so amount fromCurrency = amount / X USD
    amountInUSD = amount / exchangeRates[fromCurrency];
  }

  // Convert from USD to target currency
  if (toCurrency === 'USD') {
    return amountInUSD;
  }
  // Rate is: 1 USD = X toCurrency
  return amountInUSD * exchangeRates[toCurrency];
};

export const formatCurrency = (amount, targetCurrency) => {
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || '$';
  const decimals = targetCurrency === 'JPY' ? 0 : 2;
  return `${symbol}${amount.toFixed(decimals)}`;
};
