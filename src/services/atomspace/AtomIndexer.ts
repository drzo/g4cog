import type { AtomSpace, Atom, AtomType } from '../../lib/types/atomspace';

export class AtomIndexer {
  static updateIndices(atomSpace: AtomSpace, atom: Atom): void {
    this.updateTypeIndex(atomSpace, atom);
    this.updateNameIndex(atomSpace, atom);
  }

  private static updateTypeIndex(atomSpace: AtomSpace, atom: Atom): void {
    if (!atomSpace.indices.byType[atom.type]) {
      atomSpace.indices.byType[atom.type] = [];
    }
    atomSpace.indices.byType[atom.type].push(atom.id);
  }

  private static updateNameIndex(atomSpace: AtomSpace, atom: Atom): void {
    if (!atomSpace.indices.byName[atom.name]) {
      atomSpace.indices.byName[atom.name] = [];
    }
    atomSpace.indices.byName[atom.name].push(atom.id);
  }

  static getAtomsByType(atomSpace: AtomSpace, type: AtomType): Atom[] {
    const ids = atomSpace.indices.byType[type] || [];
    return ids.map(id => atomSpace.atoms[id]);
  }

  static getAtomsByName(atomSpace: AtomSpace, name: string): Atom[] {
    const ids = atomSpace.indices.byName[name] || [];
    return ids.map(id => atomSpace.atoms[id]);
  }
}