import { BaseValidator } from '../core/BaseValidator';
import type { ValidationContext } from '../core/ValidationContext';
import type { ValidationResult } from '../core/ValidationResult';

export class TraitConsistencyValidator extends BaseValidator {
  validate(context: ValidationContext): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();

    // Validate trait node structure
    const traitNodes = Object.values(atoms).filter(
      atom => atom.type === 'ConceptNode' && this.isTraitNode(atom.name)
    );

    traitNodes.forEach(traitNode => {
      // Check for required evaluation links
      const evaluationLinks = Object.values(atoms).filter(atom =>
        atom.type === 'EvaluationLink' && atom.outgoing.includes(traitNode.id)
      );

      if (evaluationLinks.length === 0) {
        result.addError(`Trait node ${traitNode.id} has no evaluation links`);
      }

      // Validate trait value bounds
      evaluationLinks.forEach(link => {
        const valueNode = atoms[link.outgoing[1]];
        if (valueNode && valueNode.value !== undefined) {
          if (Math.abs(valueNode.value) > 1) {
            result.addError(`Trait value out of bounds for ${traitNode.name}: ${valueNode.value}`);
          }
        }
      });
    });

    return result.build();
  }

  private isTraitNode(name: string): boolean {
    return /^[A-Z][a-zA-Z]*Trait$/.test(name);
  }
}