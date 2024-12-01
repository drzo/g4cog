import { BaseValidator } from '../../core/BaseValidator';
import type { ValidationContext } from '../../core/ValidationContext';
import type { ValidationResult } from '../../core/ValidationResult';

export class StructureValidator extends BaseValidator {
  validate(context: ValidationContext): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();

    // Get all trait nodes
    const traitNodes = Object.values(atoms).filter(
      atom => atom.type === 'ConceptNode' && this.isTraitNode(atom.name)
    );

    traitNodes.forEach(traitNode => {
      // Check for required evaluation links
      const evaluationLinks = Object.values(atoms).filter(
        atom => atom.type === 'EvaluationLink' && atom.outgoing.includes(traitNode.id)
      );

      if (evaluationLinks.length === 0) {
        result.addError(`Missing evaluation links for trait: ${traitNode.name}`);
      }

      // Verify link structure
      evaluationLinks.forEach(link => {
        if (link.outgoing.length !== 2) {
          result.addError(`Invalid evaluation link structure for trait: ${traitNode.name}`);
        }
      });
    });

    return result.build();
  }

  private isTraitNode(name: string): boolean {
    return /^[A-Z][a-zA-Z]*Trait$/.test(name);
  }
}