import { create } from 'zustand';
import type { GPT4oSimService } from '../../services/orchestrator/GPT4oSimService';
import type { ValidationResult } from '../../services/validation/core/ValidationResult';
import type { StateSnapshot } from '../../services/orchestrator/StateSnapshot';

interface GPT4oSimState {
  service: GPT4oSimService | null;
  validationResults: ValidationResult[];
  isModifying: boolean;
  error: string | null;
  snapshot: StateSnapshot | null;
  setService: (service: GPT4oSimService) => void;
  modifyTrait: (traitName: string, value: number) => Promise<void>;
  clearError: () => void;
}

export const useGPT4oSimStore = create<GPT4oSimState>((set, get) => ({
  service: null,
  validationResults: [],
  isModifying: false,
  error: null,
  snapshot: null,

  setService: (service) => {
    set({ 
      service,
      snapshot: service.getStateSnapshot()
    });
  },

  modifyTrait: async (traitName, value) => {
    const { service } = get();
    if (!service) {
      set({ error: 'Service not initialized' });
      return;
    }

    set({ isModifying: true, error: null });

    try {
      const results = await service.modifyCharacterTrait(traitName, value);
      set({ 
        validationResults: results,
        snapshot: service.getStateSnapshot()
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isModifying: false });
    }
  },

  clearError: () => set({ error: null })
}));