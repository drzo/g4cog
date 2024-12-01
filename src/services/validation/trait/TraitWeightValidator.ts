import { BaseValidator } from '../core/BaseValidator';
import type { ValidationContext } from '../core/ValidationContext';
import type { ValidationResult } from '../core/ValidationResult';

export class TraitWeightValidator extends BaseValidator {
  validate(context: ValidationContext): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();
    const transformerState = context.transformer.getState();

    // Get all weight links
    const weightLinks = Object.values(atoms).filter(
      atom => atom.type === 'TransformerWeightLink'
    );

    weightLinks.forEach(link => {
      const [layerId, weightId] = link.outgoing;
      const layer = transformerState.layers.find(l => l.id === layerId);

      if (layer) {
        // Validate weight bounds
        Object.entries(layer.weights).forEach(([key, value]) => {
          if (Math.abs(value) > 1) {
            result.addError(`Weight value out of bounds in layer ${layerId}: ${value}`);
          }
        });

        // Check for weight consistency
        if (!this.validateWeightConsistency(layer.weights)) {
          result.addError(`Inconsistent weight distribution in layer ${layerId}`);
        }
      }
    });

    return result.build();
  }

  private validateWeightConsistency(weights: Record<string, number>): boolean {
    const values = Object.values(weights);
    if (values.length === 0) return false;

    // Check if weights are properly normalized
    const sum = values.reduce((acc, val) => acc + Math.abs(val), 0);
    const average = sum / values.length;

    // Ensure no weight dominates the distribution
    return values.every(value => Math.abs(value) <= 3 * average);
  }
}