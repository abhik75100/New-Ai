
import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import MicrophoneIcon from './icons/MicrophoneIcon';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const SendIcon = ({ isLoading }: { isLoading: boolean }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-300 ${isLoading ? 'animate-pulse' : 'group-hover:translate-x-1'}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);


const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading, placeholder }) => {
  const [inputValue, setInputValue] = useState<string>(placeholder ? '' : 'Who individually won the most bronze medals during the Paris Olympics in 2024?');
  const { transcript, isListening, startListening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
        setInputValue(prev => (prev ? prev.trim() + ' ' : '') + transcript);
    }
  }, [transcript]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSubmit(inputValue);
      if (placeholder) { // Clear input only for chat mode
        setInputValue('');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-700/50 rounded-full p-2 border border-gray-600 focus-within:border-blue-400 transition-colors">
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Ask a question..."}
        className="flex-grow bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none resize-none px-4 py-2 text-md w-full max-h-40"
        rows={1}
        disabled={isLoading}
      />
      {browserSupportsSpeechRecognition && (
          <button
              type="button"
              onClick={startListening}
              disabled={isLoading || isListening}
              className="group flex items-center justify-center rounded-full w-12 h-12 flex-shrink-0 hover:bg-gray-600/50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-300"
              aria-label="Use microphone"
          >
              <MicrophoneIcon isListening={isListening} />
          </button>
      )}
      <button
        type="submit"
        disabled={isLoading || !inputValue.trim()}
        className="group flex items-center justify-center bg-blue-600 text-white rounded-full w-12 h-12 flex-shrink-0 hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
            <SendIcon isLoading={isLoading} />
        )}
      </button>
    </form>
  );
};

export default PromptInput;
