import type { Atom } from '../types/atomspace';

export function findPatternMatches(
  pattern: Atom[],
  target: Atom[],
  threshold: number = 0.8
): Atom[][] {
  const matches: Atom[][] = [];
  const patternLength = pattern.length;

  for (let i = 0; i <= target.length - patternLength; i++) {
    const slice = target.slice(i, i + patternLength);
    if (comparePatterns(pattern, slice) >= threshold) {
      matches.push(slice);
    }
  }

  return matches;
}

export function comparePatterns(pattern1: Atom[], pattern2: Atom[]): number {
  if (pattern1.length !== pattern2.length) return 0;

  let matches = 0;
  for (let i = 0; i < pattern1.length; i++) {
    if (pattern1[i].type === pattern2[i].type &&
        pattern1[i].name === pattern2[i].name) {
      matches++;
    }
  }

  return matches / pattern1.length;
}

export function extractSubPattern(
  atoms: Atom[],
  startIndex: number,
  length: number
): Atom[] {
  return atoms.slice(startIndex, startIndex + length);
}