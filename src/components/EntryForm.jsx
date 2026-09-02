import React from 'react';
import { CURRENCY_LIST, CURRENCY_SYMBOLS } from '../constants/currency';
import { CATEGORY_OPTIONS } from '../constants/categories';

function EntryForm({ formValues, onChange, onSubmit, editingId, onCancel }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-lg">
      <h2 className="mb-5 text-gray-800 dark:text-gray-200 text-2xl font-semibold">
        Add New Entry
      </h2>
      <form id="entryForm" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end mb-5">
          <div className="flex flex-col">
            <label htmlFor="entryType" className="mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">
              Type
            </label>
            <select
              id="entryType"
              className="px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
              required
              value={formValues.type}
              onChange={onChange}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="entryLabel" className="mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">
              Label
            </label>
            <input
              type="text"
              id="entryLabel"
              placeholder="e.g., Salary, Groceries"
              className="px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
              required
              value={formValues.label}
              onChange={onChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="entryAmount" className="mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">
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
              onChange={onChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="entryCategory" className="mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">
              Category
            </label>
            <select
              id="entryCategory"
              className="px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
              required
              value={formValues.category}
              onChange={onChange}
            >
              <option value="">Select a category</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="entryCurrency" className="mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">
              Currency
            </label>
            <select
              id="entryCurrency"
              className="px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
              required
              value={formValues.entryCurrency}
              onChange={onChange}
            >
              {CURRENCY_LIST.map((curr) => (
                <option key={curr} value={curr}>
                  {curr} ({CURRENCY_SYMBOLS[curr]})
                </option>
              ))}
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
              onClick={onCancel}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EntryForm;
