import type { Atom } from '../../lib/types/atomspace';
import type { TransformerState } from '../../lib/types/transformer';

export interface StateSnapshot {
  timestamp: number;
  atomSpace: Record<string, Atom>;
  transformer: TransformerState;
  metadata: {
    modifiedTraits: string[];
    validationErrors: string[];
  };
}

export class SnapshotManager {
  static createSnapshot(
    atomSpace: Record<string, Atom>,
    transformer: TransformerState,
    modifiedTraits: string[] = [],
    validationErrors: string[] = []
  ): StateSnapshot {
    return {
      timestamp: Date.now(),
      atomSpace: { ...atomSpace },
      transformer: { ...transformer },
      metadata: {
        modifiedTraits,
        validationErrors
      }
    };
  }

  static compareSnapshots(before: StateSnapshot, after: StateSnapshot): {
    atomChanges: string[];
    weightChanges: string[];
  } {
    const atomChanges: string[] = [];
    const weightChanges: string[] = [];

    // Check atom changes
    Object.keys({ ...before.atomSpace, ...after.atomSpace }).forEach(id => {
      if (JSON.stringify(before.atomSpace[id]) !== JSON.stringify(after.atomSpace[id])) {
        atomChanges.push(id);
      }
    });

    // Check weight changes
    before.transformer.layers.forEach((layer, i) => {
      const afterLayer = after.transformer.layers[i];
      Object.keys(layer.weights).forEach(key => {
        if (layer.weights[key] !== afterLayer?.weights[key]) {
          weightChanges.push(`${layer.id}:${key}`);
        }
      });
    });

    return { atomChanges, weightChanges };
  }
}