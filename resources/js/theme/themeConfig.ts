import { theme } from 'antd';
import { generate } from '@ant-design/colors';

// Fakevest primary brand color as specified in the coding instructions
const primaryColor = '#3b8cb7';

// Generate color palette based on the primary color
const primaryColors = generate(primaryColor);

// Theme configuration optimized for React 19
export const themeConfig = {
  token: {
    colorPrimary: primaryColor,
    colorLink: primaryColor,
    colorInfo: primaryColor,
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorTextBase: '#1f2937', // TailwindCSS gray-800
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },
    Input: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },
    Card: {
      borderRadius: 8,
    },
    Menu: {
      activeBarBorderWidth: 0,
      itemBorderRadius: 6,
    },
    // React 19 specific component optimizations
    Modal: {
      // Improve modal rendering in React 19
      motion: true,
      zIndexPopupBase: 1000,
    },
    Select: {
      // Optimize virtual scrolling for React 19
      virtual: false,
    },
    Table: {
      // Optimize table rendering in React 19
      virtual: false,
    },
  },
  algorithm: theme.defaultAlgorithm,
  // Enable CSS variables for better React 19 compatibility
  cssVar: true,
  // Use a specific hashed class prefix for React 19
  hashed: true,
};

// Export dark theme config for potential dark mode support
export const darkThemeConfig = {
  ...themeConfig,
  algorithm: theme.darkAlgorithm,
};

// Export specific theme colors for reference in components
export const themeColors = {
  primary: primaryColor,
  primaryColors,
  success: themeConfig.token.colorSuccess,
  warning: themeConfig.token.colorWarning,
  error: themeConfig.token.colorError,
  // Create shades of gray that align with Tailwind's palette
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};