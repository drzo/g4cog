import { BaseValidator } from '../core/BaseValidator';
import type { Atom } from '../../../lib/types/atomspace';
import type { ValidationResult } from '../core/ValidationResult';

export class ReferenceValidator extends BaseValidator {
  validate(atoms: Record<string, Atom>): ValidationResult {
    const result = this.createResult();
    
    Object.values(atoms).forEach(atom => {
      if (atom.outgoing.length > 0) {
        atom.outgoing.forEach(targetId => {
          if (!atoms[targetId]) {
            result.addError(`Dangling reference in atom ${atom.id} to ${targetId}`);
          }
        });
      }
    });

    return result.build();
  }
}