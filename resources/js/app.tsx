import '@ant-design/v5-patch-for-react-19';
import '../css/app.css';
import './bootstrap';

import React from 'react';

import { StyleProvider } from '@ant-design/cssinjs';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';

import DarkModeManager from './Components/Features/DarkMode/DarkModeManager';
import FullScreenLoader from './Components/Shared/FullScreenLoader';
import Toast from './Components/Toast';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

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

    // Import the new GitHub-style theme provider
    const GithubThemeProvider = React.lazy(
      () => import('./theme/GithubThemeProvider'),
    );

    // Wrap with StyleProvider for better styles rendering in React 19
    const AppWithTheme = () => (
      <StyleProvider hashPriority="high">
        <React.Suspense
          fallback={
            <FullScreenLoader
              message="Loading Fakevest"
              subMessage="Setting up your financial environment..."
            />
          }
        >
          <GithubThemeProvider>
            <DarkModeManager />
            <App {...props} />
            <Toast />
          </GithubThemeProvider>
        </React.Suspense>
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
