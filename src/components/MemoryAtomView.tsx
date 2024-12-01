import React from 'react';
import type { MemoryAtom } from '../lib/types/memory';

interface MemoryAtomViewProps {
  memory: MemoryAtom;
}

export function MemoryAtomView({ memory }: MemoryAtomViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{memory.title}</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Summary</h3>
          <p className="text-gray-700">{memory.content.summary}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Details</h3>
          <p className="text-gray-700">{memory.content.details}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Key Terms</h3>
          <div className="flex flex-wrap gap-2">
            {memory.content.keyTerms.map(term => (
              <span key={term} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {term}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {memory.tags.map(tag => (
              <span key={tag} className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Context</h3>
          <p className="text-gray-700">{memory.context}</p>
        </div>
      </div>
    </div>
  );
}