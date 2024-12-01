import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MemoryAtom } from '../types/memory';
import type { Hypergraph } from '../types/hypergraph';

interface MemoryState {
  atoms: Record<string, MemoryAtom>;
  hypergraph: Hypergraph | null;
  isLoading: boolean;
  error: string | null;
  addMemory: (memory: MemoryAtom) => void;
  updateMemory: (id: string, memory: Partial<MemoryAtom>) => void;
  removeMemory: (id: string) => void;
  setHypergraph: (hypergraph: Hypergraph) => void;
  clearError: () => void;
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set, get) => ({
      atoms: {},
      hypergraph: null,
      isLoading: false,
      error: null,

      addMemory: (memory) => {
        set((state) => ({
          atoms: {
            ...state.atoms,
            [memory.memory_id]: memory
          }
        }));
      },

      updateMemory: (id, updates) => {
        set((state) => {
          const memory = state.atoms[id];
          if (!memory) return state;

          return {
            atoms: {
              ...state.atoms,
              [id]: { ...memory, ...updates }
            }
          };
        });
      },

      removeMemory: (id) => {
        set((state) => {
          const { [id]: removed, ...atoms } = state.atoms;
          return { atoms };
        });
      },

      setHypergraph: (hypergraph) => {
        set({ hypergraph });
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'memory-storage',
      partialize: (state) => ({
        atoms: state.atoms,
        hypergraph: state.hypergraph
      })
    }
  )
);