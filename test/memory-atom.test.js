import assert from 'assert';
import { MemoryAtom } from '../src/models/MemoryAtom.js';
import { MemoryStore } from '../src/services/MemoryStore.js';

async function runTests() {
  console.log('Running Memory Atomization Tests...\n');

  // Test 1: Memory Atom Creation
  console.log('Test 1: Memory Atom Creation');
  const memoryAtom = new MemoryAtom({
    type: 'test',
    title: 'Test Memory',
    summary: 'Test Summary',
    details: 'Test Details',
    keyTerms: ['test'],
    tags: ['test'],
    context: 'Test Context'
  });

  assert(memoryAtom.memoryId, 'Memory ID should be generated');
  assert(memoryAtom.timestamp, 'Timestamp should be set');
  console.log('✓ Memory Atom created successfully\n');

  // Test 2: Memory Store Operations
  console.log('Test 2: Memory Store Operations');
  const store = new MemoryStore();
  const savedPath = await store.saveMemoryAtom(memoryAtom);
  assert(savedPath, 'File path should be returned after saving');

  const retrieved = await store.getMemoryAtom(memoryAtom.memoryId);
  assert.deepStrictEqual(retrieved, memoryAtom.toJSON(), 'Retrieved memory should match saved memory');
  console.log('✓ Memory Store operations successful\n');

  console.log('All tests passed! ✓');
}

runTests().catch(console.error);