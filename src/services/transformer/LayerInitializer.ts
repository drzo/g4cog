import { v4 as uuid } from 'uuid';
import { normalizeWeights } from '../../lib/utils/weights';
import type { TransformerLayer, TransformerConfig } from '../../lib/types/transformer';

export class LayerInitializer {
  static initializeLayers(config: TransformerConfig): TransformerLayer[] {
    const layers: TransformerLayer[] = [];
    
    for (let i = 0; i < config.numLayers; i++) {
      layers.push(this.createAttentionLayer(config));
      layers.push(this.createFeedforwardLayer(config));
    }

    return layers;
  }

  private static createAttentionLayer(config: TransformerConfig): TransformerLayer {
    return {
      id: uuid(),
      type: 'attention',
      weights: normalizeWeights(this.initializeWeights(config.hiddenSize, config.hiddenSize)),
      biases: this.initializeBiases(config.hiddenSize),
    };
  }

  private static createFeedforwardLayer(config: TransformerConfig): TransformerLayer {
    return {
      id: uuid(),
      type: 'feedforward',
      weights: normalizeWeights(this.initializeWeights(config.hiddenSize, config.intermediateSize)),
      biases: this.initializeBiases(config.intermediateSize),
    };
  }

  private static initializeWeights(inputSize: number, outputSize: number): Record<string, number> {
    const weights: Record<string, number> = {};
    for (let i = 0; i < inputSize * outputSize; i++) {
      weights[`w${i}`] = Math.random() * 2 - 1;
    }
    return weights;
  }

  private static initializeBiases(size: number): Record<string, number> {
    const biases: Record<string, number> = {};
    for (let i = 0; i < size; i++) {
      biases[`b${i}`] = 0;
    }
    return biases;
  }
}