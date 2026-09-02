import { useMemo, useState, useEffect } from 'react';
import { convertCurrency } from '../utils/currency';

export function useEntries(currency, exchangeRates) {
  // Entries are intentionally in-memory only: refreshing the tab clears
  // all income/expense entries and starts with a blank slate.
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [formValues, setFormValues] = useState(() => ({
    type: 'income',
    label: '',
    amount: '',
    category: '',
    entryCurrency: currency,
  }));

  // Keep the form's currency in sync with the display currency,
  // but only while adding a new entry (not while editing an existing one)
  useEffect(() => {
    if (!editingId) {
      setFormValues((prev) => ({ ...prev, entryCurrency: currency }));
    }
  }, [currency, editingId]);

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
    } else if (id === 'entryCurrency') {
      setFormValues((prev) => ({ ...prev, entryCurrency: value }));
    }
  };

  const resetForm = () => {
    setFormValues({
      type: 'income',
      label: '',
      amount: '',
      category: '',
      entryCurrency: currency,
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
                currency: formValues.entryCurrency,
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
        currency: formValues.entryCurrency,
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
      entryCurrency: entry.currency || currency,
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
    // Convert all entries to display currency for calculations
    const totalIncome = entries
      .filter((entry) => entry.type === 'income')
      .reduce((sum, entry) => {
        const entryCurrency = entry.currency || currency;
        const convertedAmount = convertCurrency(entry.amount, entryCurrency, currency, exchangeRates);
        return sum + convertedAmount;
      }, 0);

    const totalExpenses = entries
      .filter((entry) => entry.type === 'expense')
      .reduce((sum, entry) => {
        const entryCurrency = entry.currency || currency;
        const convertedAmount = convertCurrency(entry.amount, entryCurrency, currency, exchangeRates);
        return sum + convertedAmount;
      }, 0);

    const balance = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, balance };
  }, [entries, currency, exchangeRates]);

  return {
    entries,
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
  };
}
