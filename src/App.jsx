import React, { useEffect, useMemo, useState } from 'react';

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  SGD: 'S$',
};

const loadFromStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

const loadPrimitive = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  return raw ?? fallback;
};

const savePrimitive = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, value);
};

function App() {
  const [entries, setEntries] = useState(() => loadFromStorage('budgetEntries', []));
  const [editingId, setEditingId] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currency, setCurrency] = useState(() => loadPrimitive('budgetCurrency', 'USD'));
  const [isDarkMode, setIsDarkMode] = useState(() => loadPrimitive('darkMode', 'disabled') === 'enabled');

  const [formValues, setFormValues] = useState({
    type: 'income',
    label: '',
    amount: '',
    category: '',
  });

  // Sync dark mode with document and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    savePrimitive('darkMode', isDarkMode ? 'enabled' : 'disabled');
  }, [isDarkMode]);

  // Persist entries
  useEffect(() => {
    saveToStorage('budgetEntries', entries);
  }, [entries]);

  // Persist currency
  useEffect(() => {
    savePrimitive('budgetCurrency', currency);
  }, [currency]);

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    if (id === 'entryAmount') {
      setFormValues((prev) => ({ ...prev, amount: value }));
    } else if (id === 'entryType') {
      setFormValues((prev) => ({ ...prev, type: value }));
    } else if (id === 'entryLabel') {
      setFormValues((prev) => ({ ...prev, label: value }));
    } else if (id === 'entryCategory') {
      setFormValues((prev) => ({ ...prev, category: value }));
    }
  };

  const resetForm = () => {
    setFormValues({
      type: 'income',
      label: '',
      amount: '',
      category: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNumber = parseFloat(formValues.amount);
    if (Number.isNaN(amountNumber) || amountNumber < 0) return;
    if (!formValues.label.trim() || !formValues.category) return;

    if (editingId !== null) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingId
            ? {
                ...entry,
                type: formValues.type,
                label: formValues.label.trim(),
                amount: amountNumber,
                category: formValues.category,
              }
            : entry,
        ),
      );
      setEditingId(null);
    } else {
      const newEntry = {
        id: Date.now(),
        type: formValues.type,
        label: formValues.label.trim(),
        amount: amountNumber,
        category: formValues.category,
        date: new Date().toISOString(),
      };
      setEntries((prev) => [...prev, newEntry]);
    }

    resetForm();
  };

  const handleEditEntry = (id) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    setFormValues({
      type: entry.type,
      label: entry.label,
      amount: String(entry.amount),
      category: entry.category,
    });
    setEditingId(id);
    // Scroll to top form
    const formEl = document.getElementById('entryForm');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const handleDeleteEntry = (id) => {
    // Optional: you can wire this up to a custom confirm UI if you don't want the native dialog
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  const formatCurrency = (amount) => {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    const decimals = currency === 'JPY' ? 0 : 2;
    return `${symbol}${amount.toFixed(decimals)}`;
  };

  const formatCategory = (category) =>
    category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const filteredEntries = useMemo(() => {
    if (currentFilter === 'all') return entries;
    return entries.filter((entry) => entry.type === currentFilter);
  }, [entries, currentFilter]);

  const sortedEntries = useMemo(
    () =>
      [...filteredEntries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [filteredEntries],
  );

  const summary = useMemo(() => {
    const totalIncome = entries
      .filter((entry) => entry.type === 'income')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalExpenses = entries
      .filter((entry) => entry.type === 'expense')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const balance = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, balance };
  }, [entries]);

  const balanceColor =
    summary.balance < 0
      ? 'text-red-500 dark:text-red-400'
      : summary.balance > 0
      ? 'text-green-500 dark:text-green-400'
      : 'text-blue-500 dark:text-blue-400';

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleModeSelectChange = (e) => {
    setIsDarkMode(e.target.value === 'dark');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 min-h-screen p-5 text-gray-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-200 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
              onClick={toggleDarkMode}
            >
              <span className="toggle-icon text-2xl transition-transform duration-300 hover:rotate-12">
                {isDarkMode ? '☀️' : '🌙'}
              </span>
            </button>
          </div>
          <p className="text-lg opacity-90 mb-4">
            Track your income and expenses effortlessly
          </p>
          <div className="flex flex-col items-center gap-3 mt-5">
            <div className="flex items-center justify-center gap-3">
              <label
                htmlFor="currencySelect"
                className="text-base font-medium"
              >
                Currency:
              </label>
              <select
                id="currencySelect"
                className="px-3 py-2 border-2 border-white/30 rounded-lg text-base bg-white/20 backdrop-blur-md text-white cursor-pointer transition-all duration-200 hover:bg-white/30 hover:border-white/40 focus:outline-none focus:border-white/50"
                value={currency}
                onChange={handleCurrencyChange}
              >
                <option value="USD" className="bg-indigo-500 text-white">
                  USD ($)
                </option>
                <option value="EUR" className="bg-indigo-500 text-white">
                  EUR (€)
                </option>
                <option value="GBP" className="bg-indigo-500 text-white">
                  GBP (£)
                </option>
                <option value="JPY" className="bg-indigo-500 text-white">
                  JPY (¥)
                </option>
                <option value="INR" className="bg-indigo-500 text-white">
                  INR (₹)
                </option>
                <option value="CAD" className="bg-indigo-500 text-white">
                  CAD (C$)
                </option>
                <option value="AUD" className="bg-indigo-500 text-white">
                  AUD (A$)
                </option>
                <option value="CHF" className="bg-indigo-500 text-white">
                  CHF (CHF)
                </option>
                <option value="CNY" className="bg-indigo-500 text-white">
                  CNY (¥)
                </option>
                <option value="SGD" className="bg-indigo-500 text-white">
                  SGD (S$)
                </option>
              </select>
            </div>
            <div
              id="modeSelectorBox"
              className="hidden flex items-center justify-center gap-3"
            >
              <label
                htmlFor="modeSelect"
                className="text-base font-medium"
              >
                Mode:
              </label>
              <select
                id="modeSelect"
                className="px-3 py-2 border-2 border-white/30 rounded-lg text-base bg-white/20 backdrop-blur-md text-white cursor-pointer transition-all duration-200 hover:bg-white/30 hover:border-white/40 focus:outline-none focus:border-white/50"
                value={isDarkMode ? 'dark' : 'light'}
                onChange={handleModeSelectChange}
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

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
            <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Total Income
            </h3>
            <p
              className="text-3xl font-bold text-green-500 dark:text-green-400"
              id="totalIncome"
            >
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
            <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Total Expenses
            </h3>
            <p
              className="text-3xl font-bold text-red-500 dark:text-red-400"
              id="totalExpenses"
            >
              {formatCurrency(summary.totalExpenses)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
            <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Balance
            </h3>
            <p className={`text-3xl font-bold ${balanceColor}`} id="balance">
              {formatCurrency(summary.balance)}
            </p>
          </div>
        </div>

        {/* Add Entry */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-lg">
          <h2 className="mb-5 text-gray-800 dark:text-gray-200 text-2xl font-semibold">
            Add New Entry
          </h2>
          <form id="entryForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end mb-5">
              <div className="flex flex-col">
                <label
                  htmlFor="entryType"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm"
                >
                  Type
                </label>
                <select
                  id="entryType"
                  className="px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                  required
                  value={formValues.type}
                  onChange={handleFormChange}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="entryLabel"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm"
                >
                  Label
                </label>
                <input
                  type="text"
                  id="entryLabel"
                  placeholder="e.g., Salary, Groceries"
                  className="px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                  required
                  value={formValues.label}
                  onChange={handleFormChange}
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="entryAmount"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="entryAmount"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                  required
                  value={formValues.amount}
                  onChange={handleFormChange}
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="entryCategory"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm"
                >
                  Category
                </label>
                <select
                  id="entryCategory"
                  className="px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                  required
                  value={formValues.category}
                  onChange={handleFormChange}
                >
                  <option value="">Select a category</option>
                  <option value="salary">Salary</option>
                  <option value="freelance">Freelance</option>
                  <option value="investment">Investment</option>
                  <option value="other-income">Other Income</option>
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="bills">Bills</option>
                  <option value="shopping">Shopping</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other-expense">Other Expense</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center items-center gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {editingId ? 'Update Entry' : 'Add Entry'}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  id="cancelEdit"
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Entries List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-lg">
          <h2 className="mb-5 text-gray-800 dark:text-gray-200 text-2xl font-semibold">
            All Entries
          </h2>
          <div className="flex gap-3 mb-5 flex-wrap">
            {['all', 'income', 'expense'].map((filter) => {
              const isActive = currentFilter === filter;
              const baseClasses =
                'filter-btn px-4 py-2 border-2 rounded-md cursor-pointer text-sm transition-all duration-200';
              const activeClasses =
                'border-indigo-500 bg-indigo-500 text-white dark:bg-indigo-500 dark:text-white dark:border-indigo-500';
              const inactiveClasses =
                'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400';
              return (
                <button
                  key={filter}
                  type="button"
                  className={`${baseClasses} ${
                    isActive ? activeClasses : inactiveClasses
                  }`}
                  data-filter={filter}
                  onClick={() => setCurrentFilter(filter)}
                >
                  {filter === 'all'
                    ? 'All'
                    : filter === 'income'
                    ? 'Income'
                    : 'Expenses'}
                </button>
              );
            })}
          </div>
          <div id="entriesList" className="flex flex-col gap-4">
            {sortedEntries.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-10 italic">
                No entries found. Add your first entry above!
              </p>
            ) : (
              sortedEntries.map((entry) => {
                const sign = entry.type === 'income' ? '+' : '-';
                const borderColor =
                  entry.type === 'income'
                    ? 'border-l-green-500'
                    : 'border-l-red-500';
                const amountColor =
                  entry.type === 'income'
                    ? 'text-green-500 dark:text-green-400'
                    : 'text-red-500 dark:text-red-400';
                const formattedDate = new Date(entry.date).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  },
                );

                return (
                  <div
                    key={entry.id}
                    className={`bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 ${borderColor} border-l-4 rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-200 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md`}
                  >
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        {entry.label}
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-gray-200 dark:bg-gray-700 px-2.5 py-1 rounded capitalize text-gray-800 dark:text-gray-200">
                          {formatCategory(entry.category)}
                        </span>
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xl font-bold ${amountColor}`}>
                        {sign}
                        {formatCurrency(entry.amount)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer text-sm transition-all duration-200"
                          onClick={() => handleEditEntry(entry.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer text-sm transition-all duration-200"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


