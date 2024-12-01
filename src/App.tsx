import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { MemoryAtomView } from './components/MemoryAtomView';
import { HypergraphView } from './components/HypergraphView';
import hypergraphData from '../hypergraph.json';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Memory Atomization System</h1>
      
      <Tabs.Root defaultValue="dashboard">
        <Tabs.List className="flex border-b border-gray-200 mb-8">
          <Tabs.Trigger
            value="dashboard"
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Tabs.Trigger>
          <Tabs.Trigger
            value="hypergraph"
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Hypergraph
          </Tabs.Trigger>
          <Tabs.Trigger
            value="hyperlang"
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Hyperlang
          </Tabs.Trigger>
          <Tabs.Trigger
            value="hypercode"
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Hypercode
          </Tabs.Trigger>
          <Tabs.Trigger
            value="hypermode"
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Hypermode
          </Tabs.Trigger>
          <Tabs.Trigger
            value="hyperform"
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Hyperform
          </Tabs.Trigger>
          <Tabs.Trigger
            value="hypersona"
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Hypersona
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Memories</h2>
              <div className="space-y-4">
                {Object.values(hypergraphData.nodes).slice(0, 5).map(memory => (
                  <MemoryAtomView key={memory.memory_id} memory={memory} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Memory Network</h2>
              <HypergraphView hypergraph={hypergraphData} />
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="hypergraph">
          <div>
            <h2 className="text-2xl font-bold mb-4">Memory Hypergraph</h2>
            <HypergraphView hypergraph={hypergraphData} />
          </div>
        </Tabs.Content>

        {/* Add content for other tabs */}
      </Tabs.Root>
    </div>
  );
}