import type { ValidationResult } from './ValidationResult';
import { ValidationResultBuilder } from './ValidationResult';

export abstract class BaseValidator {
  protected createResult(): ValidationResultBuilder {
    return new ValidationResultBuilder();
  }

  protected abstract validate(...args: any[]): ValidationResult;
}