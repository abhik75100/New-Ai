
import React from 'react';
import type { Source } from '../types';
import SourceList from './SourceList';

interface ResultDisplayProps {
  responseText: string;
  sources: Source[];
  queriedImage?: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ responseText, sources, queriedImage }) => {
  // Simple markdown-like to HTML conversion for bold and lists
  const formatResponse = (text: string) => {
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italics

    const lines = formattedText.split('\n');
    let inList = false;
    let html = '';
    
    lines.forEach(line => {
      if (line.trim().startsWith('* ')) {
        if (!inList) {
          html += '<ul class="list-disc list-inside space-y-2 my-4">';
          inList = true;
        }
        html += `<li>${line.trim().substring(2)}</li>`;
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        // Avoid creating empty <p> tags for empty lines
        if (line.trim()) {
           html += `<p class="my-4">${line}</p>`;
        }
      }
    });

    if (inList) {
      html += '</ul>';
    }
    
    return html;
  };

  return (
    <div className="animate-fade-in space-y-6">
      {queriedImage && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2 font-semibold">Your Query Image:</p>
          <img src={queriedImage} alt="User query" className="rounded-lg max-w-xs max-h-48 border border-gray-600" />
        </div>
      )}
      <div 
        className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: formatResponse(responseText) }}
      >
      </div>
      {sources.length > 0 && <SourceList sources={sources} />}
    </div>
  );
};

export default ResultDisplay;
