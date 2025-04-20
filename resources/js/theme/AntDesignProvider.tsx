import React, { ReactNode } from 'react';
import { ConfigProvider, App } from 'antd';
import { themeConfig, darkThemeConfig } from './themeConfig';

interface AntDesignProviderProps {
  children: ReactNode;
  darkMode?: boolean;
}

/**
 * AntDesignProvider wraps the application with Ant Design's ConfigProvider
 * Configured specifically for React 19 compatibility
 */
const AntDesignProvider: React.FC<AntDesignProviderProps> = ({ 
  children, 
  darkMode = false 
}) => {
  // Use the appropriate theme based on dark mode setting
  const currentTheme = darkMode ? darkThemeConfig : themeConfig;
  
  return (
    <ConfigProvider
      theme={currentTheme}
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
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
};

export default AntDesignProvider;