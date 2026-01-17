
import React from 'react';
import type { Source } from '../types';

interface SourceListProps {
  sources: Source[];
}

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline-block text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-700">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">Sources</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-gray-800/50 hover:bg-gray-700/70 p-4 rounded-lg transition-all duration-200 border border-gray-700 hover:border-blue-500"
          >
            <p className="text-blue-400 font-medium truncate group-hover:underline">
              <LinkIcon />
              {source.title}
            </p>
            <p className="text-gray-500 text-sm truncate mt-1">{source.uri}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SourceList;
