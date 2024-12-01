export interface ValidationMetrics {
  totalValidations: number;
  successfulValidations: number;
  failedValidations: number;
  averageValidationTime: number;
  errorsByType: Map<string, number>;
  lastValidationTimestamp?: number;
}

export class ValidationMetricsCollector {
  private metrics: ValidationMetrics = {
    totalValidations: 0,
    successfulValidations: 0,
    failedValidations: 0,
    averageValidationTime: 0,
    errorsByType: new Map(),
  };

  recordValidation(success: boolean, duration: number, errors: string[] = []): void {
    this.metrics.totalValidations++;
    if (success) {
      this.metrics.successfulValidations++;
    } else {
      this.metrics.failedValidations++;
    }

    // Update average validation time
    const totalTime = this.metrics.averageValidationTime * (this.metrics.totalValidations - 1);
    this.metrics.averageValidationTime = (totalTime + duration) / this.metrics.totalValidations;

    // Record error types
    errors.forEach(error => {
      const count = this.metrics.errorsByType.get(error) || 0;
      this.metrics.errorsByType.set(error, count + 1);
    });

    this.metrics.lastValidationTimestamp = Date.now();
  }

  getMetrics(): ValidationMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      totalValidations: 0,
      successfulValidations: 0,
      failedValidations: 0,
      averageValidationTime: 0,
      errorsByType: new Map(),
    };
  }
}