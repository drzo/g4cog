import { v4 as uuidv4 } from 'uuid';
import type { MemoryAtom, MemoryContent } from '../types/memory';

export function createMemoryAtom({
  type,
  title,
  summary,
  details,
  keyTerms,
  tags,
  context
}: {
  type: string;
  title: string;
  summary: string;
  details: string;
  keyTerms: string[];
  tags: string[];
  context: string;
}): MemoryAtom {
  return {
    memory_id: uuidv4(),
    type,
    timestamp: new Date().toISOString(),
    title,
    content: {
      summary,
      details,
      keyTerms,
      relatedMemories: []
    },
    tags,
    context
  };
}

export function findSharedTags(memory1: MemoryAtom, memory2: MemoryAtom): string[] {
  return memory1.tags.filter(tag => memory2.tags.includes(tag));
}

export function findSharedKeyTerms(memory1: MemoryAtom, memory2: MemoryAtom): string[] {
  return memory1.content.keyTerms.filter(term => 
    memory2.content.keyTerms.includes(term)
  );
}

export function calculateTemporalProximity(memory1: MemoryAtom, memory2: MemoryAtom): number {
  const time1 = new Date(memory1.timestamp).getTime();
  const time2 = new Date(memory2.timestamp).getTime();
  return Math.abs(time1 - time2);
}