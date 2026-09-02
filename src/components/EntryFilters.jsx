import React from 'react';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expenses' },
];

function EntryFilters({ currentFilter, onFilterChange }) {
  return (
    <div className="flex gap-3 mb-5 flex-wrap">
      {FILTERS.map(({ value, label }) => {
        const isActive = currentFilter === value;
        const baseClasses =
          'filter-btn px-4 py-2 border-2 rounded-md cursor-pointer text-sm transition-all duration-200';
        const activeClasses =
          'border-indigo-500 bg-indigo-500 text-white dark:bg-indigo-500 dark:text-white dark:border-indigo-500';
        const inactiveClasses =
          'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400';
        return (
          <button
            key={value}
            type="button"
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            data-filter={value}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default EntryFilters;
