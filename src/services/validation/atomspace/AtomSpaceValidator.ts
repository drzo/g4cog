import type { Atom } from '../../../lib/types/atomspace';

export class AtomSpaceValidator {
  static validateAtomSpace(atoms: Record<string, Atom>): string[] {
    const errors: string[] = [];
    
    // Check for dangling references
    errors.push(...this.validateReferences(atoms));
    
    // Validate atom types
    errors.push(...this.validateAtomTypes(atoms));
    
    return errors;
  }

  private static validateReferences(atoms: Record<string, Atom>): string[] {
    const errors: string[] = [];
    
    Object.values(atoms).forEach(atom => {
      if (atom.outgoing.length > 0) {
        atom.outgoing.forEach(targetId => {
          if (!atoms[targetId]) {
            errors.push(`Dangling reference in atom ${atom.id} to ${targetId}`);
          }
        });
      }
    });

    return errors;
  }

  private static validateAtomTypes(atoms: Record<string, Atom>): string[] {
    const errors: string[] = [];
    const validTypes = [
      'ConceptNode',
      'PredicateNode',
      'ListLink',
      'EvaluationLink',
      'InheritanceLink',
      'TransformerWeightLink'
    ];

    Object.values(atoms).forEach(atom => {
      if (!validTypes.includes(atom.type)) {
        errors.push(`Invalid atom type: ${atom.type} for atom ${atom.id}`);
      }
    });

    return errors;
  }
}