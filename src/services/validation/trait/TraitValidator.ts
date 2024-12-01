import type { Atom } from '../../../lib/types/atomspace';

export class TraitValidator {
  static validateTraitChanges(
    before: Record<string, Atom>,
    after: Record<string, Atom>,
    traitName: string
  ): string[] {
    const issues: string[] = [];

    // Verify trait nodes exist
    const traitNodes = Object.values(after).filter(
      atom => atom.type === 'ConceptNode' && atom.name === traitName
    );
    
    if (traitNodes.length === 0) {
      issues.push(`No trait nodes found for ${traitName}`);
    }

    // Verify no unrelated changes
    const unrelatedChanges = this.findUnrelatedChanges(before, after, traitName);
    if (unrelatedChanges.length > 0) {
      issues.push(...unrelatedChanges);
    }

    return issues;
  }

  static validateTraitRelationships(
    atoms: Record<string, Atom>,
    traitName: string
  ): string[] {
    const issues: string[] = [];

    const traitNodes = Object.values(atoms).filter(
      atom => atom.type === 'ConceptNode' && atom.name === traitName
    );

    traitNodes.forEach(node => {
      const links = Object.values(atoms).filter(
        atom => atom.outgoing.includes(node.id)
      );

      if (links.length === 0) {
        issues.push(`Trait node ${node.id} has no relationships`);
      }
    });

    return issues;
  }

  private static findUnrelatedChanges(
    before: Record<string, Atom>,
    after: Record<string, Atom>,
    traitName: string
  ): string[] {
    const issues: string[] = [];
    const traitRelatedIds = new Set<string>();

    // Find all IDs related to the trait
    Object.values(after).forEach(atom => {
      if (atom.type === 'ConceptNode' && atom.name === traitName) {
        traitRelatedIds.add(atom.id);
        // Add connected nodes
        Object.values(after).forEach(other => {
          if (other.outgoing?.includes(atom.id)) {
            traitRelatedIds.add(other.id);
            other.outgoing.forEach((id: string) => traitRelatedIds.add(id));
          }
        });
      }
    });

    // Check for changes to unrelated nodes
    Object.entries(after).forEach(([id, atom]) => {
      if (!traitRelatedIds.has(id) && JSON.stringify(atom) !== JSON.stringify(before[id])) {
        issues.push(`Unexpected change to unrelated atom: ${id}`);
      }
    });

    return issues;
  }
}