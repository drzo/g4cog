import { analyzeTraitStrength } from '../../lib/utils/traits';
import type { AtomSpaceService } from '../atomspace/AtomSpaceService';
import type { TraitAnalysis } from '../../lib/utils/traits';

export class TraitAnalyzer {
  private atomSpace: AtomSpaceService;

  constructor(atomSpace: AtomSpaceService) {
    this.atomSpace = atomSpace;
  }

  analyzeTrait(traitName: string): TraitAnalysis {
    const traitAtoms = this.atomSpace.getAtomsByName(traitName);
    return analyzeTraitStrength(traitAtoms);
  }

  findStrongTraits(threshold: number = 0.7): string[] {
    const conceptNodes = this.atomSpace.getAtomsByType('ConceptNode');
    const traitStrengths = new Map<string, number>();

    conceptNodes.forEach(node => {
      const analysis = this.analyzeTrait(node.name);
      if (analysis.strength >= threshold) {
        traitStrengths.set(node.name, analysis.strength);
      }
    });

    return Array.from(traitStrengths.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([name]) => name);
  }

  findTraitCorrelations(traitName: string, threshold: number = 0.5): Map<string, number> {
    const correlations = new Map<string, number>();
    const targetAnalysis = this.analyzeTrait(traitName);

    const conceptNodes = this.atomSpace.getAtomsByType('ConceptNode');
    conceptNodes.forEach(node => {
      if (node.name !== traitName) {
        const analysis = this.analyzeTrait(node.name);
        const correlation = this.calculateCorrelation(targetAnalysis, analysis);
        if (Math.abs(correlation) >= threshold) {
          correlations.set(node.name, correlation);
        }
      }
    });

    return correlations;
  }

  private calculateCorrelation(analysis1: TraitAnalysis, analysis2: TraitAnalysis): number {
    const strengthDiff = analysis1.strength - analysis2.strength;
    const confidenceWeight = Math.min(analysis1.confidence, analysis2.confidence);
    return Math.tanh(strengthDiff * confidenceWeight);
  }
}