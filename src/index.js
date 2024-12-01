import { MemoryAtom } from './models/MemoryAtom.js';
import { MemoryStore } from './services/MemoryStore.js';
import { Hypergraph } from './services/Hypergraph.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create example memory atoms
const memoryStore = new MemoryStore();

const exampleMemories = [
  new MemoryAtom({
    type: 'episodic',
    title: 'Recursive Identity Planning',
    summary: 'Discussion on recursive identity and volitional execution.',
    details: 'Integration of toroidal grammar, nested membranes, and hypergraph lattices.',
    keyTerms: ['recursive identity', 'toroidal grammar', 'hypergraph', 'Bolt'],
    tags: ['EchoCog', 'identity', 'execution'],
    context: 'Session with Dan, Deep Tree Echo, and Marduk'
  }),
  new MemoryAtom({
    type: 'episodic',
    title: 'Hypergraph Implementation',
    summary: 'Development of hypergraph lattice structure.',
    details: 'Implementation of relationship detection and memory linking.',
    keyTerms: ['hypergraph', 'lattice', 'memory linking'],
    tags: ['EchoCog', 'implementation', 'graph'],
    context: 'Development session'
  })
];

async function main() {
  try {
    // Save memory atoms
    for (const memory of exampleMemories) {
      await memoryStore.saveMemoryAtom(memory);
    }

    // Create and process hypergraph
    const hypergraph = new Hypergraph();
    await hypergraph.loadMemoryAtoms();
    hypergraph.createRelationships();

    // Save hypergraph structure
    const outputPath = path.join(__dirname, '../hypergraph.json');
    await hypergraph.saveHypergraph(outputPath);

    // Display relationships for the first memory
    const firstMemoryId = exampleMemories[0].memoryId;
    const relatedMemories = hypergraph.getRelatedMemories(firstMemoryId);
    
    console.log('\nRelationships for first memory:');
    for (const [relatedId, { memory, relationships }] of relatedMemories) {
      console.log(`\nRelated Memory: ${memory.title}`);
      console.log('Relationships:', JSON.stringify(relationships, null, 2));
    }
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

main();