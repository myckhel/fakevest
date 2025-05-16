import React, { ReactNode } from 'react';

import { App, ConfigProvider } from 'antd';

import { useDarkMode } from '../Stores/uiStore';
import { darkThemeConfig, themeConfig } from './themeConfig';

interface GitHubAntDesignProviderProps {
  children: ReactNode;
}

/**
 * GitHubAntDesignProvider wraps the application with Ant Design's ConfigProvider
 * Enhanced with GitHub-like styling and glass design
 */
const GitHubAntDesignProvider: React.FC<GitHubAntDesignProviderProps> = ({
  children,
}) => {
  // Get dark mode directly from global store
  const darkMode = useDarkMode();

  // Use the appropriate theme based on dark mode setting
  const currentTheme = darkMode ? darkThemeConfig : themeConfig;

  // Apply GitHub-like customizations to the theme
  const enhancedTheme = {
    ...currentTheme,
    token: {
      ...currentTheme.token,
      // GitHub-like colors
      colorPrimary: '#0969da',
      colorInfo: '#0969da',
      colorLink: '#0969da',
      colorSuccess: '#2da44e',
      colorWarning: '#bf8700',
      colorError: '#d73a49',
      // Font and typography
      colorTextBase: darkMode ? '#c9d1d9' : '#24292f',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
      // Spacing and shapes
      borderRadius: 6,
      // Background and surfaces for glassy design
      colorBgContainer: darkMode
        ? 'rgba(30, 36, 44, 0.75)'
        : 'rgba(255, 255, 255, 0.75)',
      colorBgElevated: darkMode
        ? 'rgba(22, 27, 34, 0.85)'
        : 'rgba(255, 255, 255, 0.85)',
      // Shadows
      boxShadow: darkMode
        ? '0 1px 3px rgba(0, 0, 0, 0.3)'
        : '0 1px 3px rgba(27, 31, 36, 0.12)',
      boxShadowSecondary: darkMode
        ? '0 1px 0 rgba(0, 0, 0, 0.2)'
        : '0 1px 0 rgba(27, 31, 36, 0.04)',
    },
    components: {
      ...currentTheme.components,
      Button: {
        ...currentTheme.components?.Button,
        borderRadius: 6,
        colorPrimary: '#0969da',
        defaultBg: darkMode ? '#21262d' : '#f6f8fa',
        defaultBorderColor: darkMode
          ? 'rgba(240, 246, 252, 0.1)'
          : 'rgba(27, 31, 36, 0.15)',
        defaultColor: darkMode ? '#c9d1d9' : '#24292f',
        primaryColor: '#ffffff',
        primaryBg: '#0969da',
      },
      Card: {
        ...currentTheme.components?.Card,
        borderRadius: 6,
        colorBorderSecondary: darkMode
          ? 'rgba(240, 246, 252, 0.1)'
          : 'rgba(27, 31, 36, 0.15)',
        boxShadowTertiary: darkMode
          ? '0 1px 0 rgba(0, 0, 0, 0.2)'
          : '0 1px 0 rgba(27, 31, 36, 0.04)',
      },
      Menu: {
        ...currentTheme.components?.Menu,
        itemBorderRadius: 6,
        activeBarBorderWidth: 0,
        itemSelectedBg: darkMode ? '#21262d' : '#f6f8fa',
        itemSelectedColor: darkMode ? '#c9d1d9' : '#24292f',
      },
      Table: {
        ...currentTheme.components?.Table,
        headerBg: darkMode ? '#161b22' : '#f6f8fa',
        borderColor: darkMode ? '#30363d' : '#d0d7de',
      },
      Input: {
        ...currentTheme.components?.Input,
        activeBorderColor: '#0969da',
        activeShadow: '0 0 0 3px rgba(9, 105, 218, 0.15)',
      },
      Modal: {
        ...currentTheme.components?.Modal,
        borderRadiusLG: 6,
        colorBgElevated: darkMode
          ? 'rgba(22, 27, 34, 0.9)'
          : 'rgba(255, 255, 255, 0.9)',
        boxShadow: darkMode
          ? '0 8px 24px rgba(0, 0, 0, 0.2)'
          : '0 8px 24px rgba(140, 149, 159, 0.2)',
      },
    },
  };

  return (
    <ConfigProvider
      theme={enhancedTheme}
      // Enable component token with the new React 19 render engine
      componentSize="middle"
      autoInsertSpaceInButton={true}
      // Virtual list optimizations for React 19
      virtual={false}
      // Add form specific settings optimized for React 19
      form={{
        validateMessages: {},
        requiredMark: true,
        colon: true,
        scrollToFirstError: true,
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
};

export default GitHubAntDesignProvider;
