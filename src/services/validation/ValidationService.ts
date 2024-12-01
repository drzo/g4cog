import type { AtomSpaceService } from '../atomspace/AtomSpaceService';
import type { TransformerService } from '../transformer/TransformerService';
import { ValidationRegistry } from './core/ValidationRegistry';
import { ValidationContextBuilder } from './core/ValidationContext';
import { ValidationMetricsCollector } from './core/ValidationMetrics';
import { TraitModificationValidator } from './trait/validators/TraitModificationValidator';
import { TraitStateValidator } from './trait/validators/TraitStateValidator';
import { TraitConsistencyValidator } from './trait/validators/TraitConsistencyValidator';
import { TraitConstraintValidator } from './trait/validators/TraitConstraintValidator';
import { TraitValueValidator } from './trait/validators/TraitValueValidator';
import { TraitRelationValidator } from './trait/validators/TraitRelationValidator';
import { TraitWeightValidator } from './trait/validators/TraitWeightValidator';

export class ValidationService {
  private registry: ValidationRegistry;
  private metrics: ValidationMetricsCollector;

  constructor(
    private atomSpace: AtomSpaceService,
    private transformer: TransformerService
  ) {
    this.registry = new ValidationRegistry();
    this.metrics = new ValidationMetricsCollector();

    // Register all validators
    this.registerValidators();
  }

  private registerValidators(): void {
    this.registry.register('traitModification', new TraitModificationValidator());
    this.registry.register('traitState', new TraitStateValidator());
    this.registry.register('traitConsistency', new TraitConsistencyValidator());
    this.registry.register('traitConstraint', new TraitConstraintValidator());
    this.registry.register('traitValue', new TraitValueValidator());
    this.registry.register('traitRelation', new TraitRelationValidator());
    this.registry.register('traitWeight', new TraitWeightValidator());
  }

  async validateStateConsistency(): Promise<string[]> {
    const startTime = performance.now();
    
    const context = new ValidationContextBuilder()
      .withAtomSpace(this.atomSpace)
      .withTransformer(this.transformer)
      .withTimestamp(Date.now())
      .build();

    try {
      const results = await this.registry.validateAll(context);
      const duration = performance.now() - startTime;
      
      const errors = results.flatMap(r => r.errors);
      const success = errors.length === 0;
      
      this.metrics.recordValidation(success, duration, errors);
      
      return errors;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.metrics.recordValidation(false, duration, [error.message]);
      return [error.message];
    }
  }

  async validateTraitModification(traitName: string): Promise<string[]> {
    const context = new ValidationContextBuilder()
      .withAtomSpace(this.atomSpace)
      .withTransformer(this.transformer)
      .withTimestamp(Date.now())
      .build();

    const modificationValidator = this.registry.getValidator('traitModification');
    const result = await modificationValidator.validate(context, traitName);

    return result.errors;
  }

  getMetrics() {
    return this.metrics.getMetrics();
  }

  getRegistry() {
    return this.registry;
  }
}