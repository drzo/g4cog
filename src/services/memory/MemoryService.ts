import { v4 as uuid } from 'uuid';
import type { MemoryAtom } from '../../lib/types/memory';
import type { Hypergraph } from '../../lib/types/hypergraph';
import { useMemoryStore } from '../../lib/store/memoryStore';

export class MemoryService {
  private store = useMemoryStore.getState();

  async createMemory(data: Omit<MemoryAtom, 'memory_id' | 'timestamp'>): Promise<MemoryAtom> {
    const memory: MemoryAtom = {
      memory_id: uuid(),
      timestamp: new Date().toISOString(),
      ...data
    };

    this.store.addMemory(memory);
    return memory;
  }

  async updateMemory(id: string, updates: Partial<MemoryAtom>): Promise<void> {
    this.store.updateMemory(id, updates);
  }

  async deleteMemory(id: string): Promise<void> {
    this.store.removeMemory(id);
  }

  async updateHypergraph(hypergraph: Hypergraph): Promise<void> {
    this.store.setHypergraph(hypergraph);
  }

  getMemories(): Record<string, MemoryAtom> {
    return this.store.atoms;
  }

  getHypergraph(): Hypergraph | null {
    return this.store.hypergraph;
  }
}