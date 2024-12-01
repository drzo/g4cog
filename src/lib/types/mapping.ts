import { z } from 'zod';
import { AtomSchema } from './atomspace';
import { TransformerLayerSchema } from './transformer';

export const WeightMappingSchema = z.object({
  atomId: z.string().uuid(),
  layerId: z.string().uuid(),
  weightKey: z.string(),
  scaleFactor: z.number(),
});

export const TraitMappingSchema = z.object({
  traitName: z.string(),
  affectedWeights: z.array(WeightMappingSchema),
  strength: z.number(),
  confidence: z.number(),
});

export const MappingStateSchema = z.object({
  weightMappings: z.record(z.string(), WeightMappingSchema),
  traitMappings: z.record(z.string(), TraitMappingSchema),
});

export type WeightMapping = z.infer<typeof WeightMappingSchema>;
export type TraitMapping = z.infer<typeof TraitMappingSchema>;
export type MappingState = z.infer<typeof MappingStateSchema>;