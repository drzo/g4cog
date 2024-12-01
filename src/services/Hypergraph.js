import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEMORY_DIR = path.join(__dirname, '../../memory_atoms');

export class Hypergraph {
  constructor() {
    this.nodes = new Map();
    this.hyperedges = new Map();
  }

  async loadMemoryAtoms() {
    try {
      const files = await fs.readdir(MEMORY_DIR);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(MEMORY_DIR, file);
          const data = await fs.readFile(filePath, 'utf8');
          const memoryAtom = JSON.parse(data);
          this.addNode(memoryAtom);
        }
      }
    } catch (error) {
      console.error('Error loading memory atoms:', error);
      throw error;
    }
  }

  addNode(memoryAtom) {
    this.nodes.set(memoryAtom.memory_id, memoryAtom);
  }

  createRelationships() {
    // Clear existing hyperedges
    this.hyperedges.clear();

    // Create edges based on shared properties
    const nodeEntries = Array.from(this.nodes.entries());
    
    for (let i = 0; i < nodeEntries.length; i++) {
      const [id1, node1] = nodeEntries[i];
      
      for (let j = i + 1; j < nodeEntries.length; j++) {
        const [id2, node2] = nodeEntries[j];
        const relationships = this.findRelationships(node1, node2);
        
        if (relationships.length > 0) {
          const edgeId = `${id1}-${id2}`;
          this.hyperedges.set(edgeId, {
            nodes: [id1, id2],
            relationships
          });
        }
      }
    }
  }

  findRelationships(node1, node2) {
    const relationships = [];

    // Check shared tags
    const sharedTags = node1.tags.filter(tag => 
      node2.tags.includes(tag)
    );
    if (sharedTags.length > 0) {
      relationships.push({
        type: 'shared_tags',
        values: sharedTags
      });
    }

    // Check shared key terms
    const sharedKeyTerms = node1.content.keyTerms.filter(term =>
      node2.content.keyTerms.includes(term)
    );
    if (sharedKeyTerms.length > 0) {
      relationships.push({
        type: 'shared_key_terms',
        values: sharedKeyTerms
      });
    }

    // Check temporal proximity (within 1 hour)
    const timestamp1 = new Date(node1.timestamp);
    const timestamp2 = new Date(node2.timestamp);
    const timeDiff = Math.abs(timestamp1 - timestamp2);
    if (timeDiff <= 3600000) { // 1 hour in milliseconds
      relationships.push({
        type: 'temporal_proximity',
        value: timeDiff
      });
    }

    return relationships;
  }

  async saveHypergraph(outputPath) {
    const hypergraphData = {
      nodes: Object.fromEntries(this.nodes),
      hyperedges: Object.fromEntries(this.hyperedges)
    };

    try {
      await fs.writeFile(
        outputPath,
        JSON.stringify(hypergraphData, null, 2),
        'utf8'
      );
      console.log(`Hypergraph saved to ${outputPath}`);
    } catch (error) {
      console.error('Error saving hypergraph:', error);
      throw error;
    }
  }

  getRelatedMemories(memoryId) {
    const relatedMemories = new Map();

    for (const [edgeId, edge] of this.hyperedges) {
      if (edge.nodes.includes(memoryId)) {
        const otherId = edge.nodes.find(id => id !== memoryId);
        relatedMemories.set(otherId, {
          memory: this.nodes.get(otherId),
          relationships: edge.relationships
        });
      }
    }

    return relatedMemories;
  }
}