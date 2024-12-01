import React from 'react';
import { useMemoryStore } from '../lib/store/memoryStore';
import { MemoryAtomView } from './MemoryAtomView';
import { HypergraphView } from './HypergraphView';

export function MemoryManager() {
  const { atoms, hypergraph, isLoading, error } = useMemoryStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading memories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Memory Atoms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(atoms).map((memory) => (
            <MemoryAtomView key={memory.memory_id} memory={memory} />
          ))}
        </div>
      </div>

      {hypergraph && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Memory Network</h2>
          <HypergraphView hypergraph={hypergraph} />
        </div>
      )}
    </div>
  );
}