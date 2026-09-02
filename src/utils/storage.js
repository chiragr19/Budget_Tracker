// Helpers for storing/retrieving plain string values (e.g. currency, dark mode flag)
export const loadPrimitive = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  return raw ?? fallback;
};

export const savePrimitive = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, value);
};
