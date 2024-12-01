import type { AtomSpaceService } from '../../atomspace/AtomSpaceService';
import type { TransformerService } from '../../transformer/TransformerService';

export interface ValidationContext {
  atomSpace: AtomSpaceService;
  transformer: TransformerService;
  timestamp: number;
  metadata?: Record<string, any>;
}

export class ValidationContextBuilder {
  private context: Partial<ValidationContext> = {};

  withAtomSpace(atomSpace: AtomSpaceService): this {
    this.context.atomSpace = atomSpace;
    return this;
  }

  withTransformer(transformer: TransformerService): this {
    this.context.transformer = transformer;
    return this;
  }

  withTimestamp(timestamp: number = Date.now()): this {
    this.context.timestamp = timestamp;
    return this;
  }

  withMetadata(metadata: Record<string, any>): this {
    this.context.metadata = { ...this.context.metadata, ...metadata };
    return this;
  }

  build(): ValidationContext {
    if (!this.context.atomSpace || !this.context.transformer || !this.context.timestamp) {
      throw new Error('Incomplete validation context');
    }
    return this.context as ValidationContext;
  }
}