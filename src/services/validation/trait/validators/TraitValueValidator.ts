import { BaseValidator } from '../../core/BaseValidator';
import type { ValidationContext } from '../../core/ValidationContext';
import type { ValidationResult } from '../../core/ValidationResult';

export class TraitValueValidator extends BaseValidator {
  validate(context: ValidationContext): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();

    // Get all trait value nodes
    const valueNodes = Object.values(atoms).filter(
      atom => atom.type === 'PredicateNode' && atom.value !== undefined
    );

    valueNodes.forEach(node => {
      // Validate value bounds
      if (Math.abs(node.value!) > 1) {
        result.addError(`Trait value out of bounds: ${node.value} for node ${node.id}`);
      }

      // Check for value precision
      if (!Number.isFinite(node.value) || node.value !== Math.fround(node.value)) {
        result.addWarning(`Non-standard precision for trait value: ${node.value}`);
      }
    });

    return result.build();
  }
}