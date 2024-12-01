import type { BaseValidator } from './BaseValidator';
import type { ValidationContext } from './ValidationContext';
import type { ValidationResult } from './ValidationResult';

export class ValidationRegistry {
  private validators: Map<string, BaseValidator> = new Map();

  register(name: string, validator: BaseValidator): void {
    this.validators.set(name, validator);
  }

  unregister(name: string): void {
    this.validators.delete(name);
  }

  async validateAll(context: ValidationContext): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    for (const validator of this.validators.values()) {
      try {
        const result = await validator.validate(context);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          errors: [`Validator error: ${error.message}`],
          warnings: [],
        });
      }
    }

    return results;
  }

  getValidator(name: string): BaseValidator | undefined {
    return this.validators.get(name);
  }

  getValidatorNames(): string[] {
    return Array.from(this.validators.keys());
  }

  async validateSpecific(names: string[], context: ValidationContext): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const name of names) {
      const validator = this.validators.get(name);
      if (validator) {
        try {
          const result = await validator.validate(context);
          results.push(result);
        } catch (error) {
          results.push({
            success: false,
            errors: [`Validator ${name} error: ${error.message}`],
            warnings: [],
          });
        }
      }
    }

    return results;
  }

  clear(): void {
    this.validators.clear();
  }
}