
import React, { useState, useCallback, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import MicrophoneIcon from './icons/MicrophoneIcon';

interface ImagePromptInputProps {
  onSubmit: (prompt: string, image: { data: string; mimeType: string }) => void;
  isLoading: boolean;
}

const SendIcon = () => (
  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

const ImagePromptInput: React.FC<ImagePromptInputProps> = ({ onSubmit, isLoading }) => {
  const [inputValue, setInputValue] = useState<string>('What is this landmark and where is it located?');
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { transcript, isListening, startListening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
        setInputValue(prev => (prev ? prev.trim() + ' ' : '') + transcript);
    }
  }, [transcript]);


  const handleFileChange = (files: FileList | null) => {
    if (files && files[0] && files[0].type.startsWith('image/')) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      setImage({ file, preview });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = (reader.result as string).split(',')[1];
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (image && !isLoading) {
      const base64Data = await fileToBase64(image.file);
      onSubmit(inputValue, { data: base64Data, mimeType: image.file.type });
    }
  };
  
  const onDragDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileChange(e.dataTransfer.files);
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="space-y-4">
      {!image ? (
        <div 
          onDrop={onDragDrop} 
          onDragOver={onDragOver} 
          onDragLeave={onDragLeave}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-400 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500'}`}
        >
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />
          <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-2 text-sm text-gray-400">
            <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
          </p>
        </div>
      ) : (
         <div className="relative group w-48 mx-auto">
            <img src={image.preview} alt="Preview" className="w-48 h-auto rounded-lg shadow-md"/>
            <button 
                onClick={() => setImage(null)}
                disabled={isLoading}
                className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 disabled:opacity-50"
                aria-label="Remove image"
            >
                ✕
            </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-700/50 rounded-full p-2 border border-gray-600 focus-within:border-blue-400 transition-colors">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question about the image..."
          className="flex-grow bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none resize-none px-4 py-2 text-md w-full max-h-40"
          rows={1}
          disabled={isLoading || !image}
        />
        {browserSupportsSpeechRecognition && (
            <button
                type="button"
                onClick={startListening}
                disabled={isLoading || !image || isListening}
                className="group flex items-center justify-center rounded-full w-12 h-12 flex-shrink-0 hover:bg-gray-600/50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-300"
                aria-label="Use microphone"
            >
                <MicrophoneIcon isListening={isListening} />
            </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !image}
          className="group flex items-center justify-center bg-blue-600 text-white rounded-full w-12 h-12 flex-shrink-0 hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <SendIcon />}
        </button>
      </form>
      <p className="text-center text-xs text-gray-500 px-4">
        Please be responsible. Do not upload sensitive images or photos of individuals without their consent.
      </p>
    </div>
  );
};

export default ImagePromptInput;
