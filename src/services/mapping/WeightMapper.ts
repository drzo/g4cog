import type { WeightMapping, MappingState } from '../../lib/types/mapping';
import type { Atom } from '../../lib/types/atomspace';
import type { TransformerLayer } from '../../lib/types/transformer';
import { normalizeWeights, scaleWeights } from '../../lib/utils/weights';

export class WeightMapper {
  static createWeightMapping(
    atom: Atom,
    layer: TransformerLayer,
    weightKey: string
  ): WeightMapping {
    return {
      atomId: atom.id,
      layerId: layer.id,
      weightKey,
      scaleFactor: 1.0,
    };
  }

  static applyWeightMappings(
    mappingState: MappingState,
    atoms: Record<string, Atom>,
    layers: TransformerLayer[]
  ): void {
    Object.values(mappingState.weightMappings).forEach(mapping => {
      const atom = atoms[mapping.atomId];
      const layer = layers.find(l => l.id === mapping.layerId);
      
      if (atom && layer && layer.weights[mapping.weightKey] !== undefined) {
        const scaledWeight = layer.weights[mapping.weightKey] * mapping.scaleFactor;
        layer.weights[mapping.weightKey] = scaledWeight;
      }
    });

    // Normalize weights after applying mappings
    layers.forEach(layer => {
      layer.weights = normalizeWeights(layer.weights);
    });
  }

  static updateMapping(
    mapping: WeightMapping,
    scaleFactor: number
  ): WeightMapping {
    return {
      ...mapping,
      scaleFactor: Math.tanh(scaleFactor), // Ensure bounded scaling
    };
  }
}