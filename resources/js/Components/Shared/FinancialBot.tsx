import React, { useEffect, useState } from 'react';

interface FinancialBotProps {
  size?: 'small' | 'medium' | 'large';
}

const FinancialBot: React.FC<FinancialBotProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const [blinkingEyes, setBlinkingEyes] = useState(false);
  const [processingData, setProcessingData] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkingEyes(true);
      setTimeout(() => setBlinkingEyes(false), 200);
    }, 3000);

    const processInterval = setInterval(() => {
      setProcessingData(true);
      setTimeout(() => setProcessingData(false), 1200);
    }, 2000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(processInterval);
    };
  }, []);

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="absolute inset-0 flex items-center justify-center animate-float">
        <div className="w-full h-4/5 bg-primary rounded-xl shadow-lg relative overflow-hidden transition-all duration-300">
          <div className="absolute top-2 left-0 right-0 mx-auto w-4/5 h-2/5 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
            {processingData && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-slide-right" />
            )}
            <div className="flex space-x-3 z-10">
              <div
                className={`w-3 h-${blinkingEyes ? '0.5' : '3'} bg-primary rounded-full transition-all duration-100`}
              />
              <div
                className={`w-3 h-${blinkingEyes ? '0.5' : '3'} bg-primary rounded-full transition-all duration-100`}
              />
            </div>
          </div>

          <div className="absolute bottom-2 left-0 right-0 mx-auto w-4/5 h-1/4">
            <div className="grid grid-cols-3 gap-1 h-full">
              <div
                className={`bg-gray-200 dark:bg-gray-700 rounded-sm ${processingData ? 'animate-pulse' : ''}`}
              />
              <div
                className={`bg-gray-300 dark:bg-gray-600 rounded-sm ${processingData ? 'animate-pulse delay-100' : ''}`}
              />
              <div
                className={`bg-gray-200 dark:bg-gray-700 rounded-sm ${processingData ? 'animate-pulse delay-200' : ''}`}
              />
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl opacity-20 animate-pulse">
            $
          </div>
        </div>
      </div>

      <div className="absolute -bottom-2 left-0 right-0 mx-auto w-full flex justify-center">
        <div className="w-5 h-5 bg-yellow-400 rounded-full shadow-lg animate-bounce delay-100" />
        <div className="w-5 h-5 bg-yellow-500 rounded-full shadow-lg animate-bounce delay-300 mx-1" />
        <div className="w-5 h-5 bg-yellow-400 rounded-full shadow-lg animate-bounce delay-500" />
      </div>
    </div>
  );
};

export default FinancialBot;
