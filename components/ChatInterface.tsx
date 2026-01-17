
import React, { useEffect, useRef } from 'react';
import type { ChatHistoryItem } from '../types';

interface ChatInterfaceProps {
  history: ChatHistoryItem[];
  isLoading: boolean;
  error: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ history, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading]);
  
  const formatResponse = (text: string) => {
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    const lines = formattedText.split('\n');
    let inList = false;
    let html = '';
    
    lines.forEach(line => {
      if (line.trim().startsWith('* ')) {
        if (!inList) {
          html += '<ul class="list-disc list-inside space-y-1 my-2">';
          inList = true;
        }
        html += `<li>${line.trim().substring(2)}</li>`;
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        if (line.trim()) {
           html += `<p class="my-2">${line}</p>`;
        }
      }
    });

    if (inList) {
      html += '</ul>';
    }
    
    return html;
  };

  return (
    <div className="flex flex-col h-full space-y-4 pr-2 -mr-2">
      {history.length === 0 && (
        <div className="flex flex-col justify-center items-center h-full text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h2 className="text-2xl font-semibold">Conversation Mode</h2>
          <p>Ask follow-up questions to dig deeper into your topic.</p>
        </div>
      )}
      {history.map((item, index) => (
        <div key={index} className={`flex items-start gap-3 animate-fade-in ${item.role === 'user' ? 'justify-end' : ''}`}>
          {item.role === 'model' && <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex-shrink-0"></div>}
          <div
            className={`max-w-xl p-3 rounded-2xl ${
              item.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : item.isError 
                  ? 'bg-red-900/80 text-red-200 border border-red-500 rounded-bl-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
            }`}
          >
            <div 
                className="prose prose-invert max-w-none text-gray-200 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formatResponse(item.text) }}
            ></div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex-shrink-0"></div>
            <div className="bg-gray-700 p-3 rounded-2xl rounded-bl-none">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatInterface;
