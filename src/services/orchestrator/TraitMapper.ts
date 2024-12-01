import type { AtomSpaceService } from '../atomspace/AtomSpaceService';
import type { TransformerService } from '../transformer/TransformerService';

export class TraitMapper {
  static mapTraitToWeights(
    traitName: string,
    value: number,
    atomSpace: AtomSpaceService,
    transformer: TransformerService
  ): void {
    const state = transformer.getState();
    
    state.layers.forEach(layer => {
      const modifiedWeights = { ...layer.weights };
      
      Object.keys(modifiedWeights).forEach(key => {
        modifiedWeights[key] *= Math.tanh(value);
      });
      
      transformer.updateLayerWeights(layer.id, modifiedWeights);
    });
  }

  static validateTrait(traitName: string, atomSpace: AtomSpaceService): boolean {
    const traitNodes = atomSpace.getAtomsByName(traitName);
    return traitNodes.length > 0;
  }

  static rollbackTrait(traitName: string, atomSpace: AtomSpaceService): void {
    const traitNodes = atomSpace.getAtomsByName(traitName);
    traitNodes.forEach(node => {
      atomSpace.updateAtomAttention(node.id, 0);
    });
  }
}