import { BoundaryValidator } from './validators/BoundaryValidator';
import { StructureValidator } from './validators/StructureValidator';
import { ConflictValidator } from './validators/ConflictValidator';
import type { ValidationContext } from '../core/ValidationContext';
import type { ValidationResult } from '../core/ValidationResult';

export class TraitValidationService {
  private validators = {
    boundary: new BoundaryValidator(),
    structure: new StructureValidator(),
    conflict: new ConflictValidator()
  };

  async validateTrait(context: ValidationContext): Promise<ValidationResult[]> {
    const results = await Promise.all([
      this.validators.boundary.validate(context),
      this.validators.structure.validate(context),
      this.validators.conflict.validate(context)
    ]);

    return results;
  }

  async validateTraitModification(
    context: ValidationContext,
    traitName: string
  ): Promise<ValidationResult[]> {
    const results = await this.validateTrait(context);
    
    // Additional validation specific to modifications
    const modificationResult = this.validateModificationConstraints(context, traitName);
    results.push(modificationResult);

    return results;
  }

  private validateModificationConstraints(
    context: ValidationContext,
    traitName: string
  ): ValidationResult {
    const result = this.validators.structure.createResult();
    const atoms = context.atomSpace.getState();

    // Verify trait exists
    const traitNode = Object.values(atoms).find(
      atom => atom.type === 'ConceptNode' && atom.name === traitName
    );

    if (!traitNode) {
      result.addError(`Trait not found: ${traitName}`);
      return result.build();
    }

    // Verify modification constraints
    const evaluationLinks = Object.values(atoms).filter(
      atom => atom.type === 'EvaluationLink' && atom.outgoing.includes(traitNode.id)
    );

    if (evaluationLinks.length > 1) {
      result.addError(`Multiple evaluation links found for trait: ${traitName}`);
    }

    return result.build();
  }
}