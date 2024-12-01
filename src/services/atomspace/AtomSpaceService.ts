import { AtomFactory } from './AtomFactory';
import { AtomIndexer } from './AtomIndexer';
import type { Atom, AtomSpace, AtomType } from '../../lib/types/atomspace';

export class AtomSpaceService {
  private atomSpace: AtomSpace;

  constructor() {
    this.atomSpace = {
      atoms: {},
      indices: {
        byType: {},
        byName: {},
      },
    };
  }

  createAtom(type: AtomType, name: string, value?: number): Atom {
    const atom = AtomFactory.createAtom(type, name, value);
    this.atomSpace.atoms[atom.id] = atom;
    AtomIndexer.updateIndices(this.atomSpace, atom);
    return atom;
  }

  createLink(type: AtomType, outgoing: string[], name?: string): Atom {
    const atom = AtomFactory.createLink(type, outgoing, name);
    this.atomSpace.atoms[atom.id] = atom;
    AtomIndexer.updateIndices(this.atomSpace, atom);
    return atom;
  }

  getAtom(id: string): Atom | undefined {
    return this.atomSpace.atoms[id];
  }

  getAtomsByType(type: AtomType): Atom[] {
    return AtomIndexer.getAtomsByType(this.atomSpace, type);
  }

  getAtomsByName(name: string): Atom[] {
    return AtomIndexer.getAtomsByName(this.atomSpace, name);
  }

  updateAtomAttention(id: string, attention: number): void {
    const atom = this.atomSpace.atoms[id];
    if (atom) {
      atom.attention = attention;
    }
  }

  getState(): Record<string, Atom> {
    return { ...this.atomSpace.atoms };
  }

  setState(atoms: Record<string, Atom>): void {
    this.atomSpace.atoms = { ...atoms };
    this.atomSpace.indices = {
      byType: {},
      byName: {},
    };
    
    // Rebuild indices
    Object.values(atoms).forEach(atom => {
      AtomIndexer.updateIndices(this.atomSpace, atom);
    });
  }
}