import { BaseValidator } from '../core/BaseValidator';
import type { ValidationContext } from '../core/ValidationContext';
import type { ValidationResult } from '../core/ValidationResult';
import type { Atom } from '../../../lib/types/atomspace';

export class TraitRelationshipValidator extends BaseValidator {
  validate(context: ValidationContext): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();

    // Get all trait nodes
    const traitNodes = this.getTraitNodes(atoms);

    // Validate relationships between traits
    traitNodes.forEach(trait => {
      // Check for conflicting traits
      const conflicts = this.findConflictingTraits(trait, traitNodes, atoms);
      conflicts.forEach(conflict => {
        result.addWarning(
          `Potential conflict between traits: ${trait.name} and ${conflict.name}`
        );
      });

      // Validate trait influence network
      const influences = this.validateTraitInfluences(trait, atoms);
      if (influences.length > 0) {
        influences.forEach(issue => result.addError(issue));
      }
    });

    return result.build();
  }

  private getTraitNodes(atoms: Record<string, Atom>): Atom[] {
    return Object.values(atoms).filter(
      atom => atom.type === 'ConceptNode' && /^[A-Z][a-zA-Z]*Trait$/.test(atom.name)
    );
  }

  private findConflictingTraits(
    trait: Atom,
    allTraits: Atom[],
    atoms: Record<string, Atom>
  ): Atom[] {
    return allTraits.filter(other => {
      if (trait.id === other.id) return false;

      // Check for opposing traits through inheritance links
      const hasOpposingLink = Object.values(atoms).some(atom =>
        atom.type === 'InheritanceLink' &&
        atom.outgoing.includes(trait.id) &&
        atom.outgoing.includes(other.id)
      );

      return hasOpposingLink;
    });
  }

  private validateTraitInfluences(trait: Atom, atoms: Record<string, Atom>): string[] {
    const issues: string[] = [];
    const influenceLinks = Object.values(atoms).filter(
      atom => atom.type === 'EvaluationLink' && atom.outgoing.includes(trait.id)
    );

    influenceLinks.forEach(link => {
      const valueNode = atoms[link.outgoing[1]];
      if (!valueNode || valueNode.value === undefined) {
        issues.push(`Invalid influence value for trait ${trait.name}`);
      }
    });

    return issues;
  }
}