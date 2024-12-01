import type { Atom } from '../types/atomspace';

export interface TraitAnalysis {
  strength: number;
  confidence: number;
  relatedTraits: string[];
}

export function analyzeTraitStrength(
  traitAtoms: Atom[],
  threshold: number = 0.5
): TraitAnalysis {
  const strength = calculateTraitStrength(traitAtoms);
  const confidence = calculateConfidence(traitAtoms);
  const relatedTraits = findRelatedTraits(traitAtoms, threshold);

  return {
    strength,
    confidence,
    relatedTraits
  };
}

function calculateTraitStrength(atoms: Atom[]): number {
  if (atoms.length === 0) return 0;

  const values = atoms
    .filter(atom => atom.value !== undefined)
    .map(atom => atom.value as number);

  if (values.length === 0) return 0;

  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function calculateConfidence(atoms: Atom[]): number {
  if (atoms.length === 0) return 0;

  const attentionValues = atoms.map(atom => atom.attention);
  const avgAttention = attentionValues.reduce((sum, val) => sum + val, 0) / atoms.length;

  return Math.tanh(avgAttention); // Normalize to [-1, 1]
}

function findRelatedTraits(atoms: Atom[], threshold: number): string[] {
  const relatedTraits = new Set<string>();

  atoms.forEach(atom => {
    if (atom.attention >= threshold) {
      const name = atom.name.toLowerCase();
      if (name !== 'trait' && !relatedTraits.has(name)) {
        relatedTraits.add(name);
      }
    }
  });

  return Array.from(relatedTraits);
}