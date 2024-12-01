import { BaseValidator } from '../../core/BaseValidator';
import type { ValidationContext } from '../../core/ValidationContext';
import type { ValidationResult } from '../../core/ValidationResult';
import type { Atom } from '../../../../lib/types/atomspace';

export class ConflictValidator extends BaseValidator {
  validate(context: ValidationContext): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();

    const traitNodes = this.getTraitNodes(atoms);
    const conflicts = this.findConflicts(traitNodes, atoms);

    conflicts.forEach(({ trait1, trait2 }) => {
      result.addWarning(
        `Potential trait conflict: ${trait1.name} <-> ${trait2.name}`
      );
    });

    return result.build();
  }

  private getTraitNodes(atoms: Record<string, Atom>): Atom[] {
    return Object.values(atoms).filter(
      atom => atom.type === 'ConceptNode' && /^[A-Z][a-zA-Z]*Trait$/.test(atom.name)
    );
  }

  private findConflicts(traitNodes: Atom[], atoms: Record<string, Atom>): Array<{
    trait1: Atom;
    trait2: Atom;
  }> {
    const conflicts: Array<{ trait1: Atom; trait2: Atom }> = [];

    for (let i = 0; i < traitNodes.length; i++) {
      for (let j = i + 1; j < traitNodes.length; j++) {
        if (this.areTraitsConflicting(traitNodes[i], traitNodes[j], atoms)) {
          conflicts.push({
            trait1: traitNodes[i],
            trait2: traitNodes[j]
          });
        }
      }
    }

    return conflicts;
  }

  private areTraitsConflicting(trait1: Atom, trait2: Atom, atoms: Record<string, Atom>): boolean {
    // Check for opposing inheritance links
    return Object.values(atoms).some(atom =>
      atom.type === 'InheritanceLink' &&
      atom.outgoing.includes(trait1.id) &&
      atom.outgoing.includes(trait2.id)
    );
  }
}