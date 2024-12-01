import type { TraitMapping, MappingState } from '../../lib/types/mapping';
import type { Atom } from '../../lib/types/atomspace';
import type { TransformerLayer } from '../../lib/types/transformer';
import { WeightMapper } from './WeightMapper';

export class TraitMapper {
  static createTraitMapping(
    traitName: string,
    atoms: Atom[],
    layers: TransformerLayer[]
  ): TraitMapping {
    const affectedWeights = [];

    for (const atom of atoms) {
      for (const layer of layers) {
        for (const weightKey of Object.keys(layer.weights)) {
          affectedWeights.push(
            WeightMapper.createWeightMapping(atom, layer, weightKey)
          );
        }
      }
    }

    return {
      traitName,
      affectedWeights,
      strength: 0,
      confidence: 0,
    };
  }

  static updateTraitMapping(
    mapping: TraitMapping,
    strength: number,
    confidence: number
  ): TraitMapping {
    return {
      ...mapping,
      strength,
      confidence,
      affectedWeights: mapping.affectedWeights.map(weight =>
        WeightMapper.updateMapping(weight, strength * confidence)
      ),
    };
  }

  static applyTraitMappings(
    mappingState: MappingState,
    atoms: Record<string, Atom>,
    layers: TransformerLayer[]
  ): void {
    Object.values(mappingState.traitMappings).forEach(mapping => {
      mapping.affectedWeights.forEach(weightMapping => {
        const atom = atoms[weightMapping.atomId];
        const layer = layers.find(l => l.id === weightMapping.layerId);
        
        if (atom && layer) {
          const scaleFactor = mapping.strength * mapping.confidence;
          const updatedMapping = WeightMapper.updateMapping(weightMapping, scaleFactor);
          mappingState.weightMappings[weightMapping.atomId] = updatedMapping;
        }
      });
    });

    WeightMapper.applyWeightMappings(mappingState, atoms, layers);
  }
}