import { DollarCircleFilled } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

interface AppLoaderProps {
  message?: string;
}

const AppLoader: React.FC<AppLoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="animate-bounce mb-4">
        <DollarCircleFilled className="text-6xl text-primary" />
      </div>
      <div className="flex flex-col items-center">
        <Spin size="large" />
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          {message}
        </p>
      </div>
    </div>
  );
};

export default AppLoader;
