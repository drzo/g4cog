import assert from 'assert';
import { Hypergraph } from '../src/services/Hypergraph.js';
import { MemoryAtom } from '../src/models/MemoryAtom.js';
import { MemoryStore } from '../src/services/MemoryStore.js';

async function runTests() {
  console.log('Running Hypergraph Tests...\n');

  // Test 1: Hypergraph Creation and Memory Loading
  console.log('Test 1: Hypergraph Creation and Memory Loading');
  const hypergraph = new Hypergraph();
  await hypergraph.loadMemoryAtoms();
  assert(hypergraph.nodes.size > 0, 'Hypergraph should load existing memory atoms');
  console.log('✓ Hypergraph loaded memories successfully\n');

  // Test 2: Relationship Creation
  console.log('Test 2: Relationship Creation');
  hypergraph.createRelationships();
  assert(hypergraph.hyperedges.size > 0, 'Hypergraph should create relationships between nodes');
  console.log('✓ Relationships created successfully\n');

  // Test 3: Related Memories Retrieval
  console.log('Test 3: Related Memories Retrieval');
  const firstMemoryId = Array.from(hypergraph.nodes.keys())[0];
  const relatedMemories = hypergraph.getRelatedMemories(firstMemoryId);
  assert(relatedMemories instanceof Map, 'Related memories should be returned as a Map');
  console.log('✓ Related memories retrieved successfully\n');

  console.log('All Hypergraph tests passed! ✓');
}

runTests().catch(console.error);