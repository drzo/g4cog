import { z } from 'zod';

export const MemoryContentSchema = z.object({
  summary: z.string(),
  details: z.string(),
  keyTerms: z.array(z.string()),
  relatedMemories: z.array(z.string())
});

export const MemoryAtomSchema = z.object({
  memory_id: z.string().uuid(),
  type: z.string(),
  timestamp: z.string().datetime(),
  title: z.string(),
  content: MemoryContentSchema,
  tags: z.array(z.string()),
  context: z.string()
});

export type MemoryContent = z.infer<typeof MemoryContentSchema>;
export type MemoryAtom = z.infer<typeof MemoryAtomSchema>;