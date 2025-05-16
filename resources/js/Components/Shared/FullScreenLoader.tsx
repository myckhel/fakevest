import { Spin } from 'antd';
import React from 'react';

interface FullScreenLoaderProps {
  message?: string;
  subMessage?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  message = 'Loading Fakevest',
  subMessage = 'Preparing your financial dashboard...',
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="mb-8 animate-float">
        <div className="w-32 h-32 relative">
          {/* Robot body */}
          <div className="w-full h-4/5 bg-primary rounded-xl shadow-lg relative overflow-hidden">
            {/* Screen/Face */}
            <div className="absolute top-2 left-0 right-0 mx-auto w-4/5 h-2/5 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              {/* Eyes */}
              <div className="flex space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-150" />
              </div>
            </div>

            {/* Control Panel */}
            <div className="absolute bottom-2 left-0 right-0 mx-auto w-4/5 h-1/4">
              <div className="grid grid-cols-3 gap-1 h-full">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse" />
                <div className="bg-gray-300 dark:bg-gray-600 rounded-sm animate-pulse delay-100" />
                <div className="bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse delay-200" />
              </div>
            </div>

            {/* Dollar Sign */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl opacity-20">
              $
            </div>
          </div>

          {/* Animated money coins */}
          <div className="absolute -bottom-2 left-0 right-0 mx-auto w-full flex justify-center">
            <div className="w-5 h-5 bg-yellow-400 rounded-full shadow-lg animate-bounce delay-100" />
            <div className="w-5 h-5 bg-yellow-500 rounded-full shadow-lg animate-bounce delay-300 mx-1" />
            <div className="w-5 h-5 bg-yellow-400 rounded-full shadow-lg animate-bounce delay-500" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {message}
        </h2>
        <p className="text-md text-gray-600 dark:text-gray-400 mb-4">
          {subMessage}
        </p>
        <Spin size="large" />
      </div>
    </div>
  );
};

export default FullScreenLoader;
