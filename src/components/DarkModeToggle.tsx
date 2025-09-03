'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // Check if dark mode is enabled on mount
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                     (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDarkMode);
    updateDarkMode(isDarkMode);
  }, []);

  const updateDarkMode = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', enabled.toString());
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateDarkMode(newDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
        ${darkMode 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative">
        {darkMode ? (
          <Sun className="w-5 h-5 transform transition-transform duration-300 rotate-0" />
        ) : (
          <Moon className="w-5 h-5 transform transition-transform duration-300 rotate-0" />
        )}
      </div>
    </button>
  );
}
