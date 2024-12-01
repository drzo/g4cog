import { BaseValidator } from '../core/BaseValidator';
import type { Atom } from '../../../lib/types/atomspace';
import type { ValidationResult } from '../core/ValidationResult';

export class TypeValidator extends BaseValidator {
  private validTypes = [
    'ConceptNode',
    'PredicateNode',
    'ListLink',
    'EvaluationLink',
    'InheritanceLink',
    'TransformerWeightLink'
  ];

  validate(atoms: Record<string, Atom>): ValidationResult {
    const result = this.createResult();

    Object.values(atoms).forEach(atom => {
      if (!this.validTypes.includes(atom.type)) {
        result.addError(`Invalid atom type: ${atom.type} for atom ${atom.id}`);
      }
    });

    return result.build();
  }
}