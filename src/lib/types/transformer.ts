import { z } from 'zod';

export const TransformerLayerSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['attention', 'feedforward']),
  weights: z.record(z.string(), z.number()),
  biases: z.record(z.string(), z.number()),
});

export const TransformerConfigSchema = z.object({
  numLayers: z.number(),
  hiddenSize: z.number(),
  numHeads: z.number(),
  intermediateSize: z.number(),
  maxSequenceLength: z.number(),
});

export const TransformerStateSchema = z.object({
  layers: z.array(TransformerLayerSchema),
  config: TransformerConfigSchema,
});

export type TransformerLayer = z.infer<typeof TransformerLayerSchema>;
export type TransformerConfig = z.infer<typeof TransformerConfigSchema>;
export type TransformerState = z.infer<typeof TransformerStateSchema>;