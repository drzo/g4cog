import { BaseValidator } from '../../core/BaseValidator';
import type { ValidationContext } from '../../core/ValidationContext';
import type { ValidationResult } from '../../core/ValidationResult';

export class TraitConstraintValidator extends BaseValidator {
  validate(context: ValidationContext): ValidationResult {
    const result = this.createResult();
    const atoms = context.atomSpace.getState();

    // Get all trait nodes
    const traitNodes = Object.values(atoms).filter(
      atom => atom.type === 'ConceptNode' && this.isTraitNode(atom.name)
    );

    traitNodes.forEach(node => {
      // Check for circular dependencies
      if (this.hasCircularDependency(node, atoms)) {
        result.addError(`Circular dependency detected for trait: ${node.name}`);
      }

      // Validate trait constraints
      const constraints = this.validateTraitConstraints(node, atoms);
      constraints.forEach(error => result.addError(error));
    });

    return result.build();
  }

  private isTraitNode(name: string): boolean {
    return /^[A-Z][a-zA-Z]*Trait$/.test(name);
  }

  private hasCircularDependency(
    node: any,
    atoms: Record<string, any>,
    visited: Set<string> = new Set()
  ): boolean {
    if (visited.has(node.id)) return true;
    visited.add(node.id);

    const dependencies = Object.values(atoms).filter(
      atom => atom.type === 'InheritanceLink' && atom.outgoing.includes(node.id)
    );

    for (const dep of dependencies) {
      const targetId = dep.outgoing.find(id => id !== node.id);
      if (targetId && this.hasCircularDependency(atoms[targetId], atoms, new Set(visited))) {
        return true;
      }
    }

    return false;
  }

  private validateTraitConstraints(node: any, atoms: Record<string, any>): string[] {
    const errors: string[] = [];
    
    // Check for required evaluation links
    const evaluationLinks = Object.values(atoms).filter(
      atom => atom.type === 'EvaluationLink' && atom.outgoing.includes(node.id)
    );

    if (evaluationLinks.length === 0) {
      errors.push(`Missing evaluation link for trait: ${node.name}`);
    }

    // Validate value nodes
    evaluationLinks.forEach(link => {
      const valueNode = atoms[link.outgoing[1]];
      if (!valueNode || valueNode.type !== 'PredicateNode') {
        errors.push(`Invalid value node for trait: ${node.name}`);
      }
    });

    return errors;
  }
}