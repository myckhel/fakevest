import { generate } from '@ant-design/colors';
import { theme } from 'antd';

// Github-like primary color
const primaryColor = '#0969da';

// Generate color palette based on the primary color
const primaryColors = generate(primaryColor);

// Theme configuration optimized for React 19 with GitHub-like UI
export const themeConfig = {
  token: {
    colorPrimary: primaryColor,
    colorLink: primaryColor,
    colorInfo: primaryColor,
    colorSuccess: '#2da44e', // GitHub success color
    colorWarning: '#bf8700', // GitHub warning color
    colorError: '#d73a49', // GitHub error color
    colorTextBase: '#24292f', // GitHub text color
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
    borderRadius: 6,
    wireframe: false,
    // Add GitHub-like box shadow
    boxShadowSecondary: '0 1px 0 rgba(27, 31, 36, 0.04)',
    boxShadow: '0 1px 3px rgba(27, 31, 36, 0.12)',
    // Reduce visual weight for glassy design
    colorBgContainer: 'rgba(255, 255, 255, 0.8)',
    colorBgElevated: 'rgba(255, 255, 255, 0.85)',
    // Add backdrop blur effect support via CSS variables
    boxShadowPopoverArrow: 'none',
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      // GitHub-like button styles
      defaultBorderColor: 'rgba(27, 31, 36, 0.15)',
      defaultColor: '#24292f',
      defaultBg: '#f6f8fa',
      primaryShadow: '0 1px 0 rgba(27, 31, 36, 0.1)',
    },
    Input: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      activeBorderColor: primaryColor,
      hoverBorderColor: '#8bbce5',
      activeShadow: '0 0 0 3px rgba(9, 105, 218, 0.15)',
    },
    Card: {
      borderRadius: 6,
      // Add GitHub-like card design
      colorBorderSecondary: 'rgba(27, 31, 36, 0.15)',
      boxShadowTertiary: '0 1px 0 rgba(27, 31, 36, 0.04)',
    },
    Menu: {
      activeBarBorderWidth: 0,
      itemBorderRadius: 6,
      // GitHub-like menu
      itemSelectedBg: '#f6f8fa',
      itemSelectedColor: '#24292f',
    },
    // React 19 specific component optimizations
    Modal: {
      // Improve modal rendering in React 19
      motion: true,
      zIndexPopupBase: 1000,
      // GitHub-like modal
      borderRadiusLG: 6,
      colorBgElevated: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 8px 24px rgba(140, 149, 159, 0.2)',
    },
    Select: {
      // Optimize virtual scrolling for React 19
      virtual: false,
      // GitHub-like dropdown
      optionSelectedBg: '#f6f8fa',
    },
    Table: {
      // Optimize table rendering in React 19
      virtual: false,
      // GitHub-like table
      headerBg: '#f6f8fa',
      borderColor: '#d0d7de',
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
  token: {
    ...themeConfig.token,
    // GitHub dark theme colors
    colorBgContainer: 'rgba(22, 27, 34, 0.8)',
    colorBgElevated: 'rgba(22, 27, 34, 0.85)',
    colorTextBase: '#c9d1d9',
    colorBgBase: '#0d1117',
  },
  components: {
    ...themeConfig.components,
    Button: {
      ...themeConfig.components.Button,
      // GitHub dark theme button
      defaultBg: '#21262d',
      defaultBorderColor: 'rgba(240, 246, 252, 0.1)',
      defaultColor: '#c9d1d9',
    },
    Card: {
      ...themeConfig.components.Card,
      // GitHub dark theme card
      colorBorderSecondary: 'rgba(240, 246, 252, 0.1)',
    },
    Menu: {
      ...themeConfig.components.Menu,
      // GitHub dark theme menu
      itemSelectedBg: '#21262d',
      itemSelectedColor: '#c9d1d9',
    },
    Table: {
      ...themeConfig.components.Table,
      // GitHub dark theme table
      headerBg: '#161b22',
      borderColor: '#30363d',
    },
  },
};

// Export specific theme colors for reference in components
export const themeColors = {
  primary: primaryColor,
  primaryColors,
  success: themeConfig.token.colorSuccess,
  warning: themeConfig.token.colorWarning,
  error: themeConfig.token.colorError,
  // Create shades of gray that align with GitHub's palette
  gray: {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
  },
};
