import React, { ReactNode, useEffect } from 'react';

import { StyleProvider } from '@ant-design/cssinjs';

import { useDarkMode } from '../Stores/uiStore';
import GitHubAntDesignProvider from './GitHubAntDesignProvider';

interface GithubThemeProviderProps {
  children: ReactNode;
}

export const GithubThemeProvider: React.FC<GithubThemeProviderProps> = ({
  children,
}) => {
  // Get dark mode from global store
  const darkMode = useDarkMode();

  // Apply special body background for the glassy design effect
  useEffect(() => {
    // Set up background gradient for glassy effect
    document.body.classList.add('bg-gradient-to-br');

    if (darkMode) {
      // Apply GitHub dark theme gradient background
      document.body.classList.add('from-[#010409]', 'to-[#0d1117]');
      document.body.classList.remove('from-gray-50', 'to-[#f6f8fa]');
    } else {
      // Apply GitHub light theme gradient background
      document.body.classList.add('from-gray-50', 'to-[#f6f8fa]');
      document.body.classList.remove('from-[#010409]', 'to-[#0d1117]');
    }

    // Apply global backdrop pattern for a subtle texture
    const patternClass = darkMode ? 'bg-pattern-dark' : 'bg-pattern-light';
    document.body.classList.add(patternClass);

    // Remove legacy classes if they exist
    document.body.classList.remove(
      'from-gray-900',
      'to-gray-800',
      darkMode ? 'bg-pattern-light' : 'bg-pattern-dark',
    );

    return () => {
      // Clean up
      document.body.classList.remove(
        'bg-gradient-to-br',
        'from-gray-50',
        'to-[#f6f8fa]',
        'from-[#010409]',
        'to-[#0d1117]',
        'bg-pattern-light',
        'bg-pattern-dark',
      );
    };
  }, [darkMode]);

  return (
    <StyleProvider hashPriority="high">
      <GitHubAntDesignProvider>{children}</GitHubAntDesignProvider>
    </StyleProvider>
  );
};

export default GithubThemeProvider;
