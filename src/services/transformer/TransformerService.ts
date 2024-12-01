import { LayerInitializer } from './LayerInitializer';
import type { TransformerState, TransformerConfig } from '../../lib/types/transformer';

export class TransformerService {
  private state: TransformerState;

  constructor(config: TransformerConfig) {
    this.state = {
      layers: LayerInitializer.initializeLayers(config),
      config,
    };
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

  setState(state: TransformerState): void {
    this.state = { ...state };
  }
}