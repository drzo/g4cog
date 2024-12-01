import { AtomSpaceService } from '../atomspace/AtomSpaceService';
import { TransformerService } from '../transformer/TransformerService';
import { ValidationService } from '../validation/ValidationService';
import { StateManager } from './StateManager';
import { TraitMapper } from './TraitMapper';
import { ConfigValidator } from './ConfigValidator';
import type { TransformerConfig } from '../../lib/types/transformer';

export class GPT4oSimOrchestrator {
  private atomSpace: AtomSpaceService;
  private transformer: TransformerService;
  private validator: ValidationService;
  private stateManager: StateManager;

  constructor(config: TransformerConfig) {
    const errors = ConfigValidator.validateConfig(config);
    if (errors.length > 0) {
      throw new Error(`Invalid configuration: ${errors.join(', ')}`);
    }

    this.atomSpace = new AtomSpaceService();
    this.transformer = new TransformerService(config);
    this.validator = new ValidationService(this.atomSpace, this.transformer);
    this.stateManager = new StateManager(this.atomSpace, this.transformer, this.validator);
    
    this.initializeMapping();
  }

  private initializeMapping(): void {
    const transformerNode = this.atomSpace.createAtom('ConceptNode', 'Transformer');
    
    const state = this.transformer.getState();
    state.layers.forEach((layer, index) => {
      const layerNode = this.atomSpace.createAtom('ConceptNode', `Layer${index}`);
      
      Object.entries(layer.weights).forEach(([key, value]) => {
        const weightNode = this.atomSpace.createAtom('ConceptNode', `Weight_${key}`);
        const weightValue = this.atomSpace.createAtom('PredicateNode', value.toString(), value);
        
        this.atomSpace.createLink('TransformerWeightLink', [
          layerNode.id,
          weightNode.id,
          weightValue.id
        ]);
      });
    });
  }

  updateCharacterTrait(traitName: string, value: number): void {
    const errors = ConfigValidator.validateTrait(traitName, value);
    if (errors.length > 0) {
      throw new Error(`Invalid trait: ${errors.join(', ')}`);
    }

    this.stateManager.saveState([traitName]);

    try {
      const traitNode = this.atomSpace.createAtom('ConceptNode', traitName);
      const valueNode = this.atomSpace.createAtom('PredicateNode', value.toString(), value);
      
      this.atomSpace.createLink('EvaluationLink', [traitNode.id, valueNode.id]);
      
      TraitMapper.mapTraitToWeights(traitName, value, this.atomSpace, this.transformer);

      const validationErrors = this.stateManager.validateCurrentState();
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      this.stateManager.saveState([traitName]);
    } catch (error) {
      this.stateManager.rollback();
      throw error;
    }
  }

  validateModification(traitName: string): boolean {
    if (!validateTraitName(traitName)) {
      return false;
    }
    return TraitMapper.validateTrait(traitName, this.atomSpace);
  }

  rollbackModification(traitName: string): void {
    if (validateTraitName(traitName)) {
      this.stateManager.rollback();
    }
  }

  getStateChanges() {
    return this.stateManager.getStateChanges();
  }

  getSnapshot() {
    return this.stateManager.getSnapshot();
  }
}