import type { TransformerState } from '../../../lib/types/transformer';

export class TransformerValidator {
  static validateTransformer(state: TransformerState): string[] {
    const errors: string[] = [];
    
    // Validate layer structure
    errors.push(...this.validateLayers(state));
    
    // Validate dimensions
    if (!this.validateLayerDimensions(state)) {
      errors.push('Inconsistent layer dimensions');
    }
    
    return errors;
  }

  private static validateLayers(state: TransformerState): string[] {
    const errors: string[] = [];

    state.layers.forEach((layer, index) => {
      if (!layer.weights || Object.keys(layer.weights).length === 0) {
        errors.push(`Layer ${index} has no weights`);
      }
      if (!layer.biases || Object.keys(layer.biases).length === 0) {
        errors.push(`Layer ${index} has no biases`);
      }
    });

    return errors;
  }

  private static validateLayerDimensions(state: TransformerState): boolean {
    const { config, layers } = state;
    
    for (const layer of layers) {
      if (layer.type === 'attention') {
        const expectedSize = config.hiddenSize * config.hiddenSize;
        if (Object.keys(layer.weights).length !== expectedSize) {
          return false;
        }
      } else if (layer.type === 'feedforward') {
        const expectedSize = config.hiddenSize * config.intermediateSize;
        if (Object.keys(layer.weights).length !== expectedSize) {
          return false;
        }
      }
    }
    
    return true;
  }
}