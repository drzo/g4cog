import {
  validateTransformerConfig,
  validateTraitName,
  validateTraitValue
} from '../../lib/utils/validation';
import type { TransformerConfig } from '../../lib/types/transformer';

export class ConfigValidator {
  static validateConfig(config: TransformerConfig): string[] {
    const errors: string[] = [];

    if (!validateTransformerConfig(config)) {
      errors.push('Invalid transformer configuration');
    }

    if (config.numHeads > config.hiddenSize) {
      errors.push('Number of heads cannot exceed hidden size');
    }

    if (config.intermediateSize < config.hiddenSize) {
      errors.push('Intermediate size must be larger than hidden size');
    }

    return errors;
  }

  static validateTrait(name: string, value: number): string[] {
    const errors: string[] = [];

    if (!validateTraitName(name)) {
      errors.push('Invalid trait name format');
    }

    if (!validateTraitValue(value)) {
      errors.push('Trait value must be between -1 and 1');
    }

    return errors;
  }
}