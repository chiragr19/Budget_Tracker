import React from 'react';
import { convertCurrency, formatCurrency } from '../utils/currency';
import { formatCategory } from '../utils/format';

function EntryItem({ entry, currency, exchangeRates, onEdit, onDelete }) {
  const sign = entry.type === 'income' ? '+' : '-';
  const borderColor = entry.type === 'income' ? 'border-l-green-500' : 'border-l-red-500';
  const amountColor =
    entry.type === 'income' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
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
          {entry.currency && (
            <span className="bg-blue-100 dark:bg-blue-900 px-2.5 py-1 rounded text-gray-800 dark:text-gray-200">
              {entry.currency}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className={`text-xl font-bold ${amountColor}`}>
            {sign}
            {formatCurrency(entry.amount, entry.currency || currency)}
          </span>
          {entry.currency && entry.currency !== currency && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ≈ {formatCurrency(
                convertCurrency(entry.amount, entry.currency, currency, exchangeRates),
                currency,
              )}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer text-sm transition-all duration-200"
            onClick={() => onEdit(entry.id)}
          >
            Edit
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer text-sm transition-all duration-200"
            onClick={() => onDelete(entry.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default EntryItem;
