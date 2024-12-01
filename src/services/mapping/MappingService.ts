import type { MappingState } from '../../lib/types/mapping';
import type { Atom } from '../../lib/types/atomspace';
import type { TransformerLayer } from '../../lib/types/transformer';
import { WeightMapper } from './WeightMapper';
import { TraitMapper } from './TraitMapper';

export class MappingService {
  private mappingState: MappingState;

  constructor() {
    this.mappingState = {
      weightMappings: {},
      traitMappings: {},
    };
  }

  createTraitMapping(
    traitName: string,
    atoms: Atom[],
    layers: TransformerLayer[]
  ): void {
    const mapping = TraitMapper.createTraitMapping(traitName, atoms, layers);
    this.mappingState.traitMappings[traitName] = mapping;
  }

  updateTraitMapping(
    traitName: string,
    strength: number,
    confidence: number,
    atoms: Record<string, Atom>,
    layers: TransformerLayer[]
  ): void {
    const mapping = this.mappingState.traitMappings[traitName];
    if (mapping) {
      const updatedMapping = TraitMapper.updateTraitMapping(
        mapping,
        strength,
        confidence
      );
      this.mappingState.traitMappings[traitName] = updatedMapping;
      TraitMapper.applyTraitMappings(this.mappingState, atoms, layers);
    }
  }

  getMappingState(): MappingState {
    return this.mappingState;
  }
}