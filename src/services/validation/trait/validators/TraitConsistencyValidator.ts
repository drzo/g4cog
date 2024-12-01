import { BaseValidator } from '../../core/BaseValidator';
import type { ValidationContext } from '../../core/ValidationContext';
import type { ValidationResult } from '../../core/ValidationResult';

export class TraitConsistencyValidator extends BaseValidator {
  validate(context: ValidationContext): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();

    // Get all trait nodes
    const traitNodes = Object.values(atoms).filter(
      atom => atom.type === 'ConceptNode' && this.isTraitNode(atom.name)
    );

    traitNodes.forEach(node => {
      // Check for value consistency
      const evaluationLinks = Object.values(atoms).filter(
        atom => atom.type === 'EvaluationLink' && atom.outgoing.includes(node.id)
      );

      evaluationLinks.forEach(link => {
        const valueNode = atoms[link.outgoing[1]];
        if (valueNode && valueNode.value !== undefined) {
          if (Math.abs(valueNode.value) > 1) {
            result.addError(`Trait value out of bounds for ${node.name}: ${valueNode.value}`);
          }
        }
      });

      // Check for relationship consistency
      const relationships = Object.values(atoms).filter(
        atom => atom.outgoing.includes(node.id)
      );

      if (relationships.length === 0) {
        result.addError(`Isolated trait node: ${node.name}`);
      }
    });

    return result.build();
  }

  private isTraitNode(name: string): boolean {
    return /^[A-Z][a-zA-Z]*Trait$/.test(name);
  }
}