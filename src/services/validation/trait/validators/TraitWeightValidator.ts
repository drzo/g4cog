import { BaseValidator } from '../../core/BaseValidator';
import type { ValidationContext } from '../../core/ValidationContext';
import type { ValidationResult } from '../../core/ValidationResult';

export class TraitWeightValidator extends BaseValidator {
  validate(context: ValidationContext): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();
    const transformerState = context.transformer.getState();

    // Get all weight mappings
    const weightLinks = Object.values(atoms).filter(
      atom => atom.type === 'TransformerWeightLink'
    );

    weightLinks.forEach(link => {
      const [layerId, weightId] = link.outgoing;
      const layer = transformerState.layers.find(l => l.id === layerId);

      if (!layer) {
        result.addError(`Invalid layer reference: ${layerId}`);
        return;
      }

      // Validate weight values
      Object.entries(layer.weights).forEach(([key, value]) => {
        if (Math.abs(value) > 1) {
          result.addError(`Weight value out of bounds: ${value} in layer ${layerId}`);
        }
      });

      // Check weight distribution
      this.validateWeightDistribution(layer.weights, result);
    });

    return result.build();
  }

  private validateWeightDistribution(
    weights: Record<string, number>,
    result: ValidationResultBuilder
  ): void {
    const values = Object.values(weights);
    if (values.length === 0) {
      result.addError('Empty weight distribution');
      return;
    }

    const sum = values.reduce((acc, val) => acc + Math.abs(val), 0);
    const mean = sum / values.length;
    const variance = values.reduce((acc, val) => {
      const diff = Math.abs(val) - mean;
      return acc + diff * diff;
    }, 0) / values.length;

    if (variance > 0.25) {
      result.addWarning('High variance in weight distribution');
    }
  }
}