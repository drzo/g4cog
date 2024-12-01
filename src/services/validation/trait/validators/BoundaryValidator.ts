import { BaseValidator } from '../../core/BaseValidator';
import type { ValidationContext } from '../../core/ValidationContext';
import type { ValidationResult } from '../../core/ValidationResult';

export class BoundaryValidator extends BaseValidator {
  validate(context: ValidationContext): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();

    // Validate trait value boundaries
    Object.values(atoms)
      .filter(atom => atom.type === 'PredicateNode' && atom.value !== undefined)
      .forEach(atom => {
        if (Math.abs(atom.value!) > 1) {
          result.addError(`Trait value out of bounds: ${atom.value}`);
        }
      });

    return result.build();
  }
}