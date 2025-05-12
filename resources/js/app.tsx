import '../css/app.css';
import './bootstrap';
import '@ant-design/v5-patch-for-react-19';

import React from 'react';

import { StyleProvider } from '@ant-design/cssinjs';
import { createInertiaApp } from '@inertiajs/react';
import { ConfigProvider } from 'antd';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';

import DarkModeManager from './Components/Features/DarkMode/DarkModeManager';
import Toast from './Components/Toast';
import { ThemeProvider } from './theme';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Apply AntD theming
const theme = {
  token: {
    colorPrimary: '#3b8cb7',
    borderRadius: 4,
  },
};

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob('./Pages/**/*.tsx'),
    ),
  setup({ el, App, props }) {
    // Check if user has dark mode enabled
    const darkMode = localStorage.getItem('ui-storage')
      ? JSON.parse(localStorage.getItem('ui-storage') || '{}').state?.darkMode
      : false;

    // Apply dark mode class if needed
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }

    // Wrap with StyleProvider for better styles rendering in React 19
    const AppWithTheme = () => (
      <StyleProvider hashPriority="high">
        <ThemeProvider>
          <ConfigProvider theme={theme}>
            <DarkModeManager />
            <App {...props} />
            <Toast />
          </ConfigProvider>
        </ThemeProvider>
      </StyleProvider>
    );

    if (import.meta.env.SSR) {
      // Use specific SSR-safe rendering for React 19
      hydrateRoot(el, <AppWithTheme />);
      return;
    }

    // Use React 19's improved createRoot API
    createRoot(el).render(<AppWithTheme />);
  },
  progress: {
    color: '#3b8cb7', // Using the primary brand color
  },
});
