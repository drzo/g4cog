import type { TransformerState, TransformerConfig, TransformerLayer } from '../lib/types/transformer';
import { v4 as uuid } from 'uuid';

export class TransformerService {
  private state: TransformerState;

  constructor(config: TransformerConfig) {
    this.state = {
      layers: this.initializeLayers(config),
      config,
    };
  }

  private initializeLayers(config: TransformerConfig): TransformerLayer[] {
    const layers: TransformerLayer[] = [];
    
    for (let i = 0; i < config.numLayers; i++) {
      // Initialize attention layer
      layers.push({
        id: uuid(),
        type: 'attention',
        weights: this.initializeWeights(config.hiddenSize, config.hiddenSize),
        biases: this.initializeBiases(config.hiddenSize),
      });

      // Initialize feedforward layer
      layers.push({
        id: uuid(),
        type: 'feedforward',
        weights: this.initializeWeights(config.hiddenSize, config.intermediateSize),
        biases: this.initializeBiases(config.intermediateSize),
      });
    }

    return layers;
  }

  private initializeWeights(inputSize: number, outputSize: number): Record<string, number> {
    const weights: Record<string, number> = {};
    for (let i = 0; i < inputSize * outputSize; i++) {
      weights[`w${i}`] = Math.random() * 2 - 1; // Initialize between -1 and 1
    }
    return weights;
  }

  private initializeBiases(size: number): Record<string, number> {
    const biases: Record<string, number> = {};
    for (let i = 0; i < size; i++) {
      biases[`b${i}`] = 0; // Initialize to 0
    }
    return biases;
  }

  getLayerWeights(layerId: string): Record<string, number> | undefined {
    const layer = this.state.layers.find(l => l.id === layerId);
    return layer?.weights;
  }

  updateLayerWeights(layerId: string, weights: Record<string, number>): void {
    const layer = this.state.layers.find(l => l.id === layerId);
    if (layer) {
      layer.weights = weights;
    }
  }

  getState(): TransformerState {
    return this.state;
  }
}