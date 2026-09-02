import React from 'react';
import { loadPrimitive, savePrimitive } from './utils/storage';
import { useDarkMode } from './hooks/useDarkMode';
import { useExchangeRates } from './hooks/useExchangeRates';
import { useEntries } from './hooks/useEntries';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';

function App() {
  const [currency, setCurrency] = React.useState(() => loadPrimitive('budgetCurrency', 'USD'));
  const { isDarkMode, toggleDarkMode, setIsDarkMode } = useDarkMode();
  const { exchangeRates, ratesLoading } = useExchangeRates();
  const {
    sortedEntries,
    currentFilter,
    setCurrentFilter,
    formValues,
    editingId,
    handleFormChange,
    handleSubmit,
    handleEditEntry,
    handleCancelEdit,
    handleDeleteEntry,
    summary,
  } = useEntries(currency, exchangeRates);

  // Persist currency choice
  React.useEffect(() => {
    savePrimitive('budgetCurrency', currency);
  }, [currency]);

  const handleCurrencyChange = (e) => setCurrency(e.target.value);
  const handleModeSelectChange = (e) => setIsDarkMode(e.target.value === 'dark');

  return (
    <div className="bg-linear-to-br from-indigo-500 via-purple-500 to-purple-600 min-h-screen p-5 text-gray-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-200 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <Header
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onModeSelectChange={handleModeSelectChange}
          ratesLoading={ratesLoading}
        />

        <SummaryCards summary={summary} currency={currency} />

        <EntryForm
          formValues={formValues}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          editingId={editingId}
          onCancel={handleCancelEdit}
        />

        <EntryList
          entries={sortedEntries}
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          currency={currency}
          exchangeRates={exchangeRates}
          onEdit={handleEditEntry}
          onDelete={handleDeleteEntry}
        />
      </div>
    </div>
  );
}

export default App;
