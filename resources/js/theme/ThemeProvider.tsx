import React, { ReactNode, useEffect } from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import AntDesignProvider from './AntDesignProvider';

interface ThemeProviderProps {
  children: ReactNode;
  darkMode?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, darkMode = false }) => {
  // Update theme when darkMode prop changes
  useEffect(() => {
    // Apply dark mode class to HTML for Tailwind dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <StyleProvider hashPriority="high">
      <AntDesignProvider darkMode={darkMode}>
        {children}
      </AntDesignProvider>
    </StyleProvider>
  );
};

export default ThemeProvider;