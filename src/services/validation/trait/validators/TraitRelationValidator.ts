import { BaseValidator } from '../../core/BaseValidator';
import type { ValidationContext } from '../../core/ValidationContext';
import type { ValidationResult } from '../../core/ValidationResult';

export class TraitRelationValidator extends BaseValidator {
  validate(context: ValidationContext): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();

    // Get all trait nodes
    const traitNodes = Object.values(atoms).filter(
      atom => atom.type === 'ConceptNode' && this.isTraitNode(atom.name)
    );

    traitNodes.forEach(traitNode => {
      // Check for required relationships
      const relationships = Object.values(atoms).filter(
        atom => atom.outgoing.includes(traitNode.id)
      );

      if (relationships.length === 0) {
        result.addError(`Isolated trait node: ${traitNode.name}`);
      }

      // Validate relationship types
      relationships.forEach(rel => {
        if (!this.isValidRelationType(rel.type)) {
          result.addError(
            `Invalid relationship type ${rel.type} for trait ${traitNode.name}`
          );
        }
      });
    });

    return result.build();
  }

  private isTraitNode(name: string): boolean {
    return /^[A-Z][a-zA-Z]*Trait$/.test(name);
  }

  private isValidRelationType(type: string): boolean {
    return [
      'EvaluationLink',
      'InheritanceLink',
      'TransformerWeightLink'
    ].includes(type);
  }
}