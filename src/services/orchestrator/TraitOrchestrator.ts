import type { AtomSpaceService } from '../atomspace/AtomSpaceService';
import type { TransformerService } from '../transformer/TransformerService';
import type { ValidationService } from '../validation/ValidationService';
import { TraitMapper } from './TraitMapper';
import { TraitValidator } from '../validation/trait/TraitValidator';

export class TraitOrchestrator {
  constructor(
    private atomSpace: AtomSpaceService,
    private transformer: TransformerService,
    private validator: ValidationService
  ) {}

  async applyTraitModification(
    traitName: string,
    value: number
  ): Promise<{ success: boolean; errors: string[] }> {
    // Validate trait before modification
    const validationErrors = await this.validator.validateTraitModification(traitName);
    if (validationErrors.length > 0) {
      return { success: false, errors: validationErrors };
    }

    try {
      // Create or update trait nodes
      const traitNode = this.atomSpace.createAtom('ConceptNode', traitName);
      const valueNode = this.atomSpace.createAtom('PredicateNode', value.toString(), value);
      
      this.atomSpace.createLink('EvaluationLink', [traitNode.id, valueNode.id]);

      // Map trait to transformer weights
      TraitMapper.mapTraitToWeights(traitName, value, this.atomSpace, this.transformer);

      // Validate final state
      const finalValidation = await this.validator.validateStateConsistency();
      return {
        success: finalValidation.length === 0,
        errors: finalValidation
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  validateTraitState(traitName: string): string[] {
    const atoms = this.atomSpace.getState();
    return TraitValidator.validateTraitChanges(atoms, atoms, traitName);
  }

  getTraitInfluence(traitName: string): Record<string, number> {
    const influence: Record<string, number> = {};
    const atoms = this.atomSpace.getState();

    const traitNode = Object.values(atoms).find(
      atom => atom.type === 'ConceptNode' && atom.name === traitName
    );

    if (traitNode) {
      const weightLinks = Object.values(atoms).filter(
        atom => atom.type === 'TransformerWeightLink' && 
        atom.outgoing.some(id => this.isRelatedToTrait(id, traitNode.id, atoms))
      );

      weightLinks.forEach(link => {
        const [layerId, weightId] = link.outgoing;
        const weightNode = atoms[weightId];
        if (weightNode?.value !== undefined) {
          influence[layerId] = weightNode.value;
        }
      });
    }

    return influence;
  }

  private isRelatedToTrait(atomId: string, traitId: string, atoms: Record<string, any>): boolean {
    const atom = atoms[atomId];
    if (!atom) return false;

    if (atom.id === traitId) return true;

    return atom.outgoing?.some((id: string) => 
      this.isRelatedToTrait(id, traitId, atoms)
    ) || false;
  }
}