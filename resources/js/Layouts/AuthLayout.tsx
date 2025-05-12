import React from 'react';

import { Link } from '@inertiajs/react';
import { ConfigProvider, theme } from 'antd';

import useAuthSync from '@/Hooks/useAuthSync';
import { useDarkMode } from '@/Stores/uiStore';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
}) => {
  // Sync auth state with Inertia props
  useAuthSync();

  const darkMode = useDarkMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: '#3b8cb7',
        },
      }}
    >
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div
          className={`w-full max-w-md p-8 space-y-8 rounded-lg shadow-md ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="text-center">
            <Link href="/">
              <h1
                className={`text-2xl font-bold ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}
              >
                FakeVest
              </h1>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold">{title}</h2>
            {description && (
              <p
                className={`mt-2 text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {description}
              </p>
            )}
          </div>

          {children}
        </div>

        <div className="mt-8 text-center">
          <p
            className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            &copy; 2025 FakeVest. All rights reserved.
          </p>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AuthLayout;
