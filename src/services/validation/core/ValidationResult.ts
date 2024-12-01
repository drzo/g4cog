export interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  metadata?: Record<string, any>;
}

export class ValidationResultBuilder {
  private result: ValidationResult = {
    success: true,
    errors: [],
    warnings: [],
    metadata: {}
  };

  addError(error: string): this {
    this.result.errors.push(error);
    this.result.success = false;
    return this;
  }

  addWarning(warning: string): this {
    this.result.warnings.push(warning);
    return this;
  }

  addMetadata(key: string, value: any): this {
    if (!this.result.metadata) {
      this.result.metadata = {};
    }
    this.result.metadata[key] = value;
    return this;
  }

  build(): ValidationResult {
    return { ...this.result };
  }
}