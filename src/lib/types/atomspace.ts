import { z } from 'zod';

export const AtomTypeSchema = z.enum([
  'ConceptNode',
  'PredicateNode',
  'ListLink',
  'EvaluationLink',
  'InheritanceLink',
  'TransformerWeightLink'
]);

export const AtomSchema = z.object({
  id: z.string().uuid(),
  type: AtomTypeSchema,
  name: z.string(),
  value: z.number().optional(),
  outgoing: z.array(z.string()).default([]),
  attention: z.number().default(0),
});

export const AtomSpaceSchema = z.object({
  atoms: z.record(z.string(), AtomSchema),
  indices: z.object({
    byType: z.record(z.string(), z.array(z.string())),
    byName: z.record(z.string(), z.array(z.string())),
  }),
});

export type AtomType = z.infer<typeof AtomTypeSchema>;
export type Atom = z.infer<typeof AtomSchema>;
export type AtomSpace = z.infer<typeof AtomSpaceSchema>;