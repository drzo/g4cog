import { z } from 'zod';
import { MemoryAtomSchema } from './memory';

export const RelationshipSchema = z.object({
  type: z.enum(['shared_tags', 'shared_key_terms', 'temporal_proximity']),
  values: z.array(z.string()).optional(),
  value: z.number().optional()
});

export const HyperedgeSchema = z.object({
  nodes: z.array(z.string()),
  relationships: z.array(RelationshipSchema)
});

export const HypergraphSchema = z.object({
  nodes: z.record(z.string(), MemoryAtomSchema),
  hyperedges: z.record(z.string(), HyperedgeSchema)
});

export type Relationship = z.infer<typeof RelationshipSchema>;
export type Hyperedge = z.infer<typeof HyperedgeSchema>;
export type Hypergraph = z.infer<typeof HypergraphSchema>;