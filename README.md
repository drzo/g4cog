# Memory Atomization System

A Node.js system for extracting, storing, and managing structured memory atoms from conversations. This system creates JSON-based memory atoms and builds thematic hypergraph lattices to represent relationships between memories.

## Architecture

The system follows a modular architecture with clear separation of concerns:

### Core Components

1. **Memory Atom (src/models/MemoryAtom.js)**
   - Represents individual memory units
   - Handles memory structure and serialization
   - Generates unique IDs for each memory
   - Maintains timestamps and metadata

2. **Memory Store (src/services/MemoryStore.js)**
   - Manages persistence of memory atoms
   - Handles file system operations
   - Provides CRUD operations for memory atoms

3. **Hypergraph (src/services/Hypergraph.js)**
   - Builds relationships between memory atoms
   - Detects shared properties (tags, key terms)
   - Tracks temporal proximity between memories
   - Generates a queryable memory network

### Directory Structure

```
memory-atomization/
├── memory_atoms/     # Storage directory for memory atom JSON files
├── src/
│   ├── models/      # Data models
│   ├── services/    # Business logic and storage operations
│   └── index.js     # Application entry point
├── test/            # Test files
└── hypergraph.json  # Generated hypergraph structure
```

## Memory Atom Structure

Each memory atom is stored as a JSON file with the following structure:

```json
{
  "memory_id": "unique-uuid",
  "type": "episodic",
  "timestamp": "ISO-8601-timestamp",
  "title": "Memory Title",
  "content": {
    "summary": "Brief summary",
    "details": "Detailed information",
    "keyTerms": ["term1", "term2"],
    "relatedMemories": []
  },
  "tags": ["tag1", "tag2"],
  "context": "Contextual information"
}
```

## Hypergraph Structure

The hypergraph represents relationships between memory atoms:

```json
{
  "nodes": {
    "memory-id": {
      // Memory atom data
    }
  },
  "hyperedges": {
    "edge-id": {
      "nodes": ["memory-id-1", "memory-id-2"],
      "relationships": [
        {
          "type": "shared_tags",
          "values": ["tag1", "tag2"]
        },
        {
          "type": "shared_key_terms",
          "values": ["term1", "term2"]
        },
        {
          "type": "temporal_proximity",
          "value": 3600000
        }
      ]
    }
  }
}
```

## Usage

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

### Running Tests

```bash
npm test
```

### Creating Memory Atoms

```javascript
import { MemoryAtom } from './models/MemoryAtom.js';
import { MemoryStore } from './services/MemoryStore.js';

const memoryStore = new MemoryStore();

const memory = new MemoryAtom({
  type: 'episodic',
  title: 'Example Memory',
  summary: 'Memory summary',
  details: 'Detailed information',
  keyTerms: ['term1', 'term2'],
  tags: ['tag1', 'tag2'],
  context: 'Context information'
});

await memoryStore.saveMemoryAtom(memory);
```

### Working with the Hypergraph

```javascript
import { Hypergraph } from './services/Hypergraph.js';

const hypergraph = new Hypergraph();

// Load memory atoms and build relationships
await hypergraph.loadMemoryAtoms();
hypergraph.createRelationships();

// Get related memories
const relatedMemories = hypergraph.getRelatedMemories('memory-id');

// Save hypergraph structure
await hypergraph.saveHypergraph('hypergraph.json');
```

## Features

- **Unique Identification**: UUID-based identifiers for each memory atom
- **Timestamp Tracking**: Automatic timestamp generation for each memory
- **Structured Storage**: JSON-based file storage for easy access
- **Relationship Detection**: 
  - Shared tags and key terms
  - Temporal proximity analysis
  - Contextual relationships
- **Hypergraph Generation**: Creates a network of related memories
- **Error Handling**: Robust error handling for all operations
- **Testing**: Comprehensive test suite for core functionality

## Relationship Types

1. **Shared Tags**
   - Connects memories with common tags
   - Strength based on number of shared tags

2. **Shared Key Terms**
   - Links memories using similar terminology
   - Enables thematic clustering

3. **Temporal Proximity**
   - Connects memories created within the same timeframe
   - Default window: 1 hour

## Future Enhancements

1. **Advanced Query Capabilities**
   - Graph traversal algorithms
   - Pattern matching
   - Semantic similarity scoring

2. **Memory Visualization**
   - Interactive graph visualization
   - Relationship exploration
   - Temporal analysis views

3. **Memory Analysis**
   - Cluster detection
   - Theme extraction
   - Temporal pattern analysis