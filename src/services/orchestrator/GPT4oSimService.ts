import { AtomSpaceService } from '../atomspace/AtomSpaceService';
import { TransformerService } from '../transformer/TransformerService';
import { ValidationService } from '../validation/ValidationService';
import { StateManager } from './StateManager';
import { TraitMapper } from './TraitMapper';
import { ConfigValidator } from './ConfigValidator';
import type { TransformerConfig } from '../../lib/types/transformer';
import type { ValidationResult } from '../validation/core/ValidationResult';

export class GPT4oSimService {
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
    
    this.initializeSystem();
  }

  private initializeSystem(): void {
    // Create base transformer representation in atomspace
    const transformerNode = this.atomSpace.createAtom('ConceptNode', 'Transformer');
    
    const state = this.transformer.getState();
    state.layers.forEach((layer, index) => {
      const layerNode = this.atomSpace.createAtom('ConceptNode', `Layer${index}`);
      
      // Map weights to atoms
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

    // Save initial state
    this.stateManager.saveState();
  }

  async modifyCharacterTrait(traitName: string, value: number): Promise<ValidationResult[]> {
    const errors = ConfigValidator.validateTrait(traitName, value);
    if (errors.length > 0) {
      throw new Error(`Invalid trait: ${errors.join(', ')}`);
    }

    // Save current state before modification
    this.stateManager.saveState([traitName]);

    try {
      // Create or update trait in atomspace
      const traitNode = this.atomSpace.createAtom('ConceptNode', traitName);
      const valueNode = this.atomSpace.createAtom('PredicateNode', value.toString(), value);
      
      this.atomSpace.createLink('EvaluationLink', [traitNode.id, valueNode.id]);
      
      // Map trait to transformer weights
      TraitMapper.mapTraitToWeights(traitName, value, this.atomSpace, this.transformer);

      // Validate modifications
      const validationResults = await this.validator.validate();
      const hasErrors = validationResults.some(result => !result.success);

      if (hasErrors) {
        this.stateManager.rollback();
        return validationResults;
      }

      // Save successful state
      this.stateManager.saveState([traitName]);
      return validationResults;
    } catch (error) {
      this.stateManager.rollback();
      throw error;
    }
  }

  getStateSnapshot() {
    return this.stateManager.getSnapshot();
  }

  getStateChanges() {
    return this.stateManager.getStateChanges();
  }

  getValidationMetrics() {
    return this.validator.getMetrics();
  }
}