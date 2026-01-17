
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-400">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold">Searching the web...</h2>
        <p>Using Google Search to find the latest information.</p>
    </div>
  );
};

export default LoadingSpinner;
