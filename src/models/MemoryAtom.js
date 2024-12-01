import { v4 as uuidv4 } from 'uuid';

export class MemoryAtom {
  constructor({
    memoryId = uuidv4(),
    type,
    title,
    summary,
    details,
    keyTerms,
    tags,
    context,
    related = []
  }) {
    this.memoryId = memoryId;
    this.type = type;
    this.timestamp = new Date().toISOString();
    this.title = title;
    this.content = {
      summary,
      details,
      keyTerms,
      relatedMemories: related
    };
    this.tags = tags;
    this.context = context;
  }

  toJSON() {
    return {
      memory_id: this.memoryId,
      type: this.type,
      timestamp: this.timestamp,
      title: this.title,
      content: this.content,
      tags: this.tags,
      context: this.context
    };
  }
}