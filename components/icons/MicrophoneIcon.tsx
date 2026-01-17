
import React from 'react';

interface MicrophoneIconProps {
  isListening: boolean;
}

const MicrophoneIcon: React.FC<MicrophoneIconProps> = ({ isListening }) => (
  <div className="relative w-6 h-6">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-6 h-6 transition-colors ${isListening ? 'text-red-500' : 'text-gray-400 group-hover:text-white'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
    {isListening && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
      </div>
    )}
  </div>
);

export default MicrophoneIcon;
