import type { AtomSpaceService } from '../atomspace/AtomSpaceService';
import type { TransformerService } from '../transformer/TransformerService';
import type { StateManager } from '../orchestrator/StateManager';
import { TraitValidator } from './trait/TraitValidator';
import { MappingValidator } from './mapping/MappingValidator';

export class VerificationService {
  private atomSpace: AtomSpaceService;
  private transformer: TransformerService;
  private stateManager: StateManager;

  constructor(
    atomSpace: AtomSpaceService,
    transformer: TransformerService,
    stateManager: StateManager
  ) {
    this.atomSpace = atomSpace;
    this.transformer = transformer;
    this.stateManager = stateManager;
  }

  async verifyTraitModification(
    traitName: string,
    beforeState: any,
    afterState: any
  ): Promise<{ success: boolean; issues: string[] }> {
    const issues: string[] = [];

    // Verify atomspace changes
    issues.push(...TraitValidator.validateTraitChanges(
      beforeState.atomSpace,
      afterState.atomSpace,
      traitName
    ));

    // Verify transformer changes
    issues.push(...this.verifyTransformerChanges(
      beforeState.transformer,
      afterState.transformer
    ));

    // Verify relationships maintained
    issues.push(...TraitValidator.validateTraitRelationships(
      this.atomSpace.getState(),
      traitName
    ));

    return {
      success: issues.length === 0,
      issues
    };
  }

  private verifyTransformerChanges(
    before: Record<string, any>,
    after: Record<string, any>
  ): string[] {
    const issues: string[] = [];

    // Verify layer structure maintained
    if (before.layers.length !== after.layers.length) {
      issues.push('Layer structure modified unexpectedly');
    }

    // Verify weight changes are within bounds
    before.layers.forEach((layer: any, i: number) => {
      const afterLayer = after.layers[i];
      if (!MappingValidator.validateWeightChanges(layer.weights, afterLayer.weights)) {
        issues.push(`Invalid weight changes in layer ${i}`);
      }
    });

    return issues;
  }
}