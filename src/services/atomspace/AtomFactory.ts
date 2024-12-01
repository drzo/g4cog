import { v4 as uuid } from 'uuid';
import type { Atom, AtomType } from '../../lib/types/atomspace';

export class AtomFactory {
  static createAtom(type: AtomType, name: string, value?: number): Atom {
    return {
      id: uuid(),
      type,
      name,
      value,
      outgoing: [],
      attention: 0,
    };
  }

  static createLink(type: AtomType, outgoing: string[], name?: string): Atom {
    const atom = this.createAtom(type, name || `${type}-${uuid()}`, undefined);
    atom.outgoing = outgoing;
    return atom;
  }
}