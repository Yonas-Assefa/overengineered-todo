import React from 'react';

interface ErrorDisplayProps {
  error: Error | string;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, className = '' }) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] p-8 ${className}`}>
      <div className="text-red-500 text-xl mb-4">⚠️</div>
      <div className="text-red-500 text-lg font-medium text-center">
        {errorMessage}
      </div>
      <div className="text-gray-400 text-sm mt-2">
        Please try again later or contact support if the problem persists.
      </div>
    </div>
  );
}; 