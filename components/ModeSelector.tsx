
import React from 'react';

type Mode = 'text' | 'image' | 'conversation';

interface ModeSelectorProps {
  currentMode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, setMode }) => {
  const modes: { id: Mode; label: string }[] = [
    { id: 'text', label: 'Text Search' },
    { id: 'image', label: 'Image Search' },
    { id: 'conversation', label: 'Conversation' },
  ];

  return (
    <div className="flex items-center justify-center mb-4 space-x-2 bg-gray-700/50 p-1 rounded-full">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => setMode(mode.id)}
          className={`px-4 sm:px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300 w-full ${
            currentMode === mode.id
              ? 'bg-blue-600 text-white shadow'
              : 'text-gray-300 hover:bg-gray-600/50'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
