import { v4 as uuid } from 'uuid';
import type { Atom, AtomSpace, AtomType } from '../lib/types/atomspace';

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
    const atom: Atom = {
      id: uuid(),
      type,
      name,
      value,
      outgoing: [],
      attention: 0,
    };

    this.atomSpace.atoms[atom.id] = atom;
    
    // Update indices
    if (!this.atomSpace.indices.byType[type]) {
      this.atomSpace.indices.byType[type] = [];
    }
    this.atomSpace.indices.byType[type].push(atom.id);

    if (!this.atomSpace.indices.byName[name]) {
      this.atomSpace.indices.byName[name] = [];
    }
    this.atomSpace.indices.byName[name].push(atom.id);

    return atom;
  }

  getAtom(id: string): Atom | undefined {
    return this.atomSpace.atoms[id];
  }

  getAtomsByType(type: AtomType): Atom[] {
    const ids = this.atomSpace.indices.byType[type] || [];
    return ids.map(id => this.atomSpace.atoms[id]);
  }

  getAtomsByName(name: string): Atom[] {
    const ids = this.atomSpace.indices.byName[name] || [];
    return ids.map(id => this.atomSpace.atoms[id]);
  }

  createLink(type: AtomType, outgoing: string[], name?: string): Atom {
    const atom = this.createAtom(type, name || `${type}-${uuid()}`, undefined);
    atom.outgoing = outgoing;
    return atom;
  }

  updateAtomAttention(id: string, attention: number): void {
    const atom = this.atomSpace.atoms[id];
    if (atom) {
      atom.attention = attention;
    }
  }
}