import { useEffect, useState } from 'react';
import { loadPrimitive, savePrimitive } from '../utils/storage';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => loadPrimitive('darkMode', 'disabled') === 'enabled',
  );

  // Sync dark mode with document and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    savePrimitive('darkMode', isDarkMode ? 'enabled' : 'disabled');
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return { isDarkMode, setIsDarkMode, toggleDarkMode };
}
