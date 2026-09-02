import React from 'react';
import { CURRENCY_SYMBOLS, CURRENCY_LIST } from '../constants/currency';

function Header({
  currency,
  onCurrencyChange,
  isDarkMode,
  onToggleDarkMode,
  onModeSelectChange,
  ratesLoading,
}) {
  return (
    <header className="text-center text-white mb-8 relative">
      <div className="flex justify-center items-center gap-5 relative">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
          💰 Budget Tracker
        </h1>
        <button
          id="darkModeToggle"
          type="button"
          className="absolute top-0 right-0 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-full w-12 h-12 cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-white/30 hover:scale-110 mode-toggle-desktop"
          aria-label="Toggle dark mode"
          onClick={onToggleDarkMode}
        >
          <span className="toggle-icon text-2xl transition-transform duration-300 hover:rotate-12">
            {isDarkMode ? '☀️' : '🌙'}
          </span>
        </button>
      </div>
      <p className="text-lg opacity-90 mb-4">
        Track your income and expenses effortlessly
      </p>
      {ratesLoading && (
        <p className="text-sm opacity-75 mb-2">Loading exchange rates...</p>
      )}
      <div id="headerControls" className="flex flex-col items-center gap-3 mt-5">
        <div className="flex items-center justify-center gap-3">
          <label htmlFor="currencySelect" className="text-base font-medium">
            Currency:
          </label>
          <select
            id="currencySelect"
            className="px-3 py-2 border-2 border-white/30 rounded-lg text-base bg-white/20 backdrop-blur-md text-white cursor-pointer transition-all duration-200 hover:bg-white/30 hover:border-white/40 focus:outline-none focus:border-white/50"
            value={currency}
            onChange={onCurrencyChange}
          >
            {CURRENCY_LIST.map((curr) => (
              <option key={curr} value={curr} className="bg-indigo-500 text-white">
                {curr} ({CURRENCY_SYMBOLS[curr]})
              </option>
            ))}
          </select>
        </div>
        <div id="modeSelectorBox" className="hidden items-center justify-center gap-3">
          <label htmlFor="modeSelect" className="text-base font-medium">
            Mode:
          </label>
          <select
            id="modeSelect"
            className="px-3 py-2 border-2 border-white/30 rounded-lg text-base bg-white/20 backdrop-blur-md text-white cursor-pointer transition-all duration-200 hover:bg-white/30 hover:border-white/40 focus:outline-none focus:border-white/50"
            value={isDarkMode ? 'dark' : 'light'}
            onChange={onModeSelectChange}
          >
            <option value="light" className="bg-indigo-500 text-white">
              Light
            </option>
            <option value="dark" className="bg-indigo-500 text-white">
              Dark
            </option>
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;
