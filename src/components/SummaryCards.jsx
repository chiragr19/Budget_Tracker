import React from 'react';
import { formatCurrency } from '../utils/currency';

function SummaryCards({ summary, currency }) {
  const balanceColor =
    summary.balance < 0
      ? 'text-red-500 dark:text-red-400'
      : summary.balance > 0
      ? 'text-green-500 dark:text-green-400'
      : 'text-blue-500 dark:text-blue-400';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
        <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
          Total Income
        </h3>
        <p className="text-3xl font-bold text-green-500 dark:text-green-400" id="totalIncome">
          {formatCurrency(summary.totalIncome, currency)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          (converted to {currency})
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
        <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
          Total Expenses
        </h3>
        <p className="text-3xl font-bold text-red-500 dark:text-red-400" id="totalExpenses">
          {formatCurrency(summary.totalExpenses, currency)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          (converted to {currency})
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
        <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
          Balance
        </h3>
        <p className={`text-3xl font-bold ${balanceColor}`} id="balance">
          {formatCurrency(summary.balance, currency)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">(in {currency})</p>
      </div>
    </div>
  );
}

export default SummaryCards;
