import type { TransformerConfig } from '../types/transformer';
import { z } from 'zod';

export function validateTransformerConfig(config: TransformerConfig): boolean {
  try {
    const schema = z.object({
      numLayers: z.number().min(1).max(48),
      hiddenSize: z.number().multipleOf(64).min(64).max(4096),
      numHeads: z.number().min(1).max(64),
      intermediateSize: z.number().min(256).max(16384),
      maxSequenceLength: z.number().min(1).max(2048),
    });

    schema.parse(config);
    return true;
  } catch (error) {
    return false;
  }
}

export function validateTraitValue(value: number): boolean {
  return value >= -1 && value <= 1;
}

export function validateTraitName(name: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9_]{2,31}$/.test(name);
}