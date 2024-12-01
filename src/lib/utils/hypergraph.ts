import type { MemoryAtom } from '../types/memory';
import type { Hypergraph, Relationship } from '../types/hypergraph';
import { findSharedTags, findSharedKeyTerms, calculateTemporalProximity } from './memory';

export function createHypergraphEdge(memory1: MemoryAtom, memory2: MemoryAtom): Relationship[] {
  const relationships: Relationship[] = [];

  const sharedTags = findSharedTags(memory1, memory2);
  if (sharedTags.length > 0) {
    relationships.push({
      type: 'shared_tags',
      values: sharedTags
    });
  }

  const sharedKeyTerms = findSharedKeyTerms(memory1, memory2);
  if (sharedKeyTerms.length > 0) {
    relationships.push({
      type: 'shared_key_terms',
      values: sharedKeyTerms
    });
  }

  const temporalProximity = calculateTemporalProximity(memory1, memory2);
  if (temporalProximity <= 3600000) { // 1 hour in milliseconds
    relationships.push({
      type: 'temporal_proximity',
      value: temporalProximity
    });
  }

  return relationships;
}

export function findRelatedMemories(
  memoryId: string,
  hypergraph: Hypergraph
): Map<string, { memory: MemoryAtom; relationships: Relationship[] }> {
  const relatedMemories = new Map();

  Object.entries(hypergraph.hyperedges).forEach(([edgeId, edge]) => {
    if (edge.nodes.includes(memoryId)) {
      const otherId = edge.nodes.find(id => id !== memoryId);
      if (otherId) {
        relatedMemories.set(otherId, {
          memory: hypergraph.nodes[otherId],
          relationships: edge.relationships
        });
      }
    }
  });

  return relatedMemories;
}