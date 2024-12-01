import { BaseValidator } from '../core/BaseValidator';
import type { Atom } from '../../../lib/types/atomspace';
import type { TransformerState } from '../../../lib/types/transformer';
import type { ValidationResult } from '../core/ValidationResult';

export class WeightMappingValidator extends BaseValidator {
  validate(atoms: Record<string, Atom>, transformerState: TransformerState): ValidationResult {
    const result = this.createResult();

    Object.values(atoms)
      .filter(atom => atom.type === 'TransformerWeightLink')
      .forEach(weightLink => {
        const [layerId, weightId] = weightLink.outgoing;
        const layer = transformerState.layers.find(l => l.id === layerId);
        
        if (!layer) {
          result.addError(`Invalid layer reference in weight mapping: ${layerId}`);
        }
      });

    return result.build();
  }

  validateWeightChanges(before: Record<string, number>, after: Record<string, number>): ValidationResult {
    const result = this.createResult();

    for (const [key, value] of Object.entries(after)) {
      if (Math.abs(value) > 1.0) {
        result.addError(`Weight value out of bounds for ${key}: ${value}`);
      }
      
      const delta = Math.abs(value - (before[key] || 0));
      if (delta > 0.5) {
        result.addError(`Weight change too large for ${key}: ${delta}`);
      }
    }

    return result.build();
  }
}