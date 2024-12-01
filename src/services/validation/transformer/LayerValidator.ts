import { BaseValidator } from '../core/BaseValidator';
import type { TransformerState } from '../../../lib/types/transformer';
import type { ValidationResult } from '../core/ValidationResult';

export class LayerValidator extends BaseValidator {
  validate(state: TransformerState): ValidationResult {
    const result = this.createResult();

    state.layers.forEach((layer, index) => {
      if (!layer.weights || Object.keys(layer.weights).length === 0) {
        result.addError(`Layer ${index} has no weights`);
      }
      if (!layer.biases || Object.keys(layer.biases).length === 0) {
        result.addError(`Layer ${index} has no biases`);
      }

      if (!this.validateLayerDimensions(layer, state.config)) {
        result.addError(`Layer ${index} has invalid dimensions`);
      }
    });

    return result.build();
  }

  private validateLayerDimensions(layer: any, config: any): boolean {
    if (layer.type === 'attention') {
      const expectedSize = config.hiddenSize * config.hiddenSize;
      return Object.keys(layer.weights).length === expectedSize;
    } else if (layer.type === 'feedforward') {
      const expectedSize = config.hiddenSize * config.intermediateSize;
      return Object.keys(layer.weights).length === expectedSize;
    }
    return false;
  }
}