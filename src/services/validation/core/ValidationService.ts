import { ValidationRegistry } from './ValidationRegistry';
import { ValidationContextBuilder } from './ValidationContext';
import { ValidationMetricsCollector } from './ValidationMetrics';
import type { AtomSpaceService } from '../../atomspace/AtomSpaceService';
import type { TransformerService } from '../../transformer/TransformerService';
import type { ValidationResult } from './ValidationResult';

export class ValidationService {
  private registry: ValidationRegistry;
  private metrics: ValidationMetricsCollector;

  constructor(
    private atomSpace: AtomSpaceService,
    private transformer: TransformerService
  ) {
    this.registry = new ValidationRegistry();
    this.metrics = new ValidationMetricsCollector();
  }

  async validate(): Promise<ValidationResult[]> {
    const startTime = performance.now();
    
    const context = new ValidationContextBuilder()
      .withAtomSpace(this.atomSpace)
      .withTransformer(this.transformer)
      .withTimestamp(Date.now())
      .build();

    try {
      const results = await this.registry.validateAll(context);
      const duration = performance.now() - startTime;
      
      const success = results.every(r => r.success);
      const errors = results.flatMap(r => r.errors);
      
      this.metrics.recordValidation(success, duration, errors);
      
      return results;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.metrics.recordValidation(false, duration, [error.message]);
      throw error;
    }
  }

  registerValidator(name: string, validator: any): void {
    this.registry.register(name, validator);
  }

  getMetrics() {
    return this.metrics.getMetrics();
  }
}