import { theme } from 'antd';

import { themeColors } from './themeConfig';

// Helper to get computed theme token values
export const useThemeToken = () => {
  const { token } = theme.useToken();
  return token;
};

// Helper to create consistent classNames with tailwind
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Export theme colors for easy access in component styles
export { themeColors };

// Custom hooks for specific theme properties
export const useIsDarkMode = () => {
  // Check if dark mode is enabled either via class or media
  return (
    document.documentElement.classList.contains('dark') ||
    (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
};

// Utility functions for tailwind + antd integration
export const getTailwindColorForAntd = (colorName: string) => {
  switch (colorName) {
    case 'primary':
      return themeColors.primary;
    case 'success':
      return themeColors.success;
    case 'warning':
      return themeColors.warning;
    case 'error':
      return themeColors.error;
    default:
      return themeColors.primary;
  }
};
