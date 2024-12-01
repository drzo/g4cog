import { BaseValidator } from '../../core/BaseValidator';
import type { ValidationContext } from '../../core/ValidationContext';
import type { ValidationResult } from '../../core/ValidationResult';

export class TraitModificationValidator extends BaseValidator {
  validate(context: ValidationContext, traitName: string): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();

    // Verify trait exists
    const traitNode = Object.values(atoms).find(
      atom => atom.type === 'ConceptNode' && atom.name === traitName
    );

    if (!traitNode) {
      result.addError(`Trait not found: ${traitName}`);
      return result.build();
    }

    // Check for existing evaluation links
    const evaluationLinks = Object.values(atoms).filter(
      atom => atom.type === 'EvaluationLink' && atom.outgoing.includes(traitNode.id)
    );

    if (evaluationLinks.length > 1) {
      result.addError(`Multiple evaluation links found for trait: ${traitName}`);
    }

    // Validate value nodes
    evaluationLinks.forEach(link => {
      const valueNode = atoms[link.outgoing[1]];
      if (!valueNode || valueNode.type !== 'PredicateNode') {
        result.addError(`Invalid value node for trait: ${traitName}`);
      }
    });

    return result.build();
  }
}