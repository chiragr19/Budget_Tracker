import React from 'react';
import EntryFilters from './EntryFilters';
import EntryItem from './EntryItem';

function EntryList({
  entries,
  currentFilter,
  onFilterChange,
  currency,
  exchangeRates,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-lg">
      <h2 className="mb-5 text-gray-800 dark:text-gray-200 text-2xl font-semibold">
        All Entries
      </h2>
      <EntryFilters currentFilter={currentFilter} onFilterChange={onFilterChange} />
      <div id="entriesList" className="flex flex-col gap-4">
        {entries.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10 italic">
            No entries found. Add your first entry above!
          </p>
        ) : (
          entries.map((entry) => (
            <EntryItem
              key={entry.id}
              entry={entry}
              currency={currency}
              exchangeRates={exchangeRates}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default EntryList;
