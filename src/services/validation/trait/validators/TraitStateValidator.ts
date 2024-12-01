import { BaseValidator } from '../../core/BaseValidator';
import type { ValidationContext } from '../../core/ValidationContext';
import type { ValidationResult } from '../../core/ValidationResult';

export class TraitStateValidator extends BaseValidator {
  validate(context: ValidationContext): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();

    // Get all trait nodes
    const traitNodes = Object.values(atoms).filter(
      atom => atom.type === 'ConceptNode' && this.isTraitNode(atom.name)
    );

    traitNodes.forEach(node => {
      // Validate trait name format
      if (!this.validateTraitName(node.name)) {
        result.addError(`Invalid trait name format: ${node.name}`);
      }

      // Check for required links
      const evaluationLinks = Object.values(atoms).filter(
        atom => atom.type === 'EvaluationLink' && atom.outgoing.includes(node.id)
      );

      if (evaluationLinks.length === 0) {
        result.addError(`Missing evaluation links for trait: ${node.name}`);
      }
    });

    return result.build();
  }

  private isTraitNode(name: string): boolean {
    return /^[A-Z][a-zA-Z]*Trait$/.test(name);
  }

  private validateTraitName(name: string): boolean {
    return /^[A-Z][a-zA-Z]{2,31}Trait$/.test(name);
  }
}