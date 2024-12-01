import type { Atom } from '../../../lib/types/atomspace';
import type { TransformerState } from '../../../lib/types/transformer';

export class MappingValidator {
  static validateMappings(
    atoms: Record<string, Atom>,
    transformerState: TransformerState
  ): string[] {
    const errors: string[] = [];

    // Check weight mappings
    Object.values(atoms)
      .filter(atom => atom.type === 'TransformerWeightLink')
      .forEach(weightLink => {
        const [layerId, weightId] = weightLink.outgoing;
        const layer = transformerState.layers.find(l => l.id === layerId);
        
        if (!layer) {
          errors.push(`Invalid layer reference in weight mapping: ${layerId}`);
        }
      });

    return errors;
  }

  static validateWeightChanges(
    before: Record<string, number>,
    after: Record<string, number>
  ): boolean {
    for (const [key, value] of Object.entries(after)) {
      if (Math.abs(value) > 1.0) return false;
      const delta = Math.abs(value - (before[key] || 0));
      if (delta > 0.5) return false; // Max 50% change
    }
    return true;
  }
}