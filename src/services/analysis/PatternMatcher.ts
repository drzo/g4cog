import { findPatternMatches, comparePatterns } from '../../lib/utils/patterns';
import type { Atom } from '../../lib/types/atomspace';
import type { AtomSpaceService } from '../atomspace/AtomSpaceService';

export class PatternMatcher {
  private atomSpace: AtomSpaceService;

  constructor(atomSpace: AtomSpaceService) {
    this.atomSpace = atomSpace;
  }

  findMatches(pattern: Atom[], threshold: number = 0.8): Atom[][] {
    const allAtoms = Object.values(this.atomSpace.getAtomsByType('ConceptNode'));
    return findPatternMatches(pattern, allAtoms, threshold);
  }

  findTraitPatterns(traitName: string, minLength: number = 3): Atom[][] {
    const traitAtoms = this.atomSpace.getAtomsByName(traitName);
    const patterns: Atom[][] = [];

    for (let len = minLength; len <= traitAtoms.length; len++) {
      for (let i = 0; i <= traitAtoms.length - len; i++) {
        patterns.push(traitAtoms.slice(i, i + len));
      }
    }

    return patterns;
  }

  compareTraitPatterns(trait1: string, trait2: string): number {
    const atoms1 = this.atomSpace.getAtomsByName(trait1);
    const atoms2 = this.atomSpace.getAtomsByName(trait2);
    return comparePatterns(atoms1, atoms2);
  }
}