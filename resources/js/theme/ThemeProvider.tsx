import React, { ReactNode } from 'react';

import { StyleProvider } from '@ant-design/cssinjs';

import AntDesignProvider from './AntDesignProvider';
import { useDarkMode } from '../Stores/uiStore';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get dark mode from global store
  const darkMode = useDarkMode();

  return (
    <StyleProvider hashPriority="high">
      <AntDesignProvider darkMode={darkMode}>{children}</AntDesignProvider>
    </StyleProvider>
  );
};

export default ThemeProvider;
