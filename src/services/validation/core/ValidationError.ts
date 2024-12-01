export class ValidationError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  static create(code: string, message: string, context?: Record<string, any>): ValidationError {
    return new ValidationError(message, code, context);
  }

  withContext(context: Record<string, any>): ValidationError {
    return new ValidationError(this.message, this.code, {
      ...this.context,
      ...context,
    });
  }

  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
    };
  }
}